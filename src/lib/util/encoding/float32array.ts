/** transforms a Float32Array into binary (Uint8Array) for export as a copy. */ 
export function encodef32aBinaryCopy(array: Float32Array): Uint8Array {
    const copiedBuffer = array.buffer.slice(array.byteOffset, array.byteOffset + array.byteLength);
    return new Uint8Array(copiedBuffer);
}



/** decodes a binary encoded Float32Array (in Uint8Array format) back to f32a as a copy */
export function decodef32aBinaryCopy(array: Uint8Array): Float32Array {
    const copiedBuffer = array.buffer.slice(array.byteOffset, array.byteOffset + array.byteLength);
    return new Float32Array(copiedBuffer);
}


/** same as encodef32aBinaryCopy but creates a view */
export function encodef32aBinaryView(array: Float32Array): Uint8Array {
    return new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
}

/** same as decodef32aBinaryCopy but creates a view */
export function decodef32aBinaryView(array: Uint8Array): Float32Array {
    return new Float32Array(array.buffer, array.byteOffset, array.byteLength / 4);
}
