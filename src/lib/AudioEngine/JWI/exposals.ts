import { fdgs, plugins } from "./CoreJWI";

(globalThis as any).fetch128 = (pluginId: number, bufferPtr: number, startTime: number) => {
  const plugin = plugins[pluginId];
  if (!plugin) return;

  const buffer = new Float32Array(fdgs.memory.buffer, bufferPtr, 128);
  plugin.process128(buffer, startTime);
};
(globalThis as any).sendSourceDataTo = (trackId: number, bufferPtr: number, length: number) => {
  const plugin = plugins[trackId];
  if (!plugin) return;

  // reinterpret raw bytes as Float32
  const f32 = new Float32Array(fdgs.memory.buffer, bufferPtr, length);
  
  // pass the buffer to the plugin
  plugin.pushSourceData(f32.buffer);
};
