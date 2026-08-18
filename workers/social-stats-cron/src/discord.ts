// Endpoint público oficial do Discord — não é scraping, é a forma suportada
// de pegar contagem de membros sem precisar de bot/token, usando o mesmo
// código de convite já usado em src/data/socials.ts no site.
export async function fetchDiscordMembers(inviteCode: string): Promise<number | null> {
  const res = await fetch(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`)
  if (!res.ok) return null

  const data = (await res.json()) as { approximate_member_count?: number }
  return data.approximate_member_count ?? null
}
