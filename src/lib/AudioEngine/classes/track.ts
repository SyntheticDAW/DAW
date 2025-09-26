import { colorAsHex, RGBColorInterface } from "../../ui/interfaces/RGBColorInterface";
import { linkTrack, setTrackIsActive } from "../../wasm/build/release";
import { AutomationTrack } from "./automation_track";
import { SProject } from "./project";
import { AudioClipSource } from "./sources/AudioClipSource";
import { MidiClipSource } from "./sources/MidiClipSource";
import { SPlugin } from "./plugins/SPlugin";

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
    trackNumId: number;
    active: boolean;
    constructor(options: TrackOptionsInterface) {
        this.bitDepth = options.bitDepth ?? 32;
        this.automationTracks = [];

        baseTrackId++;
        this.name = options.name?.slice(0, 25) ?? 'Track ' + baseTrackId;
        this.trackNumId = baseTrackId;
        this.uuid = crypto.randomUUID()
        this.color = options.color ? colorAsHex(options.color) : "#300606e5"
        this.active = false;
    }

    setPlugin(plugin: SPlugin) {
        if (plugin.loaded) {
            return linkTrack(this.uuid, plugin.pluginId, this.bitDepth, plugin.mediaType!)
        } else {
            throw new Error("Plugin must be loaded to link to a track.")
        }
    }

    setActive(active: boolean) {
        this.active = active;
        setTrackIsActive(this.uuid, this.active)
        return this.active
    }


}
