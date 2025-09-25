import { Synth } from 'tone';
import * as fdgs from '../../wasm/build/release';
import { decode } from '@msgpack/msgpack';
let globalPluginId = 0;

export interface PluginExports {
    process128(buffer: Float32Array, startTime?: number): void 
}
export let plugins: PluginExports[] = [];
function incrementPluginId(): number {
    globalPluginId = ++globalPluginId >> 0
    return globalPluginId
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
    /** will be added later to prove authneticity and that the plugin has not been tampered with. */
    // authorID?: string;
    // signature?: Uint8Array
}

export async function loadPlugin(msgPackedSXP: Uint8Array) {
  const syntheticPluginObject: SyntheticPlugin = decode(msgPackedSXP) as SyntheticPlugin;

  // Pre-build asset lookup table (optional, by index)
  const assets = syntheticPluginObject.assets;

  // Create WASM memory if your module doesn't export one
  const memory = new WebAssembly.Memory({ initial: 2, maximum: 10 }); // adjust size as needed

  const instance = await WebAssembly.instantiate(syntheticPluginObject.module, {
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

  return { instance, memory, assets };
}

export class EngineWrapper {
  private engine: any;
  private memory: WebAssembly.Memory;
  private encoder: TextEncoder;

  constructor(bpm: number = 120, sampleRate: number = 44100) {
    this.engine = fdgs.createEngine(bpm, sampleRate);
    this.memory = fdgs.memory;
    this.encoder = new TextEncoder();
  }

  private _encodeString(str: string): { ptr: number; length: number } {
    const encoded = this.encoder.encode(str);
    const ptr = fdgs.__new(encoded.length, 1); // 1 = id for Uint8Array in AssemblyScript runtime
    const memU8 = new Uint8Array(this.memory.buffer, ptr, encoded.length);
    memU8.set(encoded);
    return { ptr, length: encoded.length };
  }

  addTrack(uuid: string, bitDepth: fdgs.BitDepth): void {
    const { ptr, length } = this._encodeString(uuid);
    fdgs.addTrack(this.engine, ptr, length, bitDepth);
    fdgs.__unpin(ptr);
  }

  addNoteToTrack(
    uuid: string,
    midi: number,
    time: number,
    duration: number,
    velocity: number,
    channel: number
  ): void {
    const { ptr, length } = this._encodeString(uuid);
    fdgs.addNoteToTrack(this.engine, ptr, length, midi, time, duration, velocity, channel);
    fdgs.__unpin(ptr);
  }

  start(): void {
    this.engine.start();
  }

  stop(): void {
    this.engine.stop();
  }

  reset(): void {
    this.engine.reset();
  }

  step(deltaTime: number): void {
    this.engine.step(deltaTime);
  }

  stepBlock128(): void {
    this.engine.stepBlock128();
  }
}

export { fdgs };
