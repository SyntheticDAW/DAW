import { loadPlugin, LoadPluginResponse } from "../../JWI/CoreJWI";

export enum MediaType {
  Audio,
  Midi,
}

export let globalPluginID = 0;

export class SPlugin {
    pluginId: number;
    mediaType: MediaType | null;
    pluginInstance: LoadPluginResponse | null;
    pluginBin: Uint8Array;
    loaded: boolean;
    constructor(SXPPluginBinary: Uint8Array) {
        globalPluginID = ++globalPluginID >>> 0
        this.pluginId = globalPluginID;
        this.pluginBin = SXPPluginBinary;
        this.pluginInstance = null;
        this.mediaType = null;
        this.loaded = false;
    }

    async load() {
        this.pluginInstance = await loadPlugin(this.pluginBin);
        this.mediaType = this.pluginInstance.pluginObject.mediaType;
        this.loaded = true;
    }

    async getPluginObject() {
        if (!this.loaded) return null; else return this.pluginInstance?.pluginObject
    }
}
