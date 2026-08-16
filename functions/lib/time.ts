// D1/SQLite `datetime('now')` retorna 'YYYY-MM-DD HH:MM:SS' em UTC, sem
// 'T' nem milissegundos. Comparações de string (`expires_at > datetime('now')`)
// só funcionam corretamente se os timestamps gravados usarem o mesmo
// formato — um ISO 8601 com 'T' comparado por string ficaria sempre
// "maior" que o formato do SQLite para a mesma data (o caractere 'T' tem
// código maior que o espaço), fazendo expiração nunca disparar dentro do
// mesmo dia. Por isso todo timestamp gravado no D1 passa por aqui.
export function sqliteDatetimePlus(ms: number): string {
  return new Date(Date.now() + ms).toISOString().slice(0, 19).replace('T', ' ')
}
