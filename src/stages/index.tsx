import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FINAL_CHOICES, FINAL_QUESTION, FUTURE_CARDS, HERO_CARDS, MAP_SPOTS, STAGE1_QUESTIONS, STAGE2_QUESTIONS,
  STAGE3_QUESTIONS, STAGE5_QUESTIONS, TIMELINE, TREASURES, VILLAGE_SPOTS, POINTS_CORRECT,
} from '../data/content'
import { Backdrop, Boy, Burst, FlagVariant, QatarMap, type FlagKind } from '../components/art'
import { DragBoard, Discover, Guide, QuizSeries, StageRunner, useStage, type Step } from '../components/ui'
import { sfx } from '../lib/audio'

const shuffle = <T,>(a: T[]): T[] => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]] } return b }

/* ───────── المرحلة 1 ───────── */
function FlagPick({ onDone }: { onDone: () => void }) {
  const st = useStage()
  const kinds = useMemo(() => shuffle<FlagKind>(['real', 'reversed', 'straight', 'seven', 'blue']).slice(0, 4).concat([]), [])
  const list = kinds.includes('real') ? kinds : ['real' as FlagKind, ...kinds.slice(0, 3)]
  const cards = useMemo(() => shuffle(list).map(k => ({ id: k, node: <FlagVariant kind={k} width={150} /> })), [])
  const [placed, setPlaced] = useState<(string | null)[]>([null])
  const [msg, setMsg] = useState('')
  const [ok, setOk] = useState(false)
  const [tries, setTries] = useState(0)
  const place = (id: string) => {
    if (ok) return
    if (id === 'real') { setPlaced([id]); setOk(true); sfx.correct(); st.setMood('cheer'); st.award(tries === 0 ? POINTS_CORRECT : 5) }
    else { sfx.wrong(); st.mistake(); st.setMood('sad'); setTries(t => t + 1); setMsg('هذا ليس علم قطر. عدد الرؤوس البيضاء تسعة، واللون عنابي، والأبيض جهة السارية. جرّب غيره! 💪') }
  }
  return (
    <div>
      <Guide text="أين علم قطر الحقيقي؟ اسحبه إلى الإطار! 🚩" />
      <DragBoard cards={cards} slots={1} placed={placed} onPlace={place} onRemove={() => { }} slotLabel={() => '🖼️ إطار علم قطر'} slotWidth="260px"
        status={[ok ? true : null]} />
      {msg && !ok && <div className="mx-auto mt-3 max-w-2xl rounded-xl bg-amber-100 p-3 text-lg font-bold text-amber-900">{msg}</div>}
      {ok && (
        <div className="relative mt-4 text-center">
          <Burst />
          <div className="mx-auto mb-3 max-w-xl rounded-xl bg-emerald-100 p-3 text-lg font-bold text-emerald-900">🎉 أحسنت! هذا هو علم قطر: عنابي وأبيض، وفيه 9 رؤوس بيضاء.</div>
          <button className="btn3d gold px-8 py-3 text-xl" onClick={onDone}>التالي ◀</button>
        </div>
      )}
    </div>
  )
}

export const stage1 = (): Step[] => [
  {
    key: 'map', render: next => (
      <Discover prompt="مرحباً! أنا مرشدك. اضغط على النقاط في الخريطة لتعرف وطنك 🗺️" onDone={next}
        scene={<div className="absolute inset-0 flex justify-center" style={{ background: 'linear-gradient(#2a8fc0,#7fd6ee)' }}>
          <QatarMap />
          <svg className="absolute right-[4%] top-[8%] hidden sm:block" width="80" viewBox="0 0 60 60" aria-hidden><circle cx="30" cy="30" r="28" fill="#fff" opacity=".8" /><path d="M30 6 L36 30 L30 54 L24 30Z" fill="#8A1538" /><text x="30" y="16" fontSize="9" textAnchor="middle" fill="#333">ش</text></svg>
        </div>}
        spots={[
          { ...MAP_SPOTS[0], x: 57, y: 45, size: 36 },
          { ...MAP_SPOTS[1], x: 85, y: 42, size: 36 },
          { ...MAP_SPOTS[2], x: 48, y: 87, size: 36 },
        ]} />
    ),
  },
  { key: 'q1', render: next => <QuizSeries questions={STAGE1_QUESTIONS.slice(0, 2)} onDone={next} /> },
  { key: 'flag', render: next => <FlagPick onDone={next} /> },
  { key: 'q2', render: next => <QuizSeries questions={STAGE1_QUESTIONS.slice(2)} onDone={next} /> },
]

