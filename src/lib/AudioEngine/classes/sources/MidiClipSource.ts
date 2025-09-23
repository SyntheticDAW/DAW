import { Midi, Track } from "@tonejs/midi";


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
        this.midi = new Midi()
        this.midiTrack = this.midi.addTrack();
        this.notesJSON = []
    }

    toMIDI() {
        return this.midi.toArray()
    }
}
