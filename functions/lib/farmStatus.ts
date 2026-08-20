import type { Env } from './env'
import { fetchWithTimeout } from './http'
import { logWarn, logError } from './log'

export type FarmPlayer = { name: string; isAdmin: boolean; uptime: number }

// server_name nunca é repassado ao cliente (ver onRequestGet em
// functions/api/farm-status.ts) — o card em /fazenda não mostra o nome do
// servidor.
export type FarmStatus = {
  hostStatus: string
  mapName: string
  gameStatus: string
  players: { count: number; max: number; list: FarmPlayer[] }
  uptime: string
  healthy: boolean
  updatedAt: string
}

type RawFarmStatus = {
  host_status?: string
  map_name?: string
  game_status?: string
  players?: { count?: number; max?: number; list?: { name?: string; isAdmin?: boolean; uptime?: number }[] }
  uptime?: string
  healthy?: boolean
  updated_at?: string
}

// fs25-discord-monitor: bot que monitora o servidor dedicado da Fazenda Nova
// Aliança (Farming Simulator 25) e expõe esse status pro Discord. Auth level
// "function" — exige o code como query param, sem ele responde 401.
export async function fetchFarmStatus(env: Env): Promise<FarmStatus | null> {
  try {
    const res = await fetchWithTimeout(
      `https://fs25-discord-monitor.azurewebsites.net/api/status?code=${encodeURIComponent(env.FS25_MONITOR_FUNCTION_CODE)}`,
    )
    if (!res.ok) {
      logWarn('farmStatus', 'endpoint retornou erro', { status: res.status })
      return null
    }

    const data = (await res.json()) as RawFarmStatus
    return {
      hostStatus: data.host_status ?? 'unknown',
      mapName: data.map_name ?? '',
      gameStatus: data.game_status ?? 'unknown',
      players: {
        count: data.players?.count ?? 0,
        max: data.players?.max ?? 0,
        list: (data.players?.list ?? []).map((player) => ({
          name: player.name ?? '?',
          isAdmin: player.isAdmin ?? false,
          uptime: player.uptime ?? 0,
        })),
      },
      uptime: data.uptime ?? '',
      healthy: data.healthy ?? false,
      updatedAt: data.updated_at ?? new Date().toISOString(),
    }
  } catch (err) {
    logError('farmStatus', 'fetchFarmStatus falhou', { err })
    return null
  }
}
