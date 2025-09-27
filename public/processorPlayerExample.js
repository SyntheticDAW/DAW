const pr = new a.SProject({ name: "gy" });

const p = new a.SPlugin(mpps);
const t = new a.Track({ name: "hii :3", project: pr });

await p.load();
t.setPlugin(p);

(async () => {
  const blockSize = 128;
  const queueLength = 4; // number of blocks to queue
  let startSample = 0;

  // Create circular buffer: queueLength blocks
  const sab = new SharedArrayBuffer(Float32Array.BYTES_PER_ELEMENT * blockSize * queueLength);
  const sampleBuffer = new Float32Array(sab);

  // Fill initial blocks
  for (let i = 0; i < queueLength; i++) {
    sampleBuffer.set(pr.get128Samples(startSample), i * blockSize);
    startSample += blockSize;
  }

  let readIndex = 0; // which block the worklet should read next

  // Create AudioContext
  const audioContext = new AudioContext({ sampleRate: 44100 });
  await audioContext.audioWorklet.addModule('processor.js');

  // Create worklet node
  const waveNode = new AudioWorkletNode(audioContext, 'SABWaveProcessor', {
    processorOptions: { blockSize, queueLength }
  });

  // Send SAB initially
  waveNode.port.postMessage({ type: 'waveBuffer', buffer: sab });

  // Handle requests from worklet
  waveNode.port.onmessage = (event) => {
    if (event.data.type === 'requestBuffer') {
      const blockToFill = event.data.blockIndex % queueLength; 
    //   console.log(`requestBuffer received! filling block ${blockToFill}, startSample: ${startSample}`);

      // Fill the requested block
      sampleBuffer.set(
        pr.get128Samples(startSample),
        blockToFill * blockSize
      );
      startSample += blockSize;
    }
  };

  // Connect to speakers
  waveNode.connect(audioContext.destination);

  // Start AudioContext on user gesture
//   document.addEventListener('click', async () => {
//     await audioContext.resume();
//     // console.log('AudioContext resumed!');
//   });

//   console.log('Click anywhere to start audio...');
})();
