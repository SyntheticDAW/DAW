// assembly/env.ts
@external("env", "fetch128")
export declare function fetch128(pluginId: i32, bufferPtr: usize): void;

@external("env", "console.log")
export declare function consoleLog(s: string): void;

@external("env", "sendSequencedMidiToTrack")
export declare function sendSeqMidi(trackId: u32, bufferPtr: usize, length: i32): void;
