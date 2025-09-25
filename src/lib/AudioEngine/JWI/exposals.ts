import { fdgs, plugins } from "./CoreJWI";

(globalThis as any).fetch128 = (pluginId: number, bufferPtr: number, startTime: number) => {
  const plugin = plugins[pluginId];
  if (!plugin) return;

  const buffer = new Float32Array(fdgs.memory.buffer, bufferPtr, 128);
  plugin.process128(buffer, startTime);
};