/* ───────── المرحلة 2 ───────── */
export const stage2 = (): Step[] => [
  {
    key: 'village', render: next => (
      <Discover prompt="هذه قرية قطرية قديمة! اضغط على كل شيء لتعرف كيف عاش الأجداد 🌅" onDone={next}
        scene={<Backdrop kind="village" />}
        spots={[
          { ...VILLAGE_SPOTS[4], x: 17, y: 34, size: 56 },
          { ...VILLAGE_SPOTS[3], x: 48, y: 38, size: 56 },
          { ...VILLAGE_SPOTS[0], x: 80, y: 62, size: 56 },
          { ...VILLAGE_SPOTS[1], x: 50, y: 80, size: 50 },
          { ...VILLAGE_SPOTS[2], x: 17, y: 78, size: 50 },
        ]} />
    ),
  },
  { key: 'q', render: next => <QuizSeries questions={STAGE2_QUESTIONS} onDone={next} /> },
]

/* ───────── المرحلة 3 ───────── */
function TimelineGame({ onDone }: { onDone: () => void }) {
  const st = useStage()
  const cards = useMemo(() => shuffle(TIMELINE).map(ev => ({
    id: ev.id,
    node: <div className="flex w-[150px] flex-col items-center gap-1 p-1 text-center"><span className="text-4xl">{ev.e}</span><span className="text-base font-black leading-snug text-maroon">{ev.text}</span></div>,
  })), [])
  const [placed, setPlaced] = useState<(string | null)[]>(TIMELINE.map(() => null))
  const [status, setStatus] = useState<(boolean | null)[]>(TIMELINE.map(() => null))
  const [won, setWon] = useState(false)
  const [msg, setMsg] = useState('')
  const full = placed.every(Boolean)
  const place = (id: string, slot: number) => {
    setPlaced(p => { const n = p.map(x => (x === id ? null : x)); n[slot] = id; return n })
    setStatus(TIMELINE.map(() => null))
  }
  const check = () => {
    const res = placed.map((id, i) => id === TIMELINE[i].id)
    if (res.every(Boolean)) { setStatus(res); setWon(true); sfx.correct(); st.setMood('cheer'); st.award(20) }
    else {
      sfx.wrong(); st.mistake(); st.setMood('think'); setStatus(res)
      setMsg('بعض البطاقات ليست في مكانها. الأحداث الخضراء صحيحة، أما الحمراء فسنعيدها لتجرّب من جديد 💪')
      setTimeout(() => { setPlaced(placed.map((id, i) => (res[i] ? id : null))); setStatus(res.map(r => (r ? true : null))) }, 1300)
    }
  }
  return (
    <div>
      <Guide text="رتّب الأحداث من الأقدم إلى الأحدث 📜 (الأقدم في المكان رقم 1)" />
      <DragBoard cards={cards} slots={4} placed={placed} onPlace={place} onRemove={slot => { if (!won) setPlaced(p => p.map((x, i) => (i === slot ? null : x))) }}
        status={status} slotLabel={i => (won ? `📅 ${TIMELINE[i].year}` : `${i + 1}`)} />
      {msg && !won && <div className="mx-auto mt-3 max-w-2xl rounded-xl bg-amber-100 p-3 text-lg font-bold text-amber-900">{msg}</div>}
      <div className="relative mt-4 text-center">
        {won && <Burst />}
        {won && <div className="mx-auto mb-3 max-w-2xl rounded-xl bg-emerald-100 p-3 text-lg font-bold text-emerald-900">🎉 ممتاز! بدأت القصة عام 1878 مع الشيخ جاسم. ولاحظ أن استقلال قطر (1971) حدث بعد ذلك بزمن طويل.</div>}
        {!won && <button className="btn3d gold px-8 py-3 text-xl" disabled={!full} onClick={check}>تحقّق ✔️</button>}
        {won && <button className="btn3d gold px-8 py-3 text-xl" onClick={onDone}>التالي ◀</button>}
      </div>
    </div>
  )
}

export const stage3 = (): Step[] => [
  {
    key: 'cards', render: next => (
      <div>
        <div className="mb-3 flex justify-center">
          <div className="relative rounded-3xl bg-white/20 p-2 text-center backdrop-blur">
            <Boy size={150} variant="sheikh" mood="happy" wave={false} />
            <div className="text-sm font-bold text-white">رسم تخيّلي للشيخ جاسم</div>
          </div>
        </div>
        <Discover prompt="مرحباً بك في القلعة! اضغط على البطاقات لتتعرّف على بطل من أبطال تاريخنا 🏰" onDone={next} spots={HERO_CARDS} />
      </div>
    ),
  },
  { key: 'q', render: next => <QuizSeries questions={STAGE3_QUESTIONS} onDone={next} /> },
  { key: 'timeline', render: next => <TimelineGame onDone={next} /> },
]

