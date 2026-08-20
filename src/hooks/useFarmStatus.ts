import { useEffect, useState } from 'react'
import { getFarmStatus, type FarmStatusResponse } from '../lib/api/farmStatus'

const CACHE_KEY = 'ggb:farm-status'

function readCache(): FarmStatusResponse | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as FarmStatusResponse) : null
  } catch {
    return null
  }
}

// TEMPORÁRIO — trocar pra false (ou apagar o bloco) depois de conferir o
// layout. Flag explícita em vez de import.meta.env.DEV: sob dev:full o
// bundle do React vem do Vite (DEV=true), mas o Fast Refresh preserva o
// state do hook entre edições — se o fetch real já tinha resolvido antes
// dessa mudança, o valor inicial do useState (que só roda na 1ª montagem)
// nunca é reavaliado. Um reload completo (não HMR) resolveria, mas essa
// flag garante o mock em qualquer cenário sem depender disso.
const FORCE_MOCK = true

const MOCK_FARM_STATUS: FarmStatusResponse = {
  ok: true,
  status: {
    hostStatus: 'running',
    mapName: 'BR-163 MS, Brazil',
    gameStatus: 'online',
    players: {
      count: 10,
      max: 10,
      list: [
        { name: 'Marcos', isAdmin: false, uptime: 142 },
        { name: 'JuliaFarm', isAdmin: false, uptime: 61 },
        { name: 'PedroBR', isAdmin: true, uptime: 205 },
        { name: 'Rex_Tratorzeiro', isAdmin: false, uptime: 12 },
        { name: 'GalindoGamerBR', isAdmin: true, uptime: 187 },
        { name: 'AnaSouza', isAdmin: false, uptime: 33 },
        { name: 'Lucas_Off', isAdmin: false, uptime: 98 },
        { name: 'CamilaTrator', isAdmin: false, uptime: 5 },
        { name: 'GabrielFS25', isAdmin: false, uptime: 76 },
        { name: 'Nina_Roça', isAdmin: false, uptime: 154 },
      ],
    },
    uptime: '3h 6min',
    healthy: true,
    updatedAt: new Date().toISOString(),
  },
}

// Sem polling de propósito (ao contrário de useLiveStatus/useCommunityStats)
// — o bot do Discord já fica atualizando a cada 30s por lá, aqui é só uma
// consulta ao entrar em /fazenda. Hidrata do localStorage pra evitar o
// flash "carregando" em quem já visitou antes.
export function useFarmStatus(): FarmStatusResponse | null {
  const [status, setStatus] = useState<FarmStatusResponse | null>(() => (FORCE_MOCK ? MOCK_FARM_STATUS : readCache()))

  useEffect(() => {
    if (FORCE_MOCK) return
    let active = true
    getFarmStatus().then((s) => {
      if (!active) return
      setStatus(s)
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(s))
      } catch {
        // localStorage indisponível (modo privado, storage cheio etc.) — só não persiste
      }
    })
    return () => {
      active = false
    }
  }, [])

  return status
}
