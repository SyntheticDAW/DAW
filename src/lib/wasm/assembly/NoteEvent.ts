export class NoteEvent {
  midi: i32;       // MIDI note number
  time: f32;       // start time in beats
  duration: f32;   // duration in beats
  velocity: f32;   // 0-1
  channel: i32;

  constructor(midi: i32, time: f32, duration: f32, velocity: f32, channel: i32) {
    this.midi = midi;
    this.time = time;
    this.duration = duration;
    this.velocity = velocity;
    this.channel = channel;
  }
}