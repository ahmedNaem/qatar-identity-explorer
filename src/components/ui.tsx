import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { sfx } from '../lib/audio'
import { useGame } from '../lib/store'
import { Backdrop, Boy, Burst, Icon, type BackdropKind, type Mood } from './art'
import { POINTS_CORRECT, STAGES, type Question } from '../data/content'

export const SCHOOL = 'مدرسة الثمامة الابتدائية للبنين'

/* صورة: رمز تعبيري أو أيقونة مرسومة */
export function Pic({ icon, size = 90 }: { icon: string; size?: number }) {
  return /^[a-z]+$/.test(icon) ? <Icon id={icon} size={size} /> : <span style={{ fontSize: size * 0.75, lineHeight: 1 }}>{icon}</span>
}

/* ───────── سياق المرحلة ───────── */
interface StageCtx { award: (n: number) => void; mistake: () => void; mood: Mood; setMood: (m: Mood) => void }
const SC = createContext<StageCtx>(null as any)
export const useStage = () => useContext(SC)

export interface Step { key: string; render: (next: () => void) => ReactNode }

export function StageRunner({ id, backdrop, steps, onExit, onNext }: {
  id: number; backdrop: BackdropKind; steps: Step[]; onExit: () => void; onNext: () => void
}) {
  const { finishStage } = useGame()
  const [i, setI] = useState(0)
  const [points, setPoints] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [mood, setMood] = useState<Mood>('happy')
  const [done, setDone] = useState(false)
  const st = STAGES[id - 1]
  const ctx: StageCtx = {
    award: n => setPoints(p => p + n),
    mistake: () => setMistakes(m => m + 1),
    mood, setMood,
  }
  const next = () => {
    sfx.whoosh()
    if (i + 1 >= steps.length) { finishStage(id, points, mistakes); setDone(true); sfx.win() }
    else { setI(i + 1); setMood('happy') }
  }
  const stars = mistakes <= 1 ? 3 : mistakes <= 4 ? 2 : 1
  return (
    <SC.Provider value={ctx}>
      <div className="relative min-h-full w-full overflow-hidden" style={{ minHeight: '100dvh' }}>
        <Backdrop kind={backdrop} />
        <TopBar title={`${id}. ${st.title}`} onHome={onExit} stagePoints={done ? 0 : points} />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-3 pb-6 pt-20 sm:px-6">
          <div className="mb-4 h-4 overflow-hidden rounded-full bg-black/25 shadow-inner">
            <motion.div className="h-full rounded-full bg-gradient-to-l from-gold to-amber-300" animate={{ width: `${(done ? 1 : i / steps.length) * 100}%` }} />
          </div>
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key={steps[i].key} initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }} transition={{ duration: 0.3 }}>
                {steps[i].render(next)}
              </motion.div>
            ) : (
              <motion.div key="done" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <StageComplete id={id} stars={stars} points={points} onExit={onExit} onNext={onNext} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SC.Provider>
  )
}

function StageComplete({ id, stars, points, onExit, onNext }: { id: number; stars: number; points: number; onExit: () => void; onNext: () => void }) {
  const st = STAGES[id - 1]
  return (
    <div className="panel relative mx-auto max-w-xl p-6 text-center">
      <Burst big />
      <h2 className="text-3xl font-black text-maroon">أحسنت! أكملت المرحلة 🎉</h2>
      <div className="my-3 flex justify-center gap-2 text-5xl">
        {[1, 2, 3].map(n => (
          <motion.span key={n} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3 + n * 0.25, type: 'spring' }}
            style={{ filter: n <= stars ? 'none' : 'grayscale(1) opacity(.3)' }} onAnimationStart={() => n <= stars && setTimeout(sfx.star, 300 + n * 250)}>⭐</motion.span>
        ))}
      </div>
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.2 }} className="mx-auto my-3 flex w-fit items-center gap-3 rounded-2xl bg-amber-100 px-5 py-3 text-2xl font-black text-maroon">
        <span className="text-5xl">{st.badgeEmoji}</span><div>شارة جديدة<br />«{st.badge}»</div>
      </motion.div>
      <p className="mb-4 text-2xl font-black text-slate-700">نقاط المرحلة: {points}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button className="btn3d white px-6 py-3 text-xl" onClick={onExit}>🗺️ الخريطة</button>
        <button className="btn3d gold px-8 py-3 text-xl" onClick={onNext}>{id < 5 ? 'المرحلة التالية ◀' : 'النهاية 🏆'}</button>
      </div>
    </div>
  )
}

