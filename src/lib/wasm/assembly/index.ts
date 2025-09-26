import { consoleLog, fetch128, sendSeqMidi } from "./env";
import { decodeMidiEvents, MidiEvent } from "./NoteEvent";

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
  active: boolean;
  pluginId: u32;
  bitDepth: BitDepth;
  mediaType: MediaType;

  constructor(active: boolean, pluginId: u32, bitDepth: BitDepth, mediaType: MediaType) {
    this.active = active;
    this.pluginId = pluginId;
    this.bitDepth = bitDepth;
    this.mediaType = mediaType;
  }
}

let tracks: Track[] = [];

export function linkTrack(pluginId: u32, bitDepth: BitDepth, mediaType: MediaType): void {
  const track = new Track(true, pluginId, bitDepth, mediaType);
  tracks.push(track);
}

export function setTrackIsActive(trackId: u32, active: boolean): void {
  if (trackId < tracks.length) {
    tracks[trackId].active = active;
  }
}

export function sendTrackMidi(trackId: u32, midiEventsEncoded: ArrayBuffer): boolean {
  if (trackId >= tracks.length) return false;

  const track = tracks[trackId];
  if (track.mediaType === MediaType.Audio) return false;

  const ptr = changetype<usize>(midiEventsEncoded);
  sendSeqMidi(trackId, ptr, midiEventsEncoded.byteLength);

  return true;
}