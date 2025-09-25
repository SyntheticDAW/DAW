import { Midi, Track } from "@tonejs/midi";
import { Frequency } from "tone";

// matches ASC NoteEventData
export interface NoteEventData {
  midi: number;      // 0-127
  time: number;      // seconds
  duration: number;  // seconds
  velocity: number;  // 0-1
  channel: number;   // 0-15
  identifier: number;
}

const NOTE_BYTE_SIZE = 16;

export class MidiClipSource {
  midi: Midi;
  midiTrack: Track;
  notesJSON: NoteEventData[];
  nextId: number;

  constructor() {
    this.midi = new Midi();
    this.midiTrack = this.midi.addTrack();
    this.notesJSON = [];
    this.nextId = 0;
  }

  addNote(note: Omit<NoteEventData, "identifier">) {
    const fullNote: NoteEventData = { ...note, identifier: this.nextId++ };
    this.notesJSON.push(fullNote);
    this.midiTrack.addNote({
      midi: fullNote.midi,
      time: fullNote.time,
      duration: fullNote.duration,
      velocity: fullNote.velocity,
      channel: fullNote.channel,
    });
  }

  addNotes(notes: Omit<NoteEventData, "identifier">[]) {
    notes.forEach(n => this.addNote(n));
  }

  addNoteByPitch(
    pitch: string,
    time: number,
    duration: number,
    velocity: number = 0.8,
    channel: number = 0
  ) {
    const midi = Frequency(pitch).toMidi();
    this.addNote({ midi, time, duration, velocity, channel });
  }

  // === Encode all notes to ArrayBuffer in ASC-compatible binary ===
  toBinary(): ArrayBuffer {
    const buffer = new ArrayBuffer(this.notesJSON.length * NOTE_BYTE_SIZE);
    const view = new DataView(buffer);
    let offset = 0;

    for (const note of this.notesJSON) {
      view.setUint8(offset, note.midi); offset += 1;
      view.setUint8(offset, Math.floor(note.velocity * 127)); offset += 1;
      view.setUint8(offset, note.channel); offset += 1;
      offset += 1; // padding

      view.setFloat32(offset, note.time, true); offset += 4;
      view.setFloat32(offset, note.duration, true); offset += 4;
      view.setUint32(offset, note.identifier, true); offset += 4;
    }

    return buffer;
  }

  static encodeNote(note: NoteEventData): ArrayBuffer {
    const buffer = new ArrayBuffer(NOTE_BYTE_SIZE);
    const view = new DataView(buffer);
    let offset = 0;

    view.setUint8(offset, note.midi); offset += 1;
    view.setUint8(offset, Math.floor(note.velocity * 127)); offset += 1;
    view.setUint8(offset, note.channel); offset += 1;
    offset += 1; 

    view.setFloat32(offset, note.time, true); offset += 4;
    view.setFloat32(offset, note.duration, true); offset += 4;
    view.setUint32(offset, note.identifier, true); offset += 4;

    return buffer;
  }

  serialize(): string {
    return JSON.stringify(this.notesJSON);
  }

  deserialize(json: string) {
    const parsed: NoteEventData[] = JSON.parse(json);
    this.notesJSON = [];
    this.midi = new Midi();
    this.midiTrack = this.midi.addTrack();
    this.nextId = 0;

    parsed.forEach(n => this.addNote({ ...n, identifier: this.nextId++ }));
  }
}