/* ───────── الشريط العلوي ───────── */
export function TopBar({ title, onHome, stagePoints }: { title?: string; onHome?: () => void; stagePoints?: number }) {
  const { saved, total, setSound, setMusicOn } = useGame()
  return (
    <div className="fixed inset-x-0 top-0 z-40 flex items-center gap-2 bg-gradient-to-b from-maroon-dark/90 to-maroon/80 px-3 py-2 text-white shadow-lg backdrop-blur">
      {onHome && <button className="btn3d white px-3 py-1 text-lg" aria-label="الخريطة" onClick={() => { sfx.click(); onHome() }}>🗺️</button>}
      <div className="flex-1 truncate text-lg font-black sm:text-2xl">{title}</div>
      <div className="rounded-full bg-black/30 px-3 py-1 text-lg font-black">⭐ {total + (stagePoints ?? 0)}</div>
      <button className="btn3d white px-3 py-1 text-lg" aria-label="المؤثرات الصوتية" onClick={() => setSound(!saved.sfx)}>{saved.sfx ? '🔊' : '🔇'}</button>
      <button className="btn3d white px-3 py-1 text-lg" aria-label="الموسيقى" onClick={() => setMusicOn(!saved.music)}>{saved.music ? '🎵' : '🎶'}</button>
    </div>
  )
}

/* ───────── المرشد (شخصية + فقاعة) ───────── */
export function Guide({ text, children, mood }: { text: string; children?: ReactNode; mood?: Mood }) {
  const st = useStage()
  return (
    <div className="mb-4 flex items-end gap-2 sm:gap-4">
      <motion.div className="shrink-0" initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring' }}>
        <Boy size={90} mood={mood ?? st.mood} />
      </motion.div>
      <motion.div className="panel relative flex-1 p-3 text-lg font-bold leading-relaxed text-slate-800 sm:p-4 sm:text-2xl" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        {text}{children}
      </motion.div>
    </div>
  )
}

