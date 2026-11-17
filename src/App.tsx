import { Component, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ClassMode, Finale, Start, WorldMap } from './screens'
import { Stage } from './stages'

type Screen = { n: 'start' } | { n: 'map' } | { n: 'stage'; id: number } | { n: 'class' } | { n: 'finale' }

class Boundary extends Component<{ children: ReactNode }, { err: boolean }> {
  state = { err: false }
  static getDerivedStateFromError() { return { err: true } }
  render() {
    if (!this.state.err) return this.props.children
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-maroon p-6 text-center text-white">
        <div className="text-7xl">🙈</div><h1 className="text-3xl font-black">حدث خطأ بسيط</h1>
        <button className="btn3d gold px-8 py-3 text-2xl" onClick={() => location.reload()}>🔄 أعد التحميل</button>
      </div>
    )
  }
}

export default function App() {
  const [s, setS] = useState<Screen>({ n: 'start' })
  const key = s.n === 'stage' ? `stage${s.id}` : s.n
  return (
    <Boundary>
      <AnimatePresence mode="wait">
        <motion.div key={key} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          {s.n === 'start' && <Start onSolo={() => setS({ n: 'map' })} onClass={() => setS({ n: 'class' })} />}
          {s.n === 'map' && <WorldMap onPlay={id => setS({ n: 'stage', id })} onHome={() => setS({ n: 'start' })} onFinale={() => setS({ n: 'finale' })} />}
          {s.n === 'stage' && <Stage id={s.id} onExit={() => setS({ n: 'map' })} onNext={() => setS(s.id < 5 ? { n: 'stage', id: s.id + 1 } : { n: 'finale' })} />}
          {s.n === 'class' && <ClassMode onHome={() => setS({ n: 'start' })} />}
          {s.n === 'finale' && <Finale onBack={() => setS({ n: 'map' })} />}
        </motion.div>
      </AnimatePresence>
    </Boundary>
  )
}
