// Allocate 128 floats
export function alloc128(): usize {
  return __alloc(128 * 4);
}

export function free128(ptr: usize): void {
  __free(ptr);
}

// Globals
export let song_sampleRate: f32 = 44100;

// Melody notes (Hz)
const melody: f32[] = [440.0, 493.88, 523.25, 587.33]; 
let noteIndex: i32 = 0;

export function initialize(sampleRate: f32, bpm: f32): void {
  song_sampleRate = sampleRate;
}

export function process128(ptr: usize, sampleStart: i32): void {
  const length: i32 = 128;
  const triggerInterval: i32 = i32(song_sampleRate * 2.0); // every 2 seconds
  const decayTime: f32 = 0.644;
  const envelopeDecay: f32 = 1.0 / (decayTime * song_sampleRate);

  for (let i: i32 = 0; i < length; i++) {
    const globalSample = sampleStart + i;

    // Check if we hit a new note trigger
    if (globalSample % triggerInterval === 0) {
      noteIndex = (noteIndex + 1) % melody.length;
    }

    const frequency = melody[noteIndex];

    // phase in wave period
    const phase = (globalSample % i32(song_sampleRate / frequency)) as f32 / (song_sampleRate / frequency);
    const wave: f32 = phase < 0.5 ? 1.0 : -1.0;

    // envelope
    const samplesSinceTrigger = globalSample % triggerInterval;
    const env = 1.0 - f32(samplesSinceTrigger) * envelopeDecay;
    const amplitude = env > 0.0 ? env : 0.0;

    store<f32>(ptr + (i << 2), wave as f32  * amplitude as f32);
  }
}
