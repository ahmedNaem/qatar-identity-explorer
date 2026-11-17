import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { STAGES } from '../data/content'
import { setMusic, setSfx } from './audio'

export type Mode = 'solo' | 'class'
export interface StageResult { done: boolean; stars: number; points: number }
export interface Saved {
  stages: Record<number, StageResult>
  sfx: boolean
  music: boolean
}
const KEY = 'qatar-explorer-v1'
const blank = (): Saved => ({ stages: {}, sfx: true, music: false })

function load(): Saved {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) { const s = JSON.parse(raw); return { ...blank(), ...s } }
  } catch { /* التخزين غير متاح */ }
  return blank()
}

interface Ctx {
  saved: Saved
  total: number
  badges: number[]
  finishStage: (id: number, points: number, mistakes: number) => void
  setSound: (sfx: boolean) => void
  setMusicOn: (m: boolean) => void
  resetAll: () => void
  isUnlocked: (id: number) => boolean
}
const C = createContext<Ctx>(null as any)
export const useGame = () => useContext(C)

export function GameProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<Saved>(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(saved)) } catch { /* تجاهل */ }
  }, [saved])
  useEffect(() => { setSfx(saved.sfx) }, [saved.sfx])
  useEffect(() => { setMusic(saved.music) }, [saved.music])

  const total = Object.values(saved.stages).reduce((a, s) => a + s.points, 0)
  const badges = STAGES.filter(s => saved.stages[s.id]?.done).map(s => s.id)

  const value: Ctx = {
    saved, total, badges,
    finishStage: (id, points, mistakes) => {
      const stars = mistakes <= 1 ? 3 : mistakes <= 4 ? 2 : 1
      setSaved(s => {
        const prev = s.stages[id]
        const best = prev && prev.points > points ? prev : { done: true, stars, points }
        return { ...s, stages: { ...s.stages, [id]: { ...best, done: true } } }
      })
    },
    setSound: sfx => setSaved(s => ({ ...s, sfx })),
    setMusicOn: music => setSaved(s => ({ ...s, music })),
    resetAll: () => { setSaved(s => ({ ...blank(), sfx: s.sfx, music: s.music })) },
    isUnlocked: id => id === 1 || !!saved.stages[id - 1]?.done,
  }
  return <C.Provider value={value}>{children}</C.Provider>
}
