
// Allocate 128 floats (128 * 4 bytes)
export function alloc128(): usize {
  return __alloc(128 * 4);
}

// Free a previously allocated pointer
export function free128(ptr: usize): void {
  __free(ptr);
}
// Globals for sample rate and bpm
export let song_sampleRate: f32 = 0;
export let song_bpm: f32 = 0;

// Initialize sample rate and bpm
export function initialize(sampleRate: f32, bpm: f32): void {
  song_sampleRate = sampleRate;
  song_bpm = bpm;
}

// Generate 128 samples of a sine wave at 440 Hz
// Generate 128 samples of a sine wave at 440 Hz
export function process128(ptr: usize, sampleStart: i32): void {
  const length: i32 = 128;
  const frequency: f32 = 440.0;
  const amplitude: f32 = 1.0; // you can change this to 5.0 if you want louder

  for (let i: i32 = 0; i < length; i++) {
    const t: f32 = ((sampleStart as f32) + (i as f32)) / song_sampleRate;         // time in seconds
    const value: f32 = amplitude * Mathf.sin(2.0 * Mathf.PI * frequency * t);
    store<f32>(ptr + (i << 2), value * 0.5);                           // store in memory
  }
}


