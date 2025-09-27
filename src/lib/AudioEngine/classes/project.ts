import { view128Samples } from "../../util/encoding/128sampleread";
import { str2hex } from "../../util/encoding/stringToHex";
import { alloc128, memory, processBlock } from "../../wasm/build/release";
import { Track } from "./track";

interface SProjectOptionsInterface {
    sampleRate?: number;
    bpm?: number;
    name: string;
}

export class SProject {
    sampleRate: number;
    tracks: Track[];
    bpm: number;
    name: string;
    fileName: string;
    private _bufferPtr: number | null = null;

    constructor(options: SProjectOptionsInterface) {
        this.sampleRate = options.sampleRate ?? 44100;
        this.bpm = Math.max(Math.min(options.bpm ?? 150, 1000), 1);
        this.name = options.name ?? `Untitled Project ${new Date().toISOString()}`;
        this.fileName = str2hex(this.name) + '.sytp';
        this.tracks = [];
    }

    addTrack(track: Track) {
        this.tracks.push(track);
    }

    get128Samples(sampleStart: number): Float32Array {
        if (this._bufferPtr === null) {
            this._bufferPtr = alloc128();
        }

        const floatView = new Float32Array(memory.buffer, this._bufferPtr, 128);
        floatView.fill(0);

        processBlock(this._bufferPtr, sampleStart);
        return view128Samples(memory.buffer, this._bufferPtr);
    }
}
