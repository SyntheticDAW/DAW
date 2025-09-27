import { view128Samples } from "../../util/encoding/128sampleread";
import { pluginArray } from "../classes/plugins/SPlugin";
import { tracksArray } from "../classes/track";
import { AudioEngineWasm, PluginInterface } from "./CoreJWI";

(globalThis as any).fetch128 = (
  pluginId: number,
  bufferPtr: number,
  startTime: number = 0
) => {
  const pluginObj = pluginArray[pluginId]; // IDs are 1-based
  if (!pluginObj?.loaded) return;

  const pluginExports = pluginObj.pluginInstance!.instance.exports as unknown as PluginInterface;
  if (!pluginExports) return;

  // Allocate buffer in plugin memory
  const pluginBufPtr = pluginExports.alloc128();

  // Run plugin processing
  pluginExports.process128(pluginBufPtr, startTime);

  // Grab 128 samples from plugin memory
  const pluginBuf = view128Samples(pluginExports.memory.buffer, pluginBufPtr);

  // Copy into main WASM memory
  const mainBuf = new Float32Array(AudioEngineWasm.memory.buffer, bufferPtr, 128);
  mainBuf.set(pluginBuf);

  // Free plugin buffer
  pluginExports.free128(pluginBufPtr);
};



(globalThis as any).sendSequencedMidiToTrack = (
  trackId: number,
  bufferPtr: number,
  length: number
) => {
  const track = tracksArray[trackId - 1];
  if (!track || !track.plugin || !track.plugin.loaded) return;

  const plugin = track.plugin;
  const pluginExports = plugin.pluginInstance?.instance.exports as unknown as PluginInterface;

  const midiBytes = new Uint8Array(AudioEngineWasm.memory.buffer, bufferPtr, length);

  const midiBuffer = midiBytes.slice().buffer;

  pluginExports.pushSequencedMidi(midiBuffer);
};

