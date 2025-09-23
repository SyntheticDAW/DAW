import { str2hex } from "../../util/stringToHex";
import { Track } from "./track";

interface SProjectOptionsInterface {
    /**
     * the sample rate of the whole song (in Hz). Defaults to 44100 (44.1kHz)
     */
    sampleRate?: number;
    /** the BPM (tempo) of the entire song (1-1000), some tracks can override */
    bpm?: number;
    /** the name of the project (0-40 length) */
    name: string;
}
export class SProject {
    sampleRate: number;
    tracks: Track[];
    bpm: number;
    name: string;
    fileName: string;
    constructor(options: SProjectOptionsInterface) {
        /** constants */
        this.sampleRate = options.sampleRate ?? 44100;
        this.bpm = Math.max(Math.min(options.bpm ?? 150, 1000), 1);
        this.name = options.name ?? `Untitled Project ${new Date().toISOString()}`
        this.fileName = str2hex(this.name) + '.sytp' 

        /** children */
        this.tracks = [];
    }

    addTrack(track: Track) {
        this.tracks.push(track)
    }
} 