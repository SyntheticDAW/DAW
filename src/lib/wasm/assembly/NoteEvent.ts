export class NoteEvent {
  midi: i32;       // MIDI note number
  time: f32;       // start time in seconds
  duration: f32;   // duration in seconds
  velocity: f32;   // 0-1
  channel: i32;
  played: bool = false; // track whether note has been triggered

  constructor(midi: i32, time: f32, duration: f32, velocity: f32, channel: i32) {
    this.midi = midi;
    this.time = time;
    this.duration = duration;
    this.velocity = velocity;
    this.channel = channel;
  }
}
