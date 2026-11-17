import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Backdrop, Badge, Boy, Burst, QatarFlag } from './components/art'
import { Modal, SCHOOL, TopBar } from './components/ui'
import { sfx } from './lib/audio'
import { useGame } from './lib/store'
import {
  EXTRA_CLASS_QUESTIONS, STAGES, STAGE1_QUESTIONS, STAGE2_QUESTIONS, STAGE3_QUESTIONS, STAGE5_QUESTIONS, TREASURES, type Question,
} from './data/content'

/* ───────── شاشة البداية ───────── */
export function Start({ onSolo, onClass }: { onSolo: () => void; onClass: () => void }) {
  const { saved, setMusicOn } = useGame()
  const started = Object.keys(saved.stages).length > 0
  const go = (f: () => void) => { sfx.click(); if (!saved.music && !localStorage.getItem('q-music-asked')) { try { localStorage.setItem('q-music-asked', '1') } catch { /* */ } } f() }
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <Backdrop kind="day" />
      <div className="absolute end-3 top-3 z-20 flex gap-2">
        <button className="btn3d white px-3 py-1 text-xl" aria-label="الموسيقى" onClick={() => setMusicOn(!saved.music)}>{saved.music ? '🎵' : '🎶'}</button>
      </div>
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center gap-2 px-4 py-6 text-center">
        <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring' }} className="flex items-end justify-center gap-4">
          <div className="origin-bottom-left" style={{ transform: 'perspective(500px) rotateY(-14deg)' }}>
            <div className="flex" dir="ltr">
              <div className="mx-1 h-[130px] w-[7px] rounded-full bg-gradient-to-b from-amber-200 to-amber-600 shadow" />
              <QatarFlag width={210} />
            </div>
          </div>
        </motion.div>
        <motion.h1 initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }}
          className="text-5xl font-black text-white sm:text-7xl" style={{ textShadow: '0 4px 0 #5e0d26, 0 8px 18px rgba(0,0,0,.45)', WebkitTextStroke: '10px #5e0d26', paintOrder: 'stroke fill' }}>
          مستكشف الهوية القطرية
        </motion.h1>
        <p className="text-xl font-black text-maroon-dark drop-shadow sm:text-3xl" style={{ textShadow: '0 2px 0 #fff' }}>رحلة ممتعة لاكتشاف وطننا وتراثنا</p>
        <div className="flex items-end justify-center gap-2">
          <Boy size={130} mood="happy" />
          <div className="flex flex-col gap-3">
            <motion.button className="btn3d gold px-10 py-5 text-3xl sm:text-4xl" animate={{ scale: [1, 1.07, 1] }} transition={{ repeat: Infinity, duration: 1.6 }} whileTap={{ scale: 0.95 }} onClick={() => go(onSolo)}>
              🚀 ابدأ المغامرة
            </motion.button>
            <button className="btn3d px-6 py-3 text-xl" onClick={() => go(onClass)}>🏆 تحدّي الفصل (للمعلم)</button>
          </div>
        </div>
        {started && <div className="rounded-full bg-white/80 px-4 py-1 text-lg font-bold text-maroon">تقدّمك محفوظ، سنكمل من حيث توقفت ✅</div>}
        <div className="mt-1 rounded-full bg-maroon-dark/80 px-4 py-1 text-base font-bold text-white">{SCHOOL}</div>
      </div>
    </div>
  )
}

