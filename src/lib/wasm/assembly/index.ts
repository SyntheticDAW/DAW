import { consoleLog, fetch128 } from "./env";
import { decodeMidiEvents, MidiEvent } from "./NoteEvent";

/** more like float32 quantization depth when processing */
export enum BitDepth {
  _8 = 8,
  _16 = 16,
  _24 = 24,
  _32 = 32
}

export enum MediaType {
  Audio,
  Midi,
}

class Track {
  uuid: string;
  active: boolean;
  pluginId: u32;
  bitDepth: BitDepth;
  mediaType: MediaType;
  constructor(uuid: string, active: boolean, pluginId: u32, bitDepth: BitDepth, mediaType: MediaType) {
    this.uuid = uuid;
    this.active = active;
    this.pluginId = pluginId;
    this.bitDepth = bitDepth;
    this.mediaType = mediaType;
  }
}

let tracks: Map<string, Track> = new Map();

export function linkTrack(uuid: string, pluginId: u32, bitDepth: BitDepth, mediaType: MediaType): string {
  tracks.set(uuid, new Track(
    uuid,
    true,
    pluginId,
    bitDepth,
    mediaType
  ))
  return uuid;
}

export function setTrackIsActive(uuid: string, active: boolean): void {
  let track = tracks.get(uuid);
  if (track) {
    track.active = active
  }
}

export function sendTrackMidi(uuid: string, midiEventsEncoded: ArrayBuffer): boolean {
  let track = tracks.get(uuid)
  if (track.mediaType == MediaType.Audio) {
    return false
  }

  // const midiEventsDecoded: MidiEvent[] = decodeMidiEvents(midiEventsEncoded);
  // consoleLog(midiEventsDecoded[0].note.toString())
  sendSourceDataTo(uuid, midiEventsEncoded)
  return true;
}

// export function getTrack(uuid: string): Track {
//   return tracks.get(uuid)
// }
//aa/a