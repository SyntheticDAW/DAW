import { pluginArray } from "../classes/plugins/SPlugin";
import { tracksArray } from "../classes/track";
import { AudioEngineWasm, PluginInterface } from "./CoreJWI";

(globalThis as any).fetch128 = (pluginId: number, bufferPtr: number, startTime: number) => {
  const pluginObj = pluginArray[pluginId - 1];
  if (!pluginObj) return;
  if (!pluginObj.loaded) return;
  const pluginExports = pluginObj.pluginInstance?.instance.exports as unknown as PluginInterface

  const buffer = new Float32Array(AudioEngineWasm.memory.buffer, bufferPtr, 128);
  pluginExports.process128(buffer, startTime);
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