/* ───────── خريطة المراحل ───────── */
export function WorldMap({ onPlay, onHome, onFinale }: { onPlay: (id: number) => void; onHome: () => void; onFinale: () => void }) {
  const { saved, total, isUnlocked, resetAll } = useGame()
  const [confirm, setConfirm] = useState(false)
  const doneCount = STAGES.filter(s => saved.stages[s.id]?.done).length
  const all = doneCount === STAGES.length
  const bgs = ['#2a8fc0', '#e08a3c', '#4a8fd8', '#b8845a', '#2b6cb0']
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <Backdrop kind="map" />
      <TopBar title="خريطة المغامرة" onHome={onHome} />
      <div className="relative z-10 mx-auto max-w-5xl px-3 pb-8 pt-20">
        <div className="panel mb-4 flex flex-wrap items-center gap-3 p-3">
          <Boy size={70} mood={all ? 'cheer' : 'happy'} />
          <div className="min-w-[200px] flex-1">
            <div className="text-xl font-black text-maroon">أنجزت {doneCount} من 5 مراحل</div>
            <div className="mt-1 h-5 overflow-hidden rounded-full bg-slate-200"><motion.div className="h-full bg-gradient-to-l from-gold to-amber-300" animate={{ width: `${(doneCount / 5) * 100}%` }} /></div>
          </div>
          <div className="rounded-xl bg-amber-100 px-4 py-2 text-xl font-black text-maroon">⭐ {total} نقطة</div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STAGES.map((s, i) => {
            const r = saved.stages[s.id]; const open = isUnlocked(s.id)
            return (
              <motion.button key={s.id} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}
                whileHover={open ? { scale: 1.04, rotate: -1 } : undefined} whileTap={open ? { scale: 0.96 } : undefined}
                disabled={!open} onClick={() => { sfx.click(); onPlay(s.id) }}
                className="panel relative overflow-hidden p-0 text-start disabled:opacity-60" style={{ cursor: open ? 'pointer' : 'not-allowed' }}>
                <div className="flex h-24 items-center justify-between px-4 text-white" style={{ background: `linear-gradient(135deg, ${bgs[i]}, #00000066)` }}>
                  {open ? <Badge n={s.id} size={80} locked={!r?.done} /> : <span className="text-6xl">🔒</span>}
                  <span className="text-5xl font-black opacity-80">{s.id}</span>
                </div>
                <div className="p-3">
                  <div className="text-2xl font-black text-maroon">{s.title}</div>
                  <div className="text-base font-bold text-slate-600">{s.sub}</div>
                  <div className="mt-2 flex items-center justify-between text-xl">
                    <span>{[1, 2, 3].map(n => <span key={n} style={{ filter: r && n <= r.stars ? 'none' : 'grayscale(1) opacity(.25)' }}>⭐</span>)}</span>
                    <span className="rounded-full px-3 py-1 text-base font-black" style={{ background: r?.done ? '#bdf3c7' : open ? '#fff3bf' : '#e5e5e5' }}>
                      {r?.done ? `🏅 ${s.badge}` : open ? 'ابدأ ◀' : 'مقفلة'}
                    </span>
                  </div>
                </div>
              </motion.button>
            )
          })}
          <div className="flex flex-col items-center justify-center gap-2 p-2">
            <button className="btn3d gold w-full px-4 py-4 text-2xl" disabled={!all} onClick={() => { sfx.click(); onFinale() }}>🏆 شهادة المستكشف {all ? '' : '🔒'}</button>
            <button className="text-base font-bold text-white underline drop-shadow" onClick={() => setConfirm(true)}>🔄 إعادة اللعبة من البداية</button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {confirm && (
          <Modal onClose={() => setConfirm(false)}>
            <div className="text-6xl">🔄</div>
            <h3 className="my-2 text-2xl font-black text-maroon">هل تريد مسح النقاط والشارات والبدء من جديد؟</h3>
            <div className="flex justify-center gap-3">
              <button className="btn3d px-6 py-3 text-xl" onClick={() => { resetAll(); setConfirm(false); sfx.click() }}>نعم، امسح</button>
              <button className="btn3d white px-6 py-3 text-xl" onClick={() => setConfirm(false)}>لا، ارجع</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ───────── الخاتمة ───────── */
export function Finale({ onBack }: { onBack: () => void }) {
  const { total, badges } = useGame()
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <Backdrop kind="day" />
      <Burst big n={36} />
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center gap-3 px-4 py-8 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="panel w-full p-5">
          <div className="flex items-end justify-center gap-3"><Boy size={120} mood="cheer" /><QatarFlag width={170} /></div>
          <h1 className="my-3 text-3xl font-black text-maroon sm:text-5xl">أحسنت! أصبحت مستكشفاً للهوية القطرية 🚩</h1>
          <div className="mx-auto mb-3 w-fit rounded-2xl bg-amber-100 px-6 py-3 text-3xl font-black text-maroon">⭐ مجموع نقاطك: {total}</div>
          <div className="flex flex-wrap justify-center gap-3">
            {STAGES.map(s => (
              <motion.div key={s.id} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: badges.includes(s.id) ? 1 : 0.3 }} transition={{ delay: 0.6 + s.id * 0.2 }}
                className="flex w-[110px] flex-col items-center rounded-2xl bg-gradient-to-b from-amber-100 to-amber-300 p-2 shadow-lg">
                <Badge n={s.id} size={80} locked={!badges.includes(s.id)} /><span className="text-sm font-black text-maroon">{s.badge}</span>
              </motion.div>
            ))}
          </div>
          <p className="mt-4 text-xl font-bold text-slate-700">نحن فخورون بك يا بطل! أنت تحمل هوية وطنك في قلبك.</p>
          <p className="text-base font-bold text-slate-500">{SCHOOL}</p>
          <button className="btn3d gold mt-4 px-8 py-3 text-xl" onClick={onBack}>🗺️ العودة إلى الخريطة</button>
        </motion.div>
      </div>
    </div>
  )
}

