import { useId, useMemo, type CSSProperties } from 'react'
import { motion } from 'framer-motion'

/* ───────── العلم ───────── */
function flagPath(): string {
  const th = 110 / 9
  let d = 'M0,0 L70,0'
  for (let i = 0; i < 9; i++) d += ` L100,${((i + 0.5) * th).toFixed(1)} L70,${((i + 1) * th).toFixed(1)}`
  return d + ' L0,110 Z'
}
const FLAG_WHITE = flagPath()

/** علم قطر: 9 رؤوس بيضاء. يتحرّك كأنه يرفرف بشرائح خفيفة */
export function QatarFlag({ width = 280, wave = true, style }: { width?: number; wave?: boolean; style?: CSSProperties }) {
  const id = useId().replace(/:/g, '')
  const N = 14, sw = 280 / N
  if (!wave) return (
    <svg viewBox="0 0 280 110" width={width} style={style} aria-label="علم قطر" role="img">
      <rect width="280" height="110" fill="#8A1538" /><path d={FLAG_WHITE} fill="#fff" />
    </svg>
  )
  return (
    <svg viewBox="0 -8 280 126" width={width} style={style} aria-label="علم قطر" role="img">
      <defs>
        <g id={`f${id}`}>
          <rect width="280" height="110" fill="#8A1538" />
          <path d={FLAG_WHITE} fill="#fff" />
        </g>
        <linearGradient id={`s${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".1" />
          <stop offset=".5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".12" />
        </linearGradient>
        {Array.from({ length: N }, (_, i) => (
          <clipPath key={i} id={`c${id}${i}`}><rect x={i * sw - 0.5} y="-10" width={sw + 1} height="140" /></clipPath>
        ))}
      </defs>
      {Array.from({ length: N }, (_, i) => (
        <g key={i} clipPath={`url(#c${id}${i})`}>
          <g style={wave ? { animation: `bob ${1.6}s ease-in-out ${i * 0.09}s infinite`, transformBox: 'fill-box' } : undefined}>
            <use href={`#f${id}`} />
          </g>
        </g>
      ))}
      <rect width="280" height="110" fill={`url(#s${id})`} pointerEvents="none" />
    </svg>
  )
}

/** أعلام وهمية للتمويه في مرحلة اختيار العلم */
export type FlagKind = 'real' | 'reversed' | 'straight' | 'seven' | 'blue'
export function FlagVariant({ kind, width = 200 }: { kind: FlagKind; width?: number }) {
  if (kind === 'real') return <QatarFlag width={width} wave={false} />
  const tooth = (n: number, tip: number, base: number, color: string, mirror: boolean) => {
    const th = 110 / n
    let d = mirror ? 'M280,0 L' + (280 - base) + ',0' : 'M0,0 L' + base + ',0'
    for (let i = 0; i < n; i++) {
      const tx = mirror ? 280 - tip : tip, vx = mirror ? 280 - base : base
      d += ` L${tx},${((i + 0.5) * th).toFixed(1)} L${vx},${((i + 1) * th).toFixed(1)}`
    }
    d += mirror ? ' L280,110 Z' : ' L0,110 Z'
    return <path d={d} fill={color} />
  }
  return (
    <svg viewBox="0 0 280 110" width={width} role="img" aria-label="علم">
      {kind === 'reversed' && (<><rect width="280" height="110" fill="#8A1538" />{tooth(9, 100, 70, '#fff', true)}</>)}
      {kind === 'straight' && (<><rect width="280" height="110" fill="#8A1538" /><rect width="80" height="110" fill="#fff" /></>)}
      {kind === 'seven' && (<><rect width="280" height="110" fill="#8A1538" />{tooth(5, 100, 70, '#fff', false)}</>)}
      {kind === 'blue' && (<><rect width="280" height="110" fill="#1f5fa8" />{tooth(9, 100, 70, '#fff', false)}</>)}
    </svg>
  )
}

