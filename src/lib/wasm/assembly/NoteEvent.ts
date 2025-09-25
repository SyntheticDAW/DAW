export class MidiEvent {
  note: u8;            // 0–127
  velocity: u8;        // 0–127
  startSample: u32;    // sample index
  durationSamples: u32;// length in samples
  channel: u8;         // 0–15
  identifer: u32;

  constructor(
    note: u8,
    velocity: u8,
    startSample: u32,
    channel: u8,
    identifer: u32,
    durationSamples: u32
  ) {
    this.note = note;
    this.velocity = velocity;
    this.startSample = startSample;
    this.channel = channel;
    this.identifer = identifer;
    this.durationSamples = durationSamples;
  }
}

/**
 * Decode an ArrayBuffer into an array of MidiEvents (using integer samples)
 */
export function decodeMidiEvents(buf: ArrayBuffer): MidiEvent[] {
  const eventSize = 15; // can increase if needed for 32-bit samples
  const totalEvents = Math.floor(buf.byteLength / eventSize);
  const events: MidiEvent[] = [];
  const view = new DataView(buf);

  for (let i = 0; i < totalEvents; i++) {
    const offset = i * eventSize;
    const note = view.getUint8(offset + 0);
    const velocity = view.getUint8(offset + 1);

    const startSample = view.getUint32(offset + 2, true);
    const durationSamples = view.getUint32(offset + 6, true);

    const channel = view.getUint8(offset + 10);
    const identifer = view.getUint32(offset + 11, true);

    events.push(new MidiEvent(note, velocity, startSample, channel, identifer, durationSamples));
  }

  return events;
}
