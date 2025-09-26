import { decode } from '@msgpack/msgpack';
import { MediaType } from '../classes/plugins/SPlugin';

export interface PluginInterface {
  process128: (f32a: Float32Array, startTime: number) => void,
  pushSourceData: (data: ArrayBuffer) => void
}

export interface SyntheticAsset {
    name: string;
    data: Uint8Array
}

export interface SyntheticPlugin {
    name: string;
    module: Uint8Array;
    assets: SyntheticAsset[];
    author: string;
    version: string;
    mediaType: MediaType;
    /** will be added later to prove authneticity and that the plugin has not been tampered with. */
    // authorID?: string;
    // signature?: Uint8Array
}



export interface LoadPluginResponse {
  instance: WebAssembly.Instance;
  memory: WebAssembly.Memory;
  assets: SyntheticAsset[]
  pluginObject: SyntheticPlugin
}
export async function loadPlugin(msgPackedSXP: Uint8Array): Promise<LoadPluginResponse> {
  const syntheticPluginObject: SyntheticPlugin = decode(msgPackedSXP) as SyntheticPlugin;

  // Pre-build asset lookup table (optional, by index)
  const assets = syntheticPluginObject.assets;

  const memory = new WebAssembly.Memory({ initial: 2, maximum: 10 });

  const instance: WebAssembly.Instance = await WebAssembly.instantiate(syntheticPluginObject.module, {
    env: {
      memory,

      fetchAsset: (index: number, ptr: number) => {
        const asset = assets[index];
        if (!asset) return 0; 

        const bytes = asset.data; 
        new Uint8Array(memory.buffer, ptr, bytes.length).set(bytes);

        return bytes.length; 
      }
    }
  });

  return { instance, memory, assets, pluginObject: syntheticPluginObject };
}

export * as fdgs from '../../wasm/build/release'