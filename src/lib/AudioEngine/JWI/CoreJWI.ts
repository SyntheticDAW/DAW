import { decode, encode } from '@msgpack/msgpack';
import { MediaType } from '../classes/plugins/SPlugin';
export * as AudioEngineWasm from '../../wasm/build/release'
import './exposals'
export interface PluginInterface {
  process128: (ptr: number, startTime: number) => void;
  pushSequencedMidi: (data: ArrayBuffer) => void;
  alloc128: () => number;
  free128: (ptr: number) => void;
  initialize: (sampleRate: number, bpm: number) => void;
  memory: WebAssembly.Memory
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

  const memory = new WebAssembly.Memory({ initial: 64, maximum: 128 });

  const {instance}: any = await WebAssembly.instantiate(syntheticPluginObject.module, {
    env: {
      memory,

      fetchAsset: (index: number, ptr: number) => {
        const asset = assets[index];
        if (!asset) return 0; 

        const bytes = asset.data; 
        new Uint8Array(memory.buffer, ptr, bytes.length).set(bytes);

        return bytes.length; 
      },

      abort: (s: string, a: any) => {
        console.error(s)
      }
    }
  });

  

  return { instance, memory, assets, pluginObject: syntheticPluginObject };
}

async function createPluginFromUrl(url: string): Promise<Uint8Array> {
  // Fetch the WASM file
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch WASM from ${url}`);
  const wasmBinary = new Uint8Array(await response.arrayBuffer());

  // Build the SyntheticPlugin object
  const pluginObject: SyntheticPlugin = {
    name: "Fetched Sine Plugin",
    module: wasmBinary,
    assets: [
      { name: "dummyAsset", data: new Uint8Array([1, 2, 3, 4]) }
    ],
    author: "wintr",
    version: "1.0.0",
    mediaType: 0
  };

  // Msgpack encode
  return encode(pluginObject);
}

// Usage
export const msgPackedPlugin = await createPluginFromUrl("/example.wasm");
(window as any).sinePlugin = msgPackedPlugin;