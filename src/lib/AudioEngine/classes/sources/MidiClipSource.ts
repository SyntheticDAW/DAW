import { Midi, Track } from "@tonejs/midi";
import { Frequency } from "tone"; // Tone.js helper

export interface JsonNote {
  midi: number;
  time: number;
  duration: number;
  velocity: number;
  channel: number;
}

export class MidiClipSource {
  midi: Midi;
  midiTrack: Track;
  notesJSON: JsonNote[];

  constructor() {
    this.midi = new Midi();
    this.midiTrack = this.midi.addTrack();
    this.notesJSON = [];
  }

  addNote(note: JsonNote) {
    this.notesJSON.push(note);
    this.midiTrack.addNote(note);
  }

  addNotes(notes: JsonNote[]) {
    notes.forEach(n => this.addNote(n));
  }

  /**
   * Add a note using pitch name instead of MIDI number
   * Example: "C4", "B#5", "F#3"
   */
  addNoteByPitch(
    pitch: string,
    time: number,
    duration: number,
    velocity: number = 0.8,
    channel: number = 0
  ) {
    const midi = Frequency(pitch).toMidi(); // e.g. "C4" -> 60
    this.addNote({ midi, time, duration, velocity, channel });
  }

  toMIDI(): Uint8Array {
    return this.midi.toArray();
  }

  serialize(): string {
    return JSON.stringify(this.notesJSON);
  }

  deserialize(json: string) {
    const parsed: JsonNote[] = JSON.parse(json);
    this.notesJSON = [];
    this.midi = new Midi();
    this.midiTrack = this.midi.addTrack();

    parsed.forEach(n => this.addNote(n));
  }
}
