export type PartnershipSubmission = { name: string; email: string; phone: string; message: string }
type PartnershipResponse = { ok: true } | { ok: false; error: string }

export async function sendPartnershipMessage(submission: PartnershipSubmission): Promise<PartnershipResponse> {
  const res = await fetch('/api/partnership', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(submission),
  })
  return res.json() as Promise<PartnershipResponse>
}
