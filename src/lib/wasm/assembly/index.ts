import { consoleLog, fetch128, sendSeqMidi } from "./env";
import { decodeMidiEvents, MidiEvent } from "./NoteEvent";

// Enums
export enum BitDepth {
  _8  = 8,
  _16 = 16,
  _24 = 24,
  _32 = 32
}

export enum MediaType {
  Audio,
  Midi,
}

// Track class
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

// Global track array
let tracks = new Array<Track>();
//casf
// Link a new track
export function linkTrack(pluginId: u32, bitDepth: BitDepth, mediaType: MediaType): void {
  const track = new Track(true, pluginId, bitDepth, mediaType);
  tracks.push(track);
}

// Set active status of track
export function setTrackIsActive(trackId: u32, active: boolean): void {
  if (trackId < <u32>tracks.length) {
    tracks[trackId].active = active;
  }
}

export function sendTrackMidi(trackId: u32, midiEventsEncoded: ArrayBuffer): boolean {
  if (trackId >= <u32>tracks.length) return false;

  const track = tracks[trackId];
  if (track.mediaType === MediaType.Audio) return false;

  const midiView = Uint8Array.wrap(midiEventsEncoded);
  sendSeqMidi(trackId, midiView.dataStart, midiView.length);

  return true;
}


// Debug/test function
export function doArrayBuffer(a: ArrayBuffer): boolean {
  return true;
}




//allocate 128 bit sample buf
export function alloc128(): usize {
  return __alloc(128 * 4);
}

export function processBlock(ptr: usize, sampleStart: i32): void {
  // consoleLog("woreked")
  // console.log(tracks.length.toString())
  if (tracks.length === 0) return; // nothing to process

  // find first active track with audio type
  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    if (track.active) {
      // call external fetch128, passing pluginId and pointer
      fetch128(track.pluginId, ptr, sampleStart);
      return;
    }
  }
}
//absfc  ss test. im sorrycaa

// export function testFetch128(): void {
//   fetch128(0, 5, 0)
// }