/* ───────── الشخصية الكرتونية (ولد قطري) ───────── */
export type Mood = 'happy' | 'cheer' | 'sad' | 'think'
export function Boy({ size = 200, mood = 'happy', variant = 'boy', wave = true }: { size?: number; mood?: Mood; variant?: 'boy' | 'sheikh' | 'scout'; wave?: boolean }) {
  const id = useId().replace(/:/g, '')
  const sheikh = variant === 'sheikh'
  const robe = sheikh ? ['#f3ead6', '#cfc2a2'] : ['#ffffff', '#d9d4ca']
  return (
    <svg viewBox="0 0 200 300" width={size} height={size * 1.5} aria-hidden>
      <defs>
        <linearGradient id={`r${id}`} x1="0" x2="1"><stop offset="0" stopColor={robe[0]} /><stop offset=".6" stopColor="#fff" /><stop offset="1" stopColor={robe[1]} /></linearGradient>
        <radialGradient id={`k${id}`} cx=".4" cy=".35" r=".8"><stop offset="0" stopColor="#f8cf9f" /><stop offset="1" stopColor="#d79a63" /></radialGradient>
        <linearGradient id={`b${id}`} x1="0" x2="1"><stop offset="0" stopColor="#6b4a2a" /><stop offset="1" stopColor="#3f2a14" /></linearGradient>
      </defs>
      <ellipse cx="100" cy="289" rx="62" ry="8" fill="#000" opacity=".22" />
      {/* القدمان */}
      <ellipse cx="78" cy="282" rx="20" ry="8" fill="#6b4a2a" /><ellipse cx="122" cy="282" rx="20" ry="8" fill="#6b4a2a" />
      {/* الثوب */}
      <path d="M52 140 Q50 120 80 112 L120 112 Q150 120 148 140 L158 276 Q100 292 42 276 Z" fill={`url(#r${id})`} stroke="#cfc8b8" strokeWidth="2" />
      <path d="M100 118 L100 170" stroke="#cfc8b8" strokeWidth="2" />
      <circle cx="100" cy="150" r="2.5" fill="#bbb" /><circle cx="100" cy="166" r="2.5" fill="#bbb" />
      {sheikh && <path d="M52 140 Q50 118 80 108 L120 108 Q150 118 148 140 L162 270 L146 274 L140 150 L60 150 L54 274 L38 270 Z" fill={`url(#b${id})`} stroke="#f2b632" strokeWidth="3" />}
      {/* الذراع اليسرى */}
      {mood === 'cheer' ? (
        <motion.g animate={{ rotate: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 0.9 }} style={{ originX: '140px', originY: '125px' }}>
          <path d="M142 122 Q172 90 168 60" stroke={sheikh ? '#6b4a2a' : '#fff'} strokeWidth="20" strokeLinecap="round" fill="none" />
          <circle cx="168" cy="54" r="12" fill={`url(#k${id})`} />
        </motion.g>
      ) : (
        <>
          <path d="M142 124 Q158 170 146 200" stroke={sheikh ? '#6b4a2a' : '#fff'} strokeWidth="20" strokeLinecap="round" fill="none" />
          <circle cx="145" cy="204" r="11" fill={`url(#k${id})`} />
        </>
      )}
      {/* الذراع اليمنى (تلوّح) */}
      {wave && !sheikh && mood !== 'sad' ? (
        <motion.g animate={{ rotate: [0, -22, 8, -22, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }} style={{ originX: '60px', originY: '125px' }}>
          <path d="M58 122 Q28 92 34 62" stroke="#fff" strokeWidth="20" strokeLinecap="round" fill="none" />
          <circle cx="34" cy="56" r="12" fill={`url(#k${id})`} />
        </motion.g>
      ) : (
        <>
          <path d="M58 124 Q42 170 54 200" stroke={sheikh ? '#6b4a2a' : '#fff'} strokeWidth="20" strokeLinecap="round" fill="none" />
          <circle cx="55" cy="204" r="11" fill={`url(#k${id})`} />
        </>
      )}
      {/* الرأس */}
      <rect x="86" y="98" width="28" height="18" rx="8" fill={`url(#k${id})`} />
      <ellipse cx="100" cy="72" rx="36" ry="38" fill={`url(#k${id})`} />
      {/* اللحية للشيخ */}
      {sheikh && <path d="M66 78 Q70 116 100 120 Q130 116 134 78 Q124 98 100 98 Q76 98 66 78Z" fill="#3a3028" />}
      {/* الغترة */}
      <path d="M58 70 Q60 22 100 20 Q140 22 142 70 L150 118 Q130 108 126 84 Q100 52 74 84 Q70 108 50 118 Z" fill="#fff" stroke="#d6d0c2" strokeWidth="2" />
      <path d="M62 64 Q100 34 138 64" fill="none" stroke="#e5dfd1" strokeWidth="3" />
      {/* العقال */}
      <ellipse cx="100" cy="42" rx="40" ry="11" fill="none" stroke="#1e1e1e" strokeWidth="7" />
      <ellipse cx="100" cy="42" rx="40" ry="11" fill="none" stroke="#444" strokeWidth="2" strokeDasharray="4 5" />
      {/* الوجه */}
      <ellipse cx="86" cy="78" rx="5" ry={mood === 'cheer' ? 3 : 6} fill="#2a1a0e" />
      <ellipse cx="114" cy="78" rx="5" ry={mood === 'cheer' ? 3 : 6} fill="#2a1a0e" />
      <circle cx="88" cy="75" r="2" fill="#fff" /><circle cx="116" cy="75" r="2" fill="#fff" />
      <path d={mood === 'sad' ? 'M80 70 L92 66 M120 66 L108 70' : 'M78 66 Q86 61 94 65 M106 65 Q114 61 122 66'} stroke="#2a1a0e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="76" cy="90" rx="7" ry="4" fill="#f08a7a" opacity=".5" /><ellipse cx="124" cy="90" rx="7" ry="4" fill="#f08a7a" opacity=".5" />
      {mood === 'sad'
        ? <path d="M90 100 Q100 94 110 100" stroke="#8a3a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
        : mood === 'cheer'
          ? <path d="M88 94 Q100 112 112 94 Z" fill="#7a2020" stroke="#7a2020" strokeWidth="2" strokeLinejoin="round" />
          : <path d="M88 94 Q100 106 112 94" stroke="#8a3a2a" strokeWidth="3.5" fill="none" strokeLinecap="round" />}
    </svg>
  )
}

/* ───────── أيقونات التراث ───────── */
export function Icon({ id, size = 110 }: { id: string; size?: number }) {
  const u = useId().replace(/:/g, '')
  const g = (n: string, a: string, b: string) => <linearGradient id={`${n}${u}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>
  const wrap = (children: React.ReactNode) => <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>{children}</svg>
  switch (id) {
    case 'falcon': return wrap(<>
      <defs>{g('f', '#9a6a3a', '#5a3a1c')}</defs>
      <rect x="10" y="80" width="80" height="6" rx="3" fill="#6b4a2a" />
      <path d="M50 82 Q28 70 30 46 Q32 26 50 22 Q68 26 70 46 Q72 70 50 82Z" fill={`url(#f${u})`} />
      <path d="M50 38 Q38 50 40 70 Q50 62 50 38Z M50 38 Q62 50 60 70 Q50 62 50 38Z" fill="#f1e4c9" opacity=".9" />
      <circle cx="50" cy="26" r="13" fill="#7b5230" />
      <path d="M50 28 L60 33 L50 38Z" fill="#f2b632" /><circle cx="45" cy="24" r="3.4" fill="#fff" /><circle cx="45" cy="24" r="1.7" fill="#111" />
      <path d="M38 14 Q50 8 62 14" stroke="#2f1d0c" strokeWidth="3" fill="none" />
    </>)
    case 'dallah': return wrap(<>
      <defs>{g('d', '#ffe08a', '#b87a10')}</defs>
      <ellipse cx="50" cy="90" rx="26" ry="5" fill="#000" opacity=".18" />
      <path d="M30 88 L36 50 L64 50 L72 88Z" fill={`url(#d${u})`} stroke="#8a5a08" strokeWidth="2" />
      <path d="M36 50 L44 24 L56 24 L64 50Z" fill={`url(#d${u})`} stroke="#8a5a08" strokeWidth="2" />
      <path d="M44 24 L50 12 L56 24Z" fill="#c08a1c" /><circle cx="50" cy="11" r="3" fill="#ffe08a" />
      <path d="M36 54 Q10 52 12 28 Q14 22 20 24" fill="none" stroke="#b87a10" strokeWidth="4" strokeLinecap="round" />
      <path d="M66 54 Q86 56 84 78 Q80 86 72 84" fill="none" stroke="#8a5a08" strokeWidth="5" strokeLinecap="round" />
      <path d="M34 66 H70 M33 76 H71" stroke="#8a5a08" strokeWidth="2" strokeDasharray="3 3" />
    </>)
    case 'finjan': return wrap(<>
      <defs>{g('j', '#fff', '#d9cfb8')}</defs>
      <ellipse cx="50" cy="86" rx="30" ry="5" fill="#000" opacity=".18" />
      <path d="M20 40 Q20 80 50 80 Q80 80 80 40Z" fill={`url(#j${u})`} stroke="#b89a5a" strokeWidth="2" />
      <ellipse cx="50" cy="40" rx="30" ry="7" fill="#5a3a1c" stroke="#b89a5a" strokeWidth="2" />
      <path d="M26 56 H74 M30 66 H70" stroke="#8A1538" strokeWidth="3" strokeDasharray="5 4" />
      <path d="M80 46 Q96 50 88 64 Q84 68 76 66" fill="none" stroke="#b89a5a" strokeWidth="4" />
      <path d="M40 24 Q36 16 42 10 M52 26 Q48 16 54 8" stroke="#bbb" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".8" />
    </>)
    case 'sadu': return wrap(<>
      <rect x="8" y="14" width="84" height="72" rx="6" fill="#8A1538" />
      {[0, 1, 2, 3, 4, 5].map(i => <rect key={i} x="8" y={14 + i * 12} width="84" height="6" fill={i % 2 ? '#f3dfb0' : '#1e1e1e'} opacity=".9" />)}
      {[0, 1, 2, 3, 4, 5, 6].map(i => <path key={i} d={`M${12 + i * 12} 56 l6 -10 l6 10 l-6 10Z`} fill="#f2b632" stroke="#1e1e1e" strokeWidth="1" />)}
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <line key={i} x1={14 + i * 10} y1="86" x2={14 + i * 10} y2="96" stroke="#f3dfb0" strokeWidth="2" />)}
    </>)
    case 'majlis': return wrap(<>
      <rect x="0" y="0" width="100" height="100" fill="#f3dfb0" />
      <path d="M20 70 V34 Q20 14 50 14 Q80 14 80 34 V70Z" fill="#7ec8e3" stroke="#8A1538" strokeWidth="4" />
      <circle cx="62" cy="34" r="7" fill="#ffe08a" />
      <rect x="0" y="70" width="100" height="30" fill="#b85c3a" />
      <rect x="6" y="64" width="88" height="14" rx="7" fill="#8A1538" /><rect x="6" y="64" width="88" height="5" rx="3" fill="#b83358" />
      <rect x="12" y="56" width="22" height="18" rx="6" fill="#f2b632" /><rect x="66" y="56" width="22" height="18" rx="6" fill="#f2b632" />
      <ellipse cx="50" cy="88" rx="12" ry="6" fill="#ffe08a" stroke="#8a5a08" strokeWidth="2" />
    </>)
    case 'thobe': return wrap(<>
      <path d="M34 54 L26 92 L74 92 L66 54Z" fill="#fff" stroke="#cfc8b8" strokeWidth="2" />
      <ellipse cx="50" cy="32" rx="14" ry="15" fill="#e5ac78" />
      <path d="M32 34 Q32 8 50 8 Q68 8 68 34 L72 54 Q60 50 60 40 Q50 24 40 40 Q40 50 28 54Z" fill="#fff" stroke="#d6d0c2" strokeWidth="2" />
      <ellipse cx="50" cy="15" rx="19" ry="5" fill="none" stroke="#1e1e1e" strokeWidth="4" />
      <circle cx="44" cy="34" r="2" fill="#2a1a0e" /><circle cx="56" cy="34" r="2" fill="#2a1a0e" />
      <path d="M44 42 Q50 47 56 42" stroke="#8a3a2a" strokeWidth="2" fill="none" />
    </>)
    case 'ship': return wrap(<>
      <defs>{g('h', '#a8703a', '#5a3a1c')}</defs>
      <path d="M0 76 Q12 70 24 76 T48 76 T72 76 T100 74 V100 H0Z" fill="#1fa3c6" opacity=".85" />
      <path d="M10 62 H90 Q84 80 66 82 H30 Q16 80 10 62Z" fill={`url(#h${u})`} stroke="#3f2a14" strokeWidth="2" />
      <path d="M90 62 L96 54" stroke="#3f2a14" strokeWidth="4" strokeLinecap="round" />
      <line x1="46" y1="64" x2="46" y2="10" stroke="#3f2a14" strokeWidth="3" />
      <path d="M48 12 Q78 28 84 60 L48 60Z" fill="#fff" stroke="#d6d0c2" strokeWidth="2" />
      <path d="M44 20 Q24 34 14 60 H44Z" fill="#f3dfb0" stroke="#d6d0c2" strokeWidth="2" />
      <path d="M0 80 Q12 74 24 80 T48 80 T72 80 T100 78" stroke="#fff" strokeWidth="2.5" fill="none" opacity=".8" />
    </>)
    case 'pearl': return wrap(<>
      <defs>
        <radialGradient id={`p${u}`} cx=".35" cy=".3" r=".8"><stop offset="0" stopColor="#fff" /><stop offset=".6" stopColor="#f0e6f3" /><stop offset="1" stopColor="#b9a8c4" /></radialGradient>
        {g('o', '#d7c3b0', '#8d7460')}
      </defs>
      <path d="M8 62 Q10 84 50 88 Q90 84 92 62 Q50 72 8 62Z" fill={`url(#o${u})`} stroke="#6b5646" strokeWidth="2" />
      <path d="M10 62 Q4 28 50 22 Q96 28 90 62 Q50 50 10 62Z" fill={`url(#o${u})`} stroke="#6b5646" strokeWidth="2" />
      <path d="M22 56 Q22 36 50 30 M78 56 Q78 36 50 30 M50 30 V54" stroke="#6b5646" strokeWidth="1.5" fill="none" opacity=".5" />
      <circle cx="50" cy="62" r="13" fill={`url(#p${u})`} stroke="#c9b8d2" strokeWidth="1.5" />
      <circle cx="45" cy="57" r="4" fill="#fff" opacity=".85" />
    </>)
    case 'camel': return wrap(<>
      <path d="M14 70 Q10 46 30 44 Q36 30 46 44 Q58 40 72 46 Q86 44 88 56 L84 70 L78 70 L76 88 H70 L68 70 H36 L34 88 H28 L26 70Z" fill="#d9a05a" stroke="#8a5a28" strokeWidth="2" />
      <path d="M78 46 Q84 24 92 22 L98 28 Q92 34 88 48Z" fill="#d9a05a" stroke="#8a5a28" strokeWidth="2" />
      <circle cx="93" cy="26" r="1.8" fill="#222" />
    </>)
    default: return wrap(<circle cx="50" cy="50" r="30" fill="#f2b632" />)
  }
}

