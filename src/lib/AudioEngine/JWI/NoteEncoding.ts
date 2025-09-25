export class MidiEvent {
  note: number;      // 0–127
  velocity: number;  // 0–127
  startTime?: number;
  duration?: number;
  channel: number;   // 0–15
  identifer: number;

  constructor(
    note: number,
    velocity: number,
    startTime: number,
    channel: number,
    identifer: number,
    duration?: number
  ) {
    this.note = note;
    this.velocity = velocity;
    this.startTime = startTime;
    this.channel = channel;
    this.identifer = identifer;
    this.duration = duration;
  }

  static fromBinary(buf: ArrayBuffer): MidiEvent {
    const data = new DataView(buf);
    const note = data.getUint8(0);
    const velocity = data.getUint8(1);

    const startTimeRaw = data.getFloat32(2, true);
    const startTime = isNaN(startTimeRaw) ? undefined : startTimeRaw;

    const durationRaw = data.getFloat32(6, true);
    const duration = isNaN(durationRaw) ? undefined : durationRaw;

    const channel = data.getUint8(10);
    const identifer = data.getUint32(11, true);

    return new MidiEvent(note, velocity, startTime!, channel, identifer, duration);
  }

  toBinary(): ArrayBuffer {
    const buf = new ArrayBuffer(15);
    const data = new DataView(buf);

    data.setUint8(0, this.note);
    data.setUint8(1, this.velocity);

    data.setFloat32(2, this.startTime !== undefined ? this.startTime : NaN, true);
    data.setFloat32(6, this.duration !== undefined ? this.duration : NaN, true);

    data.setUint8(10, this.channel);
    data.setUint32(11, this.identifer, true);

    return buf;
  }
}

/**
 * Concatenate an array of MidiEvents into a single ArrayBuffer
 */
export function concatMidiEvents(events: MidiEvent[]): ArrayBuffer {
  const eventSize = 15;
  const buf = new ArrayBuffer(events.length * eventSize);
  const view = new DataView(buf);

  events.forEach((event, i) => {
    const offset = i * eventSize;
    view.setUint8(offset + 0, event.note);
    view.setUint8(offset + 1, event.velocity);
    view.setFloat32(offset + 2, event.startTime !== undefined ? event.startTime : NaN, true);
    view.setFloat32(offset + 6, event.duration !== undefined ? event.duration : NaN, true);
    view.setUint8(offset + 10, event.channel);
    view.setUint32(offset + 11, event.identifer, true);
  });

  return buf;
}