/* ───────── تحدّي الفصل ───────── */
function buildBank(): Question[] {
  return [...STAGE1_QUESTIONS, ...STAGE2_QUESTIONS, ...STAGE3_QUESTIONS, ...STAGE5_QUESTIONS, ...TREASURES.map(t => t.question), ...EXTRA_CLASS_QUESTIONS]
}
export function ClassMode({ onHome }: { onHome: () => void }) {
  const bank = useMemo(() => buildBank().sort(() => Math.random() - 0.5), [])
  const [i, setI] = useState(0)
  const [shown, setShown] = useState(false)
  const [scores, setScores] = useState({ maroon: 0, white: 0 })
  const [awarded, setAwarded] = useState(false)
  const [lastBurst, setLastBurst] = useState(0)
  const [pts, setPts] = useState(10)
  const q = bank[i % bank.length]
  const award = (team: 'maroon' | 'white' | null) => {
    if (awarded) return
    setAwarded(true)
    if (team) { sfx.correct(); setLastBurst(b => b + 1); setScores(s => ({ ...s, [team]: s[team] + pts })) } else sfx.click()
  }
  const nextQ = () => { sfx.whoosh(); setI(i + 1); setShown(false); setAwarded(false) }
  const lead = scores.maroon === scores.white ? 'تعادل 🤝' : scores.maroon > scores.white ? 'العنابي يتقدّم 🟣' : 'الأبيض يتقدّم ⚪'
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <Backdrop kind="night" />
      <TopBar title="تحدّي الفصل 🏆" onHome={onHome} />
      <div className="relative z-10 mx-auto max-w-6xl px-3 pb-6 pt-20">
        <div className="mb-3 grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-4">
          <div className="rounded-2xl bg-gradient-to-b from-maroon-light to-maroon p-3 text-center text-white shadow-xl"><div className="text-lg font-black sm:text-2xl">🟣 فريق العنابي</div>
            <motion.div key={scores.maroon} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="text-5xl font-black sm:text-7xl">{scores.maroon}</motion.div></div>
          <div className="flex flex-col items-center justify-center text-center text-white"><div className="text-lg font-black sm:text-2xl">{lead}</div><div className="text-base">سؤال {(i % bank.length) + 1}/{bank.length}</div></div>
          <div className="rounded-2xl bg-gradient-to-b from-white to-slate-200 p-3 text-center text-maroon shadow-xl"><div className="text-lg font-black sm:text-2xl">⚪ فريق الأبيض</div>
            <motion.div key={scores.white} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="text-5xl font-black sm:text-7xl">{scores.white}</motion.div></div>
        </div>
        <div className="panel relative p-4 sm:p-8">
          {lastBurst > 0 && <Burst key={lastBurst} />}
          <div className="flex items-center gap-4 text-3xl font-black text-maroon sm:text-5xl">{q.e && <span className="text-6xl sm:text-8xl">{q.e}</span>}<span>{q.q}</span></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {q.options.map((o, k) => (
              <div key={k} className="rounded-2xl border-4 p-4 text-center text-2xl font-black sm:text-4xl"
                style={{ borderColor: shown && k === q.answer ? '#25a244' : '#8A1538', background: shown && k === q.answer ? '#bdf3c7' : '#fff', opacity: shown && k !== q.answer ? 0.45 : 1 }}>
                {o.e && <div className="text-5xl">{o.e}</div>}{o.t}{shown && k === q.answer && ' ✅'}
              </div>
            ))}
          </div>
          {shown && q.fact && <div className="mt-3 rounded-xl bg-emerald-100 p-3 text-xl font-bold text-emerald-900">💡 {q.fact}</div>}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 border-t-2 border-dashed border-slate-300 pt-4">
            {!shown ? (
              <button className="btn3d gold px-8 py-3 text-2xl" onClick={() => { sfx.click(); setShown(true) }}>👀 أظهر الإجابة الصحيحة</button>
            ) : (<>
              <span className="text-lg font-black text-slate-700">من أجاب صحيحاً؟</span>
              <button className="btn3d px-5 py-3 text-xl" disabled={awarded} onClick={() => award('maroon')}>🟣 العنابي +{pts}</button>
              <button className="btn3d white px-5 py-3 text-xl" disabled={awarded} onClick={() => award('white')}>⚪ الأبيض +{pts}</button>
              <button className="btn3d white px-5 py-3 text-xl" disabled={awarded} onClick={() => award(null)}>🚫 لا أحد</button>
              <button className="btn3d gold px-6 py-3 text-xl" onClick={nextQ}>السؤال التالي ◀</button>
            </>)}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-white">
          <span className="font-black">قيمة السؤال:</span>
          {[5, 10, 20].map(n => <button key={n} className={`btn3d px-4 py-1 text-lg ${pts === n ? 'gold' : 'white'}`} onClick={() => setPts(n)}>{n}</button>)}
          <button className="btn3d white px-4 py-1 text-lg" onClick={() => { setScores({ maroon: 0, white: 0 }); sfx.click() }}>🔄 تصفير النتائج</button>
          <button className="btn3d white px-4 py-1 text-lg" onClick={() => { setScores(s => ({ ...s })); setI(Math.floor(Math.random() * bank.length)); setShown(false); setAwarded(false) }}>🎲 سؤال عشوائي</button>
        </div>
      </div>
    </div>
  )
}
