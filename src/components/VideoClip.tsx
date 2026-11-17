import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { VIDEO_CLIPS } from '../data/content'

const KEY = 'qatar-explorer-videos-seen'
const seenSet = (): string[] => { try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] } }
const markSeen = (k: string) => { try { localStorage.setItem(KEY, JSON.stringify([...new Set([...seenSet(), k])])) } catch { /* ignore */ } }
export const resetVideosSeen = () => { try { localStorage.removeItem(KEY) } catch { /* ignore */ } }

/* هل يوجد مقطع مفعّل لم يُشاهَد بعد؟ */
export const hasClip = (k: string) => !!VIDEO_CLIPS[k]?.enabled && !seenSet().includes(k)

/* مقطع ملء الشاشة: صامت، قابل للتخطّي، يُتخطّى تلقائياً عند أي خطأ */
export function VideoClip({ clip, onDone }: { clip: string; onDone: () => void }) {
  const c = VIDEO_CLIPS[clip]
  const ref = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  const finish = () => { markSeen(clip); onDone() }
  useEffect(() => { const t = setTimeout(() => { if (!ready) finish() }, 8000); return () => clearTimeout(t) }, [ready]) // eslint-disable-line
  if (!c) return null
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} exit={{ opacity: 0 }}>
      <video
        ref={ref} src={c.file} poster={c.poster} autoPlay muted playsInline preload="auto"
        className="max-h-full max-w-full" onCanPlay={() => setReady(true)} onEnded={finish} onError={finish}
      />
      <button className="btn3d white absolute bottom-5 left-5 px-5 py-2 text-lg" onClick={finish}>تخطّي ⏭</button>
    </motion.div>
  )
}
