export function view128Samples(buf: ArrayBuffer, ptr: number): Float32Array {
    return new Float32Array(buf, ptr, 128)
}