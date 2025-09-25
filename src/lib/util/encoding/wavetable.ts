import { decode, encode } from "@msgpack/msgpack";
import { str2hex } from "./stringToHex";
import { decodef32aBinaryCopy, encodef32aBinaryCopy } from "./float32array";

export interface NamedWTFrame {
    name: string;
    frame: Float32Array;
}

export interface NamedWTFrameBin {
    name: string;
    frame: Uint8Array;
}

export interface WavetableObject {
    name: string;
    frames: NamedWTFrame[];
}

interface BinaryEncodedExportObject {
    name: string,
    frames: NamedWTFrameBin[]
}


export class Wavetable {
    name: string;
    nameHex: string;
    frames: Float32Array[];
    optionalNames: Record<number, string>;
    constructor(name: string) {
        this.name = name;
        this.nameHex = str2hex(name)
        this.frames = [];
        this.optionalNames = {}
    }

    addFrame(f32a: Float32Array, name?: string): number {
        const index: number = this.frames.push(f32a) - 1
        if (name) {
            this.optionalNames[index] = name;
        }
        return index
    }

    setFrame(index: number, f32a: Float32Array, name?: string): Float32Array {
        this.frames[index] = new Float32Array(f32a);
        if (name) {
            this.optionalNames[index] = name;
        }
        return this.frames[index]
    }

    getFrame(index: number): Float32Array {
        return this.frames[index]
    }

    getFrames(): NamedWTFrame[] {
        const frames: NamedWTFrame[] = [];
        for (let i: number = 0; i < this.frames.length; i++) {
            frames.push({
                frame: this.frames[i],
                name: this.optionalNames[i]
            })
        }

        return frames
    }

    _getFramesBinary(): NamedWTFrameBin[] {
        const frames: NamedWTFrame[] = this.getFrames()
        return frames.map(f => {
            return {
                frame: encodef32aBinaryCopy(f.frame),
                name: f.name,
            }
        })
    }
    
    _loadFromFrames(frames: NamedWTFrame[]): void {
        for (let i = 0; i < frames.length; i++) {
            this.frames[i] = frames[i].frame
            if (frames[i].name) {
                this.optionalNames[i] = frames[i].name
            }
        }
    }
    export(): Uint8Array {
        const namedFrames: NamedWTFrameBin[] = this._getFramesBinary();
        return encode({
            name: this.name,
            frames: namedFrames
        })
    }

    static from(source: Uint8Array | BinaryEncodedExportObject) {
        switch (source.constructor) {
            case Uint8Array:
                let frames: NamedWTFrame[] = []
                const rawDecoded: BinaryEncodedExportObject = decode(source as Uint8Array) as any;
                for (let i = 0; i < rawDecoded.frames.length; i++) {
                    const decodedFrame = rawDecoded.frames[i]
                    frames.push({
                        name: decodedFrame.name,
                        frame: decodef32aBinaryCopy(decodedFrame.frame)
                    })
                }
                const theClass = new Wavetable(rawDecoded.name)
                theClass._loadFromFrames(frames)
                return theClass
            default:
                const src = source as BinaryEncodedExportObject;
                let _frames: NamedWTFrame[] = []
                for (let i = 0; i < src.frames.length; i++) {
                    const decodedFrame = src.frames[i]
                    _frames.push({
                        name: decodedFrame.name,
                        frame: decodef32aBinaryCopy(decodedFrame.frame)
                    })
                }
                const myClass = new Wavetable(src.name)
                myClass._loadFromFrames(_frames)
                return myClass
        }
    }
}