/* ───────── المرحلة 4 ───────── */
export const stage4 = (): Step[] => [
  {
    key: 'museum', render: next => (
      <Discover needQuiz prompt="مرحباً في متحف التراث! اضغط على كل كنز، اقرأ عنه، ثم أجب عن سؤاله 🏺" onDone={next}
        spots={TREASURES.map(t => ({ id: t.id, title: t.title, icon: t.icon, text: t.text }))}
        withQuiz={Object.fromEntries(TREASURES.map(t => [t.id, t.question]))} />
    ),
  },
]

/* ───────── المرحلة 5 ───────── */
function FinalPick({ onDone }: { onDone: () => void }) {
  const st = useStage()
  const items = useMemo(() => shuffle(FINAL_CHOICES), [])
  const [sel, setSel] = useState<string[]>([])
  const [bad, setBad] = useState<string[]>([])
  const [msg, setMsg] = useState('')
  const [won, setWon] = useState(false)
  const [mist, setMist] = useState(0)
  const goodCount = FINAL_CHOICES.filter(c => c.good).length
  const toggle = (t: string) => { if (won) return; sfx.click(); setBad([]); setSel(s => (s.includes(t) ? s.filter(x => x !== t) : [...s, t])) }
  const check = () => {
    const wrong = sel.filter(t => !FINAL_CHOICES.find(c => c.t === t)!.good)
    if (wrong.length) {
      sfx.wrong(); st.mistake(); setMist(m => m + 1); setBad(wrong); st.setMood('sad')
      setMsg('بعض الاختيارات لا تساعد وطننا. ألغِ الخيارات الملوّنة بالأحمر وحاول مجدداً 💪')
      setTimeout(() => { setSel(s => s.filter(t => !wrong.includes(t))); setBad([]) }, 1400)
    } else if (sel.length < goodCount) {
      sfx.click(); setMsg(`أحسنت! اخترت ${sel.length}، وهناك اختيارات صحيحة أخرى. تابع البحث 🔍`)
    } else { sfx.win(); setWon(true); st.setMood('cheer'); st.award(mist === 0 ? 40 : 20) }
  }
  return (
    <div>
      <Guide text={FINAL_QUESTION + ' اختر كل الإجابات المناسبة 🌟'} />
      <div className="relative mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3">
        {won && <Burst big />}
        {items.map(c => {
          const on = sel.includes(c.t), isBad = bad.includes(c.t)
          return (
            <motion.button key={c.t} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => toggle(c.t)} animate={isBad ? { x: [0, -10, 10, -6, 6, 0] } : {}}
              className="flex flex-col items-center gap-1 rounded-2xl border-4 p-3 text-lg font-black sm:text-xl"
              style={{ background: isBad ? '#ffd5d5' : won && c.good ? '#bdf3c7' : on ? '#fff3bf' : '#fff', borderColor: isBad ? '#e05252' : on ? '#f2a900' : '#8A1538', color: '#3a1020', boxShadow: '0 5px 0 rgba(0,0,0,.18)' }}>
              <span className="text-5xl">{c.e}</span>{c.t}{on && !isBad && ' ✔️'}
            </motion.button>
          )
        })}
      </div>
      {msg && !won && <div className="mx-auto mt-3 max-w-2xl rounded-xl bg-amber-100 p-3 text-lg font-bold text-amber-900">{msg}</div>}
      <div className="mt-4 text-center">
        {!won && <button className="btn3d gold px-8 py-3 text-xl" disabled={sel.length === 0} onClick={check}>تأكيد الإجابة ✔️</button>}
        {won && <>
          <div className="mx-auto mb-3 max-w-2xl rounded-xl bg-emerald-100 p-3 text-lg font-bold text-emerald-900">🌟 رائع! بالعلم والنظافة والتعاون وتوفير الموارد تبني مستقبل قطر.</div>
          <button className="btn3d gold px-8 py-3 text-xl" onClick={onDone}>التالي ◀</button></>}
      </div>
    </div>
  )
}

export const stage5 = (): Step[] => [
  { key: 'cards', render: next => <Discover prompt="هذه الدوحة الحديثة! اكتشف كيف نبني مستقبل قطر 🌆" onDone={next} spots={FUTURE_CARDS} /> },
  { key: 'q', render: next => <QuizSeries questions={STAGE5_QUESTIONS} onDone={next} /> },
  { key: 'final', render: next => <FinalPick onDone={next} /> },
]

const CFG = [
  { fn: stage1, bg: 'map' }, { fn: stage2, bg: 'village' }, { fn: stage3, bg: 'castle' },
  { fn: stage4, bg: 'museum' }, { fn: stage5, bg: 'future' },
] as const

export function Stage({ id, onExit, onNext }: { id: number; onExit: () => void; onNext: () => void }) {
  const steps = useMemo(() => CFG[id - 1].fn(), [id])
  return <StageRunner id={id} backdrop={CFG[id - 1].bg} steps={steps} onExit={onExit} onNext={onNext} />
}
