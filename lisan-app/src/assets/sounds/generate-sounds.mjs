/**
 * Generates the three quiz-feedback cues in src/assets/sounds/ as 16-bit mono
 * WAV files. Dependency-free: the RIFF header is written by hand.
 *
 *   node src/assets/sounds/generate-sounds.mjs
 *
 * 8 kHz keeps every file comfortably under the 8 KB budget while staying well
 * above the Nyquist limit for the ~200-900 Hz tones used here.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RATE = 8000;
const OUT = dirname(fileURLToPath(import.meta.url));

/** Wrap raw float samples (-1..1) in a 16-bit mono RIFF/WAVE container. */
function wav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    data.writeInt16LE(Math.round(clamped * 32767), i * 2);
  }
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // fmt chunk size
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28); // byte rate
  header.writeUInt16LE(2, 32); // block align
  header.writeUInt16LE(16, 34); // bits per sample
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

/**
 * Additive sine voice with a plucked exponential decay. `harmonic` adds a
 * quiet octave above the fundamental so the tone reads as a chime, not a beep.
 */
function voice(buf, { freq, start, dur, gain = 0.32, decay = 7, harmonic = 0.22, bend = 0 }) {
  const i0 = Math.round(start * RATE);
  const n = Math.round(dur * RATE);
  const attack = Math.round(0.006 * RATE);
  for (let i = 0; i < n && i0 + i < buf.length; i++) {
    const t = i / RATE;
    const f = freq * (1 + bend * (t / dur));
    const phase = 2 * Math.PI * f * t;
    const env =
      Math.exp(-decay * (t / dur)) * Math.min(1, i / attack) * Math.min(1, (n - i) / attack);
    buf[i0 + i] += gain * env * (Math.sin(phase) + harmonic * Math.sin(2 * phase));
  }
}

/** Soft-clip to tame additive peaks without audible distortion. */
const render = (buf) => buf.map((s) => Math.tanh(s * 1.25) * 0.82);

const N = (sec) => new Float64Array(Math.round(sec * RATE)).fill(0);

// correct: a bright, rising two-note chime (E5 -> A5)
{
  const buf = N(0.48);
  voice(buf, { freq: 659.25, start: 0, dur: 0.3, gain: 0.34, decay: 6 });
  voice(buf, { freq: 880.0, start: 0.11, dur: 0.37, gain: 0.36, decay: 5.5 });
  voice(buf, { freq: 1318.5, start: 0.11, dur: 0.2, gain: 0.08, decay: 9, harmonic: 0 });
  writeFileSync(join(OUT, 'correct.wav'), wav(render(buf)));
}

// incorrect: one low, muted tone easing downward (A3 -> ~G3)
{
  const buf = N(0.38);
  voice(buf, { freq: 220, start: 0, dur: 0.36, gain: 0.4, decay: 4.5, harmonic: 0.1, bend: -0.1 });
  voice(buf, { freq: 146.83, start: 0, dur: 0.36, gain: 0.18, decay: 4, harmonic: 0 });
  writeFileSync(join(OUT, 'incorrect.wav'), wav(render(buf)));
}

// complete: a quick A-major arpeggio flourish (A4 C#5 E5 A5)
{
  const buf = N(0.48);
  [440, 554.37, 659.25, 880].forEach((freq, i) => {
    voice(buf, { freq, start: i * 0.075, dur: 0.48 - i * 0.075, gain: 0.26, decay: 6.5 });
  });
  voice(buf, { freq: 1760, start: 0.225, dur: 0.25, gain: 0.05, decay: 10, harmonic: 0 });
  writeFileSync(join(OUT, 'complete.wav'), wav(render(buf)));
}

console.log('wrote correct.wav, incorrect.wav, complete.wav');
