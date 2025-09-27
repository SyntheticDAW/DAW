class SABWaveProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.blockSize = options.processorOptions.blockSize;
    this.queueLength = options.processorOptions.queueLength;
    this.sampleBuffer = null;
    this.readIndex = 0;

    this.port.onmessage = (event) => {
      const data = event.data;
      if (data.type === 'waveBuffer' && data.buffer instanceof SharedArrayBuffer) {
        this.sampleBuffer = new Float32Array(data.buffer);
      }
    };
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    if (!output || !output[0]) return true;
    const channel = output[0];

    if (this.sampleBuffer) {
      const blockOffset = this.readIndex * this.blockSize;

      for (let i = 0; i < this.blockSize; i++) {
        channel[i] = this.sampleBuffer[blockOffset + i];
      }

      // Notify main thread to refill this block
      this.port.postMessage({ type: 'requestBuffer', blockIndex: this.readIndex });

      // Move to next block
      this.readIndex = (this.readIndex + 1) % this.queueLength;
    } else {
      for (let i = 0; i < channel.length; i++) channel[i] = 0;
    }

    return true;
  }
}

registerProcessor('SABWaveProcessor', SABWaveProcessor);