/* ───────── خلفيات ───────── */
export function Clouds({ count = 4, tint = '#fff' }: { count?: number; tint?: string }) {
  const items = useMemo(() => Array.from({ length: count }, (_, i) => ({
    top: 4 + ((i * 17) % 34), dur: 55 + i * 14, delay: -i * 17, scale: 0.7 + (i % 3) * 0.35,
  })), [count])
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {items.map((c, i) => (
        <svg key={i} className="cloud absolute" viewBox="0 0 120 50" width={120 * c.scale}
          style={{ top: `${c.top}%`, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s`, opacity: 0.9 }}>
          <path d="M20 44 Q4 44 6 30 Q8 20 22 22 Q26 6 46 8 Q60 0 72 14 Q94 8 98 28 Q116 28 114 40 Q112 46 100 44Z" fill={tint} />
        </svg>
      ))}
    </div>
  )
}

export function Sea({ height = 22, color = '#1fa3c6', dark = '#0b6f8f' }: { height?: number; color?: string; dark?: string }) {
  const wavePath = 'M0 20 Q25 0 50 20 T100 20 T150 20 T200 20 T250 20 T300 20 T350 20 T400 20 V60 H0Z'
  return (
    <div className="absolute inset-x-0 bottom-0 overflow-hidden pointer-events-none" style={{ height: `${height}%` }} aria-hidden>
      <div className="absolute inset-0" style={{ background: `linear-gradient(${color},${dark})` }} />
      <svg className="waves-move absolute top-0 left-0" viewBox="0 0 400 60" style={{ width: '200%', height: '45%', animationDuration: '9s' }} preserveAspectRatio="none">
        <path d={wavePath} fill={color} opacity=".95" />
      </svg>
      <svg className="waves-move absolute top-[18%] left-0" viewBox="0 0 400 60" style={{ width: '200%', height: '40%', animationDuration: '14s', animationDirection: 'reverse' }} preserveAspectRatio="none">
        <path d={wavePath} fill="#fff" opacity=".18" />
      </svg>
    </div>
  )
}

export function Skyline({ color = '#e8d5a8', accent = '#f2b632', w = 700 }: { color?: string; accent?: string; w?: number }) {
  return (
    <svg viewBox="0 0 700 220" width={w} style={{ maxWidth: '100%' }} aria-hidden preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="tw" x1="0" x2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor={color} /></linearGradient>
        <linearGradient id="gl" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#bfe9f7" /><stop offset="1" stopColor="#4aa8cc" /></linearGradient>
      </defs>
      {/* متحف الفن الإسلامي */}
      <g transform="translate(40,120)"><rect x="0" y="50" width="110" height="50" fill="url(#tw)" /><rect x="22" y="22" width="66" height="30" fill="url(#tw)" /><path d="M32 22 Q55 -6 78 22Z" fill={accent} /><rect x="48" y="62" width="14" height="38" fill="#7a6a4a" /></g>
      {/* برج مستدير */}
      <g transform="translate(190,22)"><rect x="0" y="30" width="46" height="168" rx="4" fill="url(#gl)" stroke="#2f7fa3" strokeWidth="2" /><ellipse cx="23" cy="30" rx="23" ry="10" fill="#8fd3ee" />{Array.from({ length: 14 }, (_, i) => <line key={i} x1="0" x2="46" y1={44 + i * 11} y2={44 + i * 11} stroke="#2f7fa3" strokeWidth="1" opacity=".45" />)}</g>
      {/* برج مثلثي */}
      <g transform="translate(262,0)"><path d="M0 218 L26 20 L52 218Z" fill="url(#gl)" stroke="#2f7fa3" strokeWidth="2" /><path d="M26 20 L26 218" stroke="#2f7fa3" strokeWidth="1.5" opacity=".6" /><circle cx="26" cy="14" r="5" fill={accent} /></g>
      {/* برجان توأم */}
      <g transform="translate(336,56)"><path d="M0 160 V30 Q0 4 14 0 Q28 4 28 30 V160Z" fill="url(#gl)" stroke="#2f7fa3" strokeWidth="2" /><path d="M34 160 V50 Q34 28 48 24 Q62 28 62 50 V160Z" fill="url(#gl)" stroke="#2f7fa3" strokeWidth="2" /></g>
      {/* برج مدوّر مع قبعة ذهبية */}
      <g transform="translate(418,36)"><rect x="0" y="22" width="40" height="150" fill="url(#gl)" stroke="#2f7fa3" strokeWidth="2" /><path d="M-6 22 H46 L36 4 H4Z" fill={accent} /></g>
      {/* مسجد/قبّة */}
      <g transform="translate(486,110)"><rect x="0" y="40" width="100" height="60" fill="url(#tw)" /><path d="M10 40 Q50 -14 90 40Z" fill={accent} /><rect x="104" y="-4" width="10" height="104" fill="url(#tw)" /><path d="M102 -4 L109 -22 L116 -4Z" fill={accent} /></g>
      <g transform="translate(606,140)"><rect x="0" y="0" width="64" height="80" fill="url(#tw)" /><rect x="8" y="12" width="12" height="16" fill="#7ec8e3" /><rect x="26" y="12" width="12" height="16" fill="#7ec8e3" /><rect x="44" y="12" width="12" height="16" fill="#7ec8e3" /></g>
    </svg>
  )
}

export type BackdropKind = 'day' | 'map' | 'village' | 'castle' | 'museum' | 'future' | 'night'
export function Backdrop({ kind }: { kind: BackdropKind }) {
  const sky: Record<BackdropKind, string> = {
    day: 'linear-gradient(#5ec4f0 0%, #bfeaff 60%, #fff3d6 100%)',
    map: 'linear-gradient(#2a8fc0, #6fd0ec 70%, #bfeaff)',
    village: 'linear-gradient(#ff9a5a 0%, #ffd08a 55%, #ffeec2 100%)',
    castle: 'linear-gradient(#5aa6e8 0%, #cfe9ff 70%, #fff3d6)',
    museum: 'linear-gradient(#f6e6c3, #e6c98c)',
    future: 'linear-gradient(#2b6cb0 0%, #6cc3ee 50%, #e6f6ff 100%)',
    night: 'linear-gradient(#0f2a4a, #1d4f7a)',
  }
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: sky[kind] }} aria-hidden>
      {(kind === 'day' || kind === 'future' || kind === 'castle' || kind === 'map') && <Clouds count={kind === 'map' ? 3 : 5} />}
      {kind === 'village' && <Clouds count={3} tint="#fff1d6" />}
      {kind !== 'museum' && kind !== 'night' && (
        <div className="absolute rounded-full" style={{ top: '7%', insetInlineStart: '8%', width: 90, height: 90, background: 'radial-gradient(circle at 35% 35%, #fff7c2, #ffd23f 60%, #ffb300)', boxShadow: '0 0 60px 20px rgba(255,210,63,.5)' }} />
      )}
      {kind === 'night' && Array.from({ length: 24 }, (_, i) => (
        <span key={i} className="absolute rounded-full bg-white" style={{ width: 3, height: 3, top: `${(i * 37) % 60}%`, left: `${(i * 53) % 100}%`, opacity: 0.8 }} />
      ))}
      {(kind === 'day' || kind === 'future') && (
        <div className="absolute inset-x-0 bottom-[16%] flex justify-center opacity-95"><Skyline w={860} /></div>
      )}
      {kind === 'castle' && (
        <svg className="absolute bottom-[12%] inset-x-0 mx-auto" viewBox="0 0 600 260" width="90%" style={{ maxWidth: 760 }} aria-hidden>
          <defs><linearGradient id="cs" x1="0" x2="1"><stop offset="0" stopColor="#f6e2b4" /><stop offset="1" stopColor="#d8b97a" /></linearGradient></defs>
          <rect x="60" y="120" width="480" height="140" fill="url(#cs)" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => <rect key={i} x={60 + i * 44} y="104" width="26" height="20" fill="url(#cs)" />)}
          <g><rect x="20" y="60" width="90" height="200" fill="url(#cs)" /><path d="M14 60 H116 L104 40 H26Z" fill="#d8b97a" />{[0, 1, 2, 3].map(i => <rect key={i} x={24 + i * 22} y="30" width="14" height="14" fill="#d8b97a" />)}</g>
          <g><rect x="490" y="60" width="90" height="200" fill="url(#cs)" /><path d="M484 60 H586 L574 40 H496Z" fill="#d8b97a" />{[0, 1, 2, 3].map(i => <rect key={i} x={494 + i * 22} y="30" width="14" height="14" fill="#d8b97a" />)}</g>
          <g><rect x="250" y="40" width="100" height="220" fill="url(#cs)" /><path d="M244 40 H356 L344 18 H256Z" fill="#d8b97a" />{[0, 1, 2, 3, 4].map(i => <rect key={i} x={254 + i * 20} y="6" width="12" height="14" fill="#d8b97a" />)}</g>
          <path d="M270 260 V190 Q300 150 330 190 V260Z" fill="#6b3a1c" />
          {[70, 150, 440, 510].map(x => <path key={x} d={`M${x} 190 V160 Q${x + 12} 142 ${x + 24} 160 V190Z`} fill="#7a5a2a" />)}
        </svg>
      )}
      {kind === 'museum' && (<>
        <div className="absolute inset-x-0 bottom-0" style={{ height: '28%', background: 'linear-gradient(#b8845a, #8a5a3a)' }} />
        <div className="absolute inset-x-0 top-0 h-[14%]" style={{ background: 'repeating-linear-gradient(90deg,#8A1538 0 40px,#b83358 40px 80px)', opacity: 0.9 }} />
      </>)}
      {kind === 'village' && (
        <svg className="absolute bottom-[34%] inset-x-0 w-full" style={{ height: '40%' }} viewBox="0 0 800 160" preserveAspectRatio="none" aria-hidden>
          <path d="M0 110 Q150 40 300 100 T600 90 T800 100 V160 H0Z" fill="#e8c27a" /><path d="M0 130 Q200 90 420 130 T800 120 V160 H0Z" fill="#d8a85a" />
        </svg>
      )}
      {(kind === 'day' || kind === 'map' || kind === 'future' || kind === 'castle' || kind === 'village') && (
        <Sea height={kind === 'village' ? 38 : kind === 'castle' ? 8 : 16} />
      )}
      {kind === 'day' && (
        <div className="bob absolute" style={{ bottom: '10%', insetInlineEnd: '8%', width: 150 }}><Icon id="ship" size={150} /></div>
      )}
    </div>
  )
}

/* ───────── خريطة قطر ───────── */
export function QatarMap({ width, children }: { width?: number; children?: React.ReactNode }) {
  return (
    <svg viewBox="0 0 300 440" width={width} aria-label="خريطة قطر" role="img" style={width ? { overflow: 'visible' } : { height: '100%', width: 'auto', overflow: 'visible' }}>
      <defs>
        <linearGradient id="mp" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#f6dba0" /><stop offset="1" stopColor="#c99a4a" /></linearGradient>
        <filter id="msh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="9" stdDeviation="3" floodColor="#000" floodOpacity=".4" /></filter>
      </defs>
      <path d="M92 410 L82 330 L96 282 L112 226 L106 160 L120 96 L140 52 L162 46 L176 92 L188 150 L214 206 L226 266 L216 330 L206 410Z" fill="#a4772f" transform="translate(0,10)" />
      <path id="qpath" d="M92 410 L82 330 L96 282 L112 226 L106 160 L120 96 L140 52 L162 46 L176 92 L188 150 L214 206 L226 266 L216 330 L206 410Z" fill="url(#mp)" stroke="#8A1538" strokeWidth="4" strokeLinejoin="round" filter="url(#msh)" />
      {children}
    </svg>
  )
}

/* ───────── احتفال ───────── */
export function Burst({ n = 22, big = false }: { n?: number; big?: boolean }) {
  const parts = useMemo(() => Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + Math.random() * 0.4
    const r = (big ? 200 : 130) + Math.random() * (big ? 160 : 90)
    return { x: Math.cos(a) * r, y: Math.sin(a) * r - 40, ch: ['⭐', '✨', '🎉', '🟡', '💛', '🟣'][i % 6], s: 16 + Math.random() * 18, d: Math.random() * 0.15 }
  }), [n, big])
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-50" aria-hidden>
      {parts.map((p, i) => (
        <motion.span key={i} className="absolute" style={{ fontSize: p.s }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.3, rotate: 0 }}
          animate={{ x: p.x, y: p.y + 80, opacity: 0, scale: 1.2, rotate: 260 }}
          transition={{ duration: 1.3, delay: p.d, ease: 'easeOut' }}>{p.ch}</motion.span>
      ))}
    </div>
  )
}
