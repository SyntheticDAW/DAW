export interface PluginInterface {
  process128: (f32a: Float32Array, startTime: number) => void,
  pushSourceData: (data: ArrayBuffer) => void
}
export let plugins: PluginInterface[] = []
export * as fdgs from '../../wasm/build/release'