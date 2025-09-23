import { colorAsHex, RGBColorInterface } from "../../ui/interfaces/RGBColorInterface";
import { AutomationTrack } from "./automation_track";
import { SProject } from "./project";
import { AudioClipSource } from "./sources/AudioClipSource";
import { MidiClipSource } from "./sources/MidiClipSource";

let baseTrackId = 0

export interface TrackOptionsInterface {
    /**
     * track name (0-50)
     */
    name?: string
    /** The bit depth of the track (8 | 16 | 24 | 32), e.g. "8 bit music". 32 is default */
    bitDepth?: BitDepth
    project: SProject
    color?: RGBColorInterface;
    AudioDataSource: AudioClipSource | MidiClipSource;
}

export type BitDepth = 8 | 16 | 24 | 32;

export class Track {
    bitDepth: BitDepth;
    automationTracks: AutomationTrack[];
    name: string;
    uuid: string;
    color: string;
    constructor(options: TrackOptionsInterface) {
        this.bitDepth = options.bitDepth ?? 32;
        this.automationTracks = [];

        baseTrackId++;
        this.name = options.name?.slice(0,25) ?? 'Track ' + baseTrackId;
        this.uuid = crypto.randomUUID()
        this.color = options.color ? colorAsHex(options.color) : "#300606e5"
    }
}