/* ───────── سؤال اختيار من متعدد ───────── */
export function Quiz({ question, onDone, compact }: { question: Question; onDone: () => void; compact?: boolean }) {
  const st = useStage()
  const [wrongSet, setWrongSet] = useState<number[]>([])
  const [right, setRight] = useState(false)
  const [shake, setShake] = useState(0)
  const [msg, setMsg] = useState('')
  const pick = (i: number) => {
    if (right || wrongSet.includes(i)) return
    if (i === question.answer) {
      sfx.correct(); setRight(true); st.setMood('cheer')
      st.award(wrongSet.length === 0 ? POINTS_CORRECT : Math.ceil(POINTS_CORRECT / 2))
    } else {
      sfx.wrong(); setWrongSet(w => [...w, i]); setShake(s => s + 1); st.mistake(); st.setMood('sad')
      setMsg(['لا بأس! جرّب مرة أخرى 💪', 'اقتربت! فكّر قليلاً 🤔', 'أنت تستطيع! حاول مجدداً 🌟'][wrongSet.length % 3])
      setTimeout(() => st.setMood('think'), 900)
    }
  }
  return (
    <motion.div className="panel relative mx-auto max-w-3xl p-4 sm:p-6" animate={{ x: shake ? [0, -12, 12, -8, 8, 0] : 0 }} transition={{ duration: 0.4 }} key={`q${shake}`}>
      {right && <Burst />}
      <div className="mb-4 flex items-center gap-3 text-2xl font-black text-maroon sm:text-3xl">
        {question.e && <span className="text-5xl">{question.e}</span>}<span>{question.q}</span>
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${compact ? 200 : 210}px, 1fr))` }}>
        {question.options.map((o, i) => {
          const isWrong = wrongSet.includes(i), isRight = right && i === question.answer
          return (
            <motion.button key={i} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => pick(i)} disabled={right && !isRight}
              className="flex items-center justify-center gap-3 rounded-2xl border-4 px-4 py-4 text-xl font-black sm:text-2xl"
              style={{ background: isRight ? '#bdf3c7' : isWrong ? '#ffd5d5' : '#fff', borderColor: isRight ? '#25a244' : isWrong ? '#e05252' : '#8A1538', color: '#3a1020', opacity: isWrong ? 0.55 : 1, boxShadow: '0 5px 0 rgba(0,0,0,.18)' }}>
              {o.e && <span className="text-4xl">{o.e}</span>}<span>{o.t}</span>{isRight && ' ✅'}
            </motion.button>
          )
        })}
      </div>
      <AnimatePresence>
        {!right && wrongSet.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 rounded-xl bg-amber-100 p-3 text-lg font-bold text-amber-900">
            {msg} {question.hint && <span>💡 {question.hint}</span>}
          </motion.div>
        )}
        {right && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
            <div className="rounded-xl bg-emerald-100 p-3 text-lg font-bold text-emerald-900">🎉 أحسنت! {question.fact}</div>
            <div className="mt-3 text-center"><button className="btn3d gold px-8 py-3 text-xl" onClick={() => { sfx.click(); onDone() }}>التالي ◀</button></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/** سلسلة أسئلة متتابعة داخل خطوة واحدة */
export function QuizSeries({ questions, onDone }: { questions: Question[]; onDone: () => void }) {
  const [i, setI] = useState(0)
  return (
    <div>
      <div className="mb-2 text-center text-xl font-black text-white drop-shadow">سؤال {i + 1} من {questions.length}</div>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
          <Quiz question={questions[i]} onDone={() => (i + 1 < questions.length ? setI(i + 1) : onDone())} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ───────── نافذة بطاقة ───────── */
export function Modal({ children, onClose }: { children: ReactNode; onClose?: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="panel relative max-h-[92dvh] w-full max-w-xl overflow-auto p-5 text-center" initial={{ scale: 0.6, rotate: -6 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ type: 'spring', damping: 14 }} onClick={e => e.stopPropagation()}>
        {children}
      </motion.div>
    </motion.div>
  )
}

/* ───────── الاكتشاف ───────── */
export interface Spot { id: string; title: string; icon: string; text: string; x?: number; y?: number; size?: number }
export function Discover({ spots, scene, prompt, onDone, withQuiz, needQuiz }: {
  spots: Spot[]; scene?: ReactNode; prompt: string; onDone: () => void
  withQuiz?: Record<string, Question>; needQuiz?: boolean
}) {
  const st = useStage()
  const [seen, setSeen] = useState<string[]>([])
  const [open, setOpen] = useState<Spot | null>(null)
  const [asking, setAsking] = useState(false)
  const all = seen.length === spots.length
  const close = (markSeen: boolean) => {
    if (open && markSeen && !seen.includes(open.id)) { const sid = open.id; setSeen(s => (s.includes(sid) ? s : [...s, sid])); sfx.star() }
    setOpen(null); setAsking(false); st.setMood('happy')
  }
  const tap = (s: Spot) => { sfx.click(); setOpen(s); setAsking(false) }
  const q = open && withQuiz?.[open.id]
  const btns = spots.map(s => {
    const done = seen.includes(s.id)
    return (
      <motion.button key={s.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }} onClick={() => tap(s)} aria-label={s.title}
        className={scene ? 'absolute -translate-x-1/2 -translate-y-1/2' : 'relative'}
        style={scene ? { left: `${s.x}%`, top: `${s.y}%` } : undefined}>
        {scene ? (
          <div className="relative">
            {!done && <span className="absolute inset-0 rounded-full border-4 border-gold" style={{ animation: 'pulse-ring 1.6s ease-out infinite' }} />}
            <div className="flex flex-col items-center rounded-2xl bg-white/90 px-2 pt-1 shadow-xl ring-4" style={{ ['--tw-ring-color' as any]: done ? '#25a244' : '#f2b632' }}>
              <Pic icon={s.icon} size={s.size ?? 64} />
              <span className="text-sm font-black text-maroon sm:text-lg">{s.title}{done ? ' ✅' : ''}</span>
            </div>
          </div>
        ) : (
          <div className="panel flex h-full flex-col items-center gap-1 p-3 ring-4" style={{ ['--tw-ring-color' as any]: done ? '#25a244' : 'transparent' }}>
            <div className="bob"><Pic icon={s.icon} size={s.size ?? 84} /></div>
            <span className="text-lg font-black text-maroon sm:text-xl">{s.title}{done ? ' ✅' : ''}</span>
          </div>
        )}
      </motion.button>
    )
  })
  return (
    <div>
      <Guide text={prompt} />
      <div className="mb-2 flex items-center justify-center gap-2 text-xl font-black text-white drop-shadow">
        اكتشفت {seen.length} من {spots.length}
        <div className="h-3 w-32 overflow-hidden rounded-full bg-black/30"><div className="h-full bg-gold transition-all" style={{ width: `${(seen.length / spots.length) * 100}%` }} /></div>
      </div>
      {scene ? (
        <div className="relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-3xl border-4 border-white shadow-2xl sm:aspect-[16/10]" style={{ maxWidth: 'min(900px, max(320px, calc((100dvh - 300px) * 1.6)))' }}>
          {scene}{btns}
        </div>
      ) : (
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">{btns}</div>
      )}
      <div className="mt-4 text-center">
        <AnimatePresence>{all && <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} className="btn3d gold px-10 py-3 text-2xl" onClick={() => { sfx.click(); onDone() }}>أكمل المغامرة ◀</motion.button>}</AnimatePresence>
      </div>
      <AnimatePresence>
        {open && (
          <Modal onClose={() => !needQuiz || seen.includes(open.id) ? close(!needQuiz) : undefined}>
            {!asking ? (<>
              <div className="bob mx-auto w-fit"><Pic icon={open.icon} size={130} /></div>
              <h3 className="my-2 text-3xl font-black text-maroon">{open.title}</h3>
              <p className="mb-4 text-xl font-bold leading-loose text-slate-700 sm:text-2xl">{open.text}</p>
              {q ? <button className="btn3d gold px-8 py-3 text-xl" onClick={() => { sfx.click(); setAsking(true) }}>جاهز للسؤال ❓</button>
                : <button className="btn3d px-8 py-3 text-xl" onClick={() => { sfx.click(); close(true) }}>فهمت! ✔️</button>}
            </>) : (
              <Quiz compact question={q!} onDone={() => close(true)} />
            )}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ───────── سحب وإفلات (يعمل بالسحب والنقر معاً) ───────── */
export interface DragCard { id: string; node: ReactNode }
export function DragBoard({ cards, slots, placed, onPlace, onRemove, status, slotLabel, slotWidth }: {
  cards: DragCard[]; slots: number; placed: (string | null)[]; onPlace: (card: string, slot: number) => void
  onRemove: (slot: number) => void; status?: (boolean | null)[]; slotLabel: (i: number) => ReactNode; slotWidth?: string
}) {
  const [sel, setSel] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const tray = cards.filter(c => !placed.includes(c.id))
  const byId = (id: string | null) => cards.find(c => c.id === id)
  const drop = (id: string, x: number, y: number) => {
    const els = document.elementsFromPoint(x - window.scrollX, y - window.scrollY)
    const el = els.find(e => (e as HTMLElement).dataset?.slot !== undefined) as HTMLElement | undefined
    if (el) { sfx.click(); onPlace(id, Number(el.dataset.slot)); setSel(null) }
    setDragging(null)
  }
  return (
    <div>
      <div className="mb-5 grid gap-3 justify-items-center" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${slots > 1 ? 150 : 220}px, 1fr))` }}>
        {Array.from({ length: slots }, (_, i) => {
          const c = byId(placed[i]); const s = status?.[i]
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="text-lg font-black text-white drop-shadow">{slotLabel(i)}</div>
              <button data-slot={i} onClick={() => { if (c) { onRemove(i); sfx.click() } else if (sel) { onPlace(sel, i); setSel(null); sfx.click() } }}
                className="flex min-h-[130px] w-full items-center justify-center rounded-2xl border-4 border-dashed p-2 transition"
                style={{ maxWidth: slotWidth ?? '100%', background: s === true ? '#bdf3c7' : s === false ? '#ffd5d5' : sel && !c ? 'rgba(255,240,180,.95)' : 'rgba(255,255,255,.75)', borderColor: s === true ? '#25a244' : s === false ? '#e05252' : '#8A1538' }}>
                {c ? c.node : <span className="text-lg font-bold text-maroon/60">{sel ? 'اضغط هنا' : 'اسحب هنا'}</span>}
              </button>
            </div>
          )
        })}
      </div>
      <div className="panel flex min-h-[120px] flex-wrap items-center justify-center gap-3 p-3">
        {tray.length === 0 && <span className="text-lg font-bold text-slate-500">كل البطاقات في أماكنها</span>}
        {tray.map(c => (
          <motion.div key={c.id} drag dragSnapToOrigin dragElastic={0.2} whileDrag={{ scale: 1.08, zIndex: 50 }}
            onDragStart={() => { setDragging(c.id); setSel(null) }}
            onDragEnd={(_, info) => drop(c.id, info.point.x, info.point.y)}
            onTap={() => { if (dragging) return; sfx.click(); setSel(s => (s === c.id ? null : c.id)) }}
            className="cursor-grab touch-none rounded-2xl bg-white p-2 shadow-lg"
            style={{ outline: sel === c.id ? '5px solid #f2b632' : '3px solid #e8d8b0', position: 'relative', zIndex: dragging === c.id ? 50 : 1 }}>
            {c.node}
          </motion.div>
        ))}
      </div>
      <p className="mt-2 text-center text-base font-bold text-white drop-shadow">💡 اسحب البطاقة إلى مكانها، أو اضغط عليها ثم اضغط على المكان.</p>
    </div>
  )
}

export function useTimeout() {
  const r = useRef<number[]>([])
  useEffect(() => () => r.current.forEach(clearTimeout), [])
  return (fn: () => void, ms: number) => { r.current.push(window.setTimeout(fn, ms)) }
}
