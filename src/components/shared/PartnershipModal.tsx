import { useId, useState, type FormEvent } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Logo } from '../ui/Logo'
import { sendPartnershipMessage } from '../../lib/api/partnership'
import { PARTNERSHIP_TYPES, type PartnershipType } from '../../data/partnerships'

type PartnershipModalProps = {
  open: boolean
  onClose: () => void
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

const inputClasses = 'rounded-md border border-line bg-panel2 px-4 py-3 text-white outline-none focus:border-gold'

export function PartnershipModal({ open, onClose }: PartnershipModalProps) {
  const titleId = useId()
  const [company, setCompany] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [partnershipType, setPartnershipType] = useState<PartnershipType | ''>('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  function reset() {
    setCompany('')
    setName('')
    setEmail('')
    setPhone('')
    setPartnershipType('')
    setMessage('')
    setStatus('idle')
  }

  function handleClose() {
    onClose()
    // Espera o fechamento pra não "piscar" os campos esvaziando antes do modal sumir.
    setTimeout(reset, 200)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!partnershipType) return
    setStatus('submitting')
    const res = await sendPartnershipMessage({ company, name, email, phone, partnershipType, message })
    setStatus(res.ok ? 'success' : 'error')
  }

  return (
    <Modal open={open} onClose={handleClose} titleId={titleId}>
      {status === 'success' ? (
        <div className="text-center">
          <h2 id={titleId} className="text-2xl">
            MENSAGEM ENVIADA
          </h2>
          <p className="mt-3 text-muted">
            Recebemos seu contato e o Galindo vai responder direto no e-mail que você informou.
          </p>
          <Button variant="gold" className="mt-6" onClick={handleClose}>
            Fechar
          </Button>
        </div>
      ) : (
        <>
          <Logo className="h-14 w-14" />
          <h2 id={titleId} className="mt-3 text-2xl">
            QUERO SER PARCEIRO
          </h2>
          <p className="mt-2 text-muted">Conte um pouco sobre sua marca, produto ou proposta de parceria.</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-sm">
              Empresa / marca
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={inputClasses}
                placeholder="Nome da empresa ou marca"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              Seu nome
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClasses}
                placeholder="Nome do responsável pela proposta"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              E-mail
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
                placeholder="seu@email.com"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span>
                WhatsApp <span className="text-muted normal-case">(opcional)</span>
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClasses}
                placeholder="(00) 00000-0000"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              Tipo de parceria
              <select
                required
                value={partnershipType}
                onChange={(e) => setPartnershipType(e.target.value as PartnershipType | '')}
                className={inputClasses}
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                {PARTNERSHIP_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm">
              Mensagem
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`${inputClasses} resize-none`}
                placeholder="Conte um pouco sobre sua marca, produto ou proposta de parceria."
              />
            </label>

            {status === 'error' && (
              <p className="text-sm text-red">Não deu pra enviar agora. Tenta de novo em alguns minutos.</p>
            )}

            <div className="mt-2 flex gap-3">
              <Button type="submit" variant="gold" disabled={status === 'submitting'} className="flex-1">
                {status === 'submitting' ? 'Enviando...' : 'Enviar proposta'}
              </Button>
              <Button type="button" variant="default" onClick={handleClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </>
      )}
    </Modal>
  )
}
