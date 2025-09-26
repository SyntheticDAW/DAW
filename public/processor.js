class SquareADSRProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.sampleRate = sampleRate;

    // Map of active notes: freq -> {phase, state, timer}
    this.activeNotes = new Map();

    // ADSR settings
    this.attackTime = 0.01;   // seconds
    this.decayTime = 0.657;   // seconds
    this.sustainLevel = 0.0;  // sustain amplitude
    this.releaseTime = 0.1;   // seconds

    this.port.onmessage = (event) => {
      const msg = event.data;
      switch (msg.type) {
        case 'noteOn':
          if (!this.activeNotes.has(msg.frequency)) {
            this.activeNotes.set(msg.frequency, {
              phase: 0,
              state: 'attack',
              timer: 0,
              amplitude: 0
            });
          }
          break;
        case 'noteOff':
          if (this.activeNotes.has(msg.frequency)) {
            const note = this.activeNotes.get(msg.frequency);
            note.state = 'release';
            note.timer = 0;
          }
          break;
      }
    };
  }

  process(inputs, outputs) {
    const output = outputs[0][0];
    const bufferSize = output.length;
    output.fill(0);

    for (const [freq, note] of this.activeNotes) {
      const phaseIncrement = freq / this.sampleRate; // normalized 0→1

      for (let i = 0; i < bufferSize; i++) {
        // Square wave: +1 if phase < 0.5 else -1
        const wave = note.phase < 0.5 ? 1 : -1;

        // Apply ADSR envelope
        let env = note.amplitude;
        switch (note.state) {
          case 'attack':
            note.amplitude += 1 / (this.attackTime * this.sampleRate);
            if (note.amplitude >= 1) {
              note.amplitude = 1;
              note.state = 'decay';
            }
            env = note.amplitude;
            break;
          case 'decay':
            note.amplitude -= (1 - this.sustainLevel) / (this.decayTime * this.sampleRate);
            if (note.amplitude <= this.sustainLevel) {
              note.amplitude = this.sustainLevel;
              note.state = 'sustain';
            }
            env = note.amplitude;
            break;
          case 'sustain':
            env = this.sustainLevel;
            break;
          case 'release':
            note.amplitude -= this.sustainLevel / (this.releaseTime * this.sampleRate);
            if (note.amplitude <= 0) {
              note.amplitude = 0;
              this.activeNotes.delete(freq); // remove finished note
              break;
            }
            env = note.amplitude;
            break;
        }

        output[i] += wave * env;

        note.phase += phaseIncrement;
        if (note.phase >= 1) note.phase -= 1;
      }
    }

    return true;
  }
}

registerProcessor('square-adsr-processor', SquareADSRProcessor);
