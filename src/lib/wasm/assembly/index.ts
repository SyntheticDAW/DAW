// ---------------- NoteEvent ----------------
export class NoteEvent {
  midi: i32;       // MIDI note number
  time: f32;       // start time in seconds
  duration: f32;   // duration in seconds
  velocity: f32;   // 0-1
  channel: i32;
  played: bool = false;

  constructor(midi: i32, time: f32, duration: f32, velocity: f32, channel: i32) {
    this.midi = midi;
    this.time = time;
    this.duration = duration;
    this.velocity = velocity;
    this.channel = channel;
  }
}

// ---------------- BitDepth Enum ----------------
export enum BitDepth {
  _8 = 8,
  _16 = 16,
  _24 = 24,
  _32 = 32
}

// ---------------- TrackData ----------------
export class TrackData {
  uuid: string;
  bitDepth: BitDepth;
  bpm: f32;
  notes: NoteEvent[] = new Array<NoteEvent>();
  solo: bool = false;
  mute: bool = false;

  constructor(uuid: string, bitDepth: BitDepth, bpm: f32 = 120.0) {
    this.uuid = uuid;
    this.bitDepth = bitDepth;
    this.bpm = bpm;
  }

  addNote(note: NoteEvent): void {
    this.notes.push(note);
  }
}

// ---------------- Engine ----------------
export class Engine {
  private tracks: TrackData[] = new Array<TrackData>();
  public bpm: f32;
  public currentTime: f32 = 0.0;
  public isPlaying: bool = false;
  public sampleRate: f32;

  constructor(bpm: f32 = 120.0, sampleRate: f32 = 44100.0) {
    this.bpm = bpm;
    this.sampleRate = sampleRate;
  }

  // ---------------- Track Management ----------------
  addTrack(uuid: string, bitDepth: BitDepth): void {
    this.tracks.push(new TrackData(uuid, bitDepth, this.bpm));
  }

  getTrack(uuid: string): TrackData | null {
    for (let i = 0; i < this.tracks.length; i++) {
      if (this.tracks[i].uuid == uuid) return this.tracks[i];
    }
    return null;
  }

  getTrackUUIDs(): string[] {
    const uuids = new Array<string>();
    for (let i = 0; i < this.tracks.length; i++) {
      uuids.push(this.tracks[i].uuid);
    }
    return uuids;
  }

  // ---------------- Playback ----------------
  start(): void { this.isPlaying = true; }
  stop(): void { this.isPlaying = false; }
  reset(): void {
    this.currentTime = 0.0;
    for (let i = 0; i < this.tracks.length; i++) {
      const track = this.tracks[i];
      for (let j = 0; j < track.notes.length; j++) {
        track.notes[j].played = false;
      }
    }
  }

  secondsPerBeat(): f32 { return 60.0 / this.bpm; }

  step(deltaTime: f32): void {
    if (!this.isPlaying) return;
    this.currentTime += deltaTime;

    for (let i = 0; i < this.tracks.length; i++) {
      const track = this.tracks[i];
      if (track.mute) continue;

      for (let j = 0; j < track.notes.length; j++) {
        const note = track.notes[j];
        if (!note.played && note.time <= this.currentTime) {
          this.triggerNote(track.uuid, note);
          note.played = true;
        }
      }
    }
  }

  stepBlock128(): void { this.step(128.0 / this.sampleRate); }

  // ---------------- Note Triggering ----------------
  triggerNote(trackUUID: string, note: NoteEvent): void {
    trace(`[${trackUUID}] Play note ${note.midi} at ${note.time.toString()}s`);
  }
}

// ---------------- Factory Export Helpers ----------------
export function createEngine(bpm: f32 = 120.0, sampleRate: f32 = 44100.0): Engine {
  return new Engine(bpm, sampleRate);
}

export function addTrack(engine: Engine, uuidPtr: usize, uuidLen: i32, bitDepth: BitDepth): void {
  const uuid = String.UTF8.decodeUnsafe(uuidPtr, uuidLen, true);
  engine.addTrack(uuid, bitDepth);
}

export function addNoteToTrack(
  engine: Engine,
  uuidPtr: usize,
  uuidLen: i32,
  midi: i32,
  time: f32,
  duration: f32,
  velocity: f32,
  channel: i32
): void {
  const uuid = String.UTF8.decodeUnsafe(uuidPtr, uuidLen, true);
  const track = engine.getTrack(uuid);
  if (track != null) {
    track.addNote(new NoteEvent(midi, time, duration, velocity, channel));
  }
}
