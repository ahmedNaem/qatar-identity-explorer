// أصوات مُولَّدة بالكامل بـ WebAudio (بدون ملفات خارجية ولا حقوق)
let ctx: AudioContext | null = null
let master: GainNode | null = null
let musicGain: GainNode | null = null
let sfxOn = true
let musicOn = false
let timer: number | null = null
let step = 0
let nextTime = 0

function ac(): AudioContext | null {
  try {
    if (!ctx) {
      const C = window.AudioContext || (window as any).webkitAudioContext
      if (!C) return null
      ctx = new C()
      master = ctx.createGain(); master.gain.value = 0.8; master.connect(ctx.destination)
      musicGain = ctx.createGain(); musicGain.gain.value = 0.16; musicGain.connect(master)
    }
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  } catch { return null }
}

function tone(freq: number, t0: number, dur: number, type: OscillatorType, vol: number, dest: AudioNode, slide = 0) {
  const c = ctx!
  const o = c.createOscillator(); const g = c.createGain()
  o.type = type; o.frequency.setValueAtTime(freq, t0)
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  o.connect(g); g.connect(dest); o.start(t0); o.stop(t0 + dur + 0.05)
}

export const sfx = {
  click() { if (!sfxOn || !ac()) return; tone(660, ctx!.currentTime, 0.08, 'triangle', 0.25, master!) },
  correct() {
    if (!sfxOn || !ac()) return; const t = ctx!.currentTime
    ;[523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.08, 0.22, 'triangle', 0.3, master!))
  },
  wrong() {
    if (!sfxOn || !ac()) return; const t = ctx!.currentTime
    tone(220, t, 0.25, 'sine', 0.35, master!, -80)
  },
  star() { if (!sfxOn || !ac()) return; const t = ctx!.currentTime; tone(988, t, 0.15, 'sine', 0.3, master!); tone(1318, t + 0.1, 0.25, 'sine', 0.3, master!) },
  win() {
    if (!sfxOn || !ac()) return; const t = ctx!.currentTime
    ;[392, 523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.13, 0.3, 'triangle', 0.3, master!))
  },
  whoosh() { if (!sfxOn || !ac()) return; tone(300, ctx!.currentTime, 0.25, 'sine', 0.15, master!, 500) },
}

// موسيقى هادئة على مقام الحجاز (D Eb F# G A Bb C) مع إيقاع خفيف
const SCALE = [293.66, 311.13, 369.99, 392, 440, 466.16, 523.25, 587.33]
const MELODY = [0, 2, 3, 4, 3, 2, 1, 0, 2, 4, 5, 4, 3, 2, 1, 0]
function schedule() {
  if (!ctx || !musicOn) return
  const beat = 0.5
  while (nextTime < ctx.currentTime + 0.6) {
    const i = step % MELODY.length
    const f = SCALE[MELODY[i]]
    tone(f, nextTime, 0.4, 'triangle', 0.5, musicGain!)
    if (i % 4 === 0) tone(f / 2, nextTime, 0.9, 'sine', 0.5, musicGain!)
    // دفّ بسيط
    if (i % 2 === 0) tone(i % 4 === 0 ? 110 : 180, nextTime, 0.09, 'sine', 0.6, musicGain!, -50)
    nextTime += beat; step++
  }
}
export function setMusic(on: boolean) {
  musicOn = on
  if (timer) { clearInterval(timer); timer = null }
  if (on && ac()) {
    nextTime = ctx!.currentTime + 0.1; step = 0
    timer = window.setInterval(schedule, 200); schedule()
  }
}
export function setSfx(on: boolean) { sfxOn = on }
