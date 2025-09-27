import { colorAsHex, RGBColorInterface } from "../../ui/interfaces/RGBColorInterface";
import { linkTrack, setTrackIsActive } from "../../wasm/build/release";
import { AutomationTrack } from "./automation_track";
import { SProject } from "./project";
// import { AudioClipSource } from "./sources/AudioClipSource";
// import { MidiClipSource } from "./sources/MidiClipSource";
import { SPlugin } from "./plugins/SPlugin";
import { PluginInterface } from "../JWI/CoreJWI";

export interface TrackOptionsInterface {
    name?: string;
    bitDepth?: BitDepth;
    project: SProject;
    color?: RGBColorInterface;
    // AudioDataSource: AudioClipSource | MidiClipSource;
}

export let tracksArray: Track[] = [];

export type BitDepth = 8 | 16 | 24 | 32;

export class Track {
    bitDepth: BitDepth;
    automationTracks: AutomationTrack[];
    name: string;
    uuid: string;
    color: string;
    trackNumId: number;
    active: boolean;
    plugin: SPlugin | null;
    project: SProject

    constructor(options: TrackOptionsInterface) {
        this.bitDepth = options.bitDepth ?? 32;
        this.automationTracks = [];
        this.name = options.name?.slice(0, 25) ?? 'Track ' + (tracksArray.length + 1);
        this.trackNumId = tracksArray.length;
        this.uuid = crypto.randomUUID();
        this.color = options.color ? colorAsHex(options.color) : "#300606e5";
        this.active = false;
        this.plugin = null;
        this.project = options.project
        tracksArray.push(this);

        // if (options.AudioDataSource instanceof SPlugin && options.AudioDataSource.loaded) {
        //     this.setPlugin(options.AudioDataSource);
        // }
    }

    setPlugin(plugin: SPlugin) {
        if (!plugin.loaded) throw new Error("Plugin must be loaded to link to a track.");

        // Set plugin reference
        this.plugin = plugin;

        // Automatically link this track in the WASM engine
        linkTrack(plugin.pluginId, this.bitDepth, 1); // 1 = MediaType.Audio (as per your enums)

        const exports = this.plugin.pluginInstance!.instance.exports as unknown as PluginInterface;
        exports.initialize(this.project.sampleRate, this.project.bpm);
        // Optionally mark track active by default
        this.setActive(true);
    }

    setActive(active: boolean) {
        this.active = active;

        // Update WASM track state if it was linked
        if (this.plugin) setTrackIsActive(this.trackNumId, this.active);

        return this.active;
    }
}
