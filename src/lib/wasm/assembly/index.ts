import { NoteEvent } from "./NoteEvent";

export type BitDepth = 8 | 16 | 24 | 32;

export interface TrackData {
  uuid: string;             // unique track identifier
  bitDepth: BitDepth;       // track bit depth
  bpm: f32;                 // global BPM from engine
  notes?: NoteEvent[];      // plain note array for WASM/plugin
  //automation?: any[];       // optional, replace with AutomationTrack[] if you want
}

export class Engine {
  private tracksByUUID: Map<string, TrackData>;
  public bpm: f32; // global BPM

  constructor(bpm: f32 = 120) {
    this.tracksByUUID = new Map<string, TrackData>();
    this.bpm = bpm;
  }

  // Register a track (only plain TrackData)
  addTrack(trackData: TrackData): void {
    // Ensure the track knows the global BPM
    trackData.bpm = this.bpm;
    this.tracksByUUID.set(trackData.uuid, trackData);
  }

  // Unregister a track
  removeTrack(uuid: string): void {
    this.tracksByUUID.delete(uuid);
  }

  getTrackData(uuid: string): TrackData | null {
    const trackData = this.tracksByUUID.get(uuid);
    return trackData ?? null;
  }


  getAllTrackUUIDs(): string[] {
    const uuids: string[] = [];
    for (let i = 0, keys = this.tracksByUUID.keys(); i < keys.length; i++) {
      uuids.push(keys[i]);
    }
    return uuids;
  }
}
