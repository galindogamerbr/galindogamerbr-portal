import type { PublishedSchedule } from './d1-schedule'
import { logWarn } from './log'

const DAY_NAMES = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

type StoredMessage = { message_id: string; schedule_signature: string }
type DiscordMessage = { id: string }

function timeIcon(startTime: string): string {
  return startTime < '12:00' ? '☀️' : '🌇'
}

export function formatScheduleForDiscord(schedule: PublishedSchedule): string {
  return schedule.weeks
    .map((week, weekIndex) => {
      const heading = schedule.weeks.length > 1 ? `**Semana ${weekIndex + 1}**\n` : ''
      const rows = DAY_NAMES.map((dayName, dayIndex) => {
        const blocks = week.blocks.filter((block) => block.dayOfWeek === dayIndex + 1)
        if (blocks.length === 0) return `**${dayName}:** 🔴 OFF-LINE`

        const times = blocks
          .map((block) => `${timeIcon(block.startTime)} ${block.startTime} às ${block.endTime}`)
          .join('  •  ')
        return `**${dayName}:** ${times}`
      })
      return `${heading}${rows.join('\n')}`
    })
    .join('\n\n')
}

function webhookMessageUrl(webhookUrl: string, messageId: string): string {
  return `${webhookUrl.replace(/\/$/, '')}/messages/${encodeURIComponent(messageId)}`
}

export async function publishScheduleToDiscord(
  db: D1Database,
  webhookUrl: string | undefined,
  schedule: PublishedSchedule,
  portraitImageDataUrl?: string,
): Promise<boolean> {
  if (!webhookUrl) {
    logWarn('discord-schedule', 'Webhook de programação não configurado')
    return false
  }

  const previous = await db
    .prepare('SELECT message_id, schedule_signature FROM schedule_discord_message WHERE id = 1')
    .first<StoredMessage>()
  const signature = JSON.stringify(schedule)
  if (previous?.schedule_signature === signature) return false

  const createUrl = new URL(webhookUrl)
  createUrl.searchParams.set('wait', 'true')
  const embed: Record<string, unknown> = {
    description: formatScheduleForDiscord(schedule),
    color: 0xd6a936,
    footer: { text: 'Horários de Brasília (GMT-3) • Sujeito a mudanças' },
  }
  const payload = {
    content: '📅 **PROGRAMAÇÃO DE LIVES ATUALIZADA**',
    embeds: [embed],
    allowed_mentions: { parse: [] },
  }

  let body: BodyInit
  let headers: HeadersInit | undefined
  const imageMatch = portraitImageDataUrl?.match(/^data:image\/png;base64,(.+)$/)
  if (imageMatch) {
    const bytes = Uint8Array.from(atob(imageMatch[1]), (char) => char.charCodeAt(0))
    const form = new FormData()
    embed.image = { url: 'attachment://programacao.png' }
    form.append('payload_json', JSON.stringify(payload))
    form.append('files[0]', new Blob([bytes], { type: 'image/png' }), 'programacao.png')
    body = form
  } else {
    headers = { 'content-type': 'application/json' }
    body = JSON.stringify(payload)
  }

  const response = await fetch(createUrl, { method: 'POST', headers, body })
  if (!response.ok) throw new Error(`Discord retornou HTTP ${response.status}`)

  const created = (await response.json()) as DiscordMessage
  if (!created.id) throw new Error('Discord não retornou o ID da mensagem criada')

  await db
    .prepare(
      `INSERT INTO schedule_discord_message (id, message_id, schedule_signature, updated_at)
       VALUES (1, ?, ?, datetime('now'))
       ON CONFLICT(id) DO UPDATE SET
         message_id = excluded.message_id,
         schedule_signature = excluded.schedule_signature,
         updated_at = excluded.updated_at`,
    )
    .bind(created.id, signature)
    .run()

  if (previous?.message_id) {
    const deleteResponse = await fetch(webhookMessageUrl(webhookUrl, previous.message_id), { method: 'DELETE' })
    if (!deleteResponse.ok && deleteResponse.status !== 404) {
      logWarn('discord-schedule', 'Não foi possível remover a mensagem anterior', {
        status: deleteResponse.status,
        messageId: previous.message_id,
      })
    }
  }

  return true
}
