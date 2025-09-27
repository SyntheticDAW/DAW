

/** Quantizes Float32Array [-1,1] to a given bit depth and writes into WASM memory */
// AssemblyScript internal helper
// import "std/portable/index"; // Make sure SIMD types are available
import { BitDepth } from ".";


export function quantizeSIMD(f32a: Float32Array, bitDepth: BitDepth): Float32Array {
  const len = f32a.length;
  const out = new Float32Array(len);

  let scale = 1;
  switch (bitDepth) {
    case 8: scale = 127; break;
    case 16: scale = 32767; break;
    case 24: scale = 8388607; break;
    case 32: return f32a.slice(); // copy of original
    default: throw new Error("Unsupported bit depth");
  }

  let i = 0;
  while (i + 4 <= len) {
    let v = v128.load(f32a.dataStart + (i << 2));
    v = f32x4.min(f32x4.splat(1.0), f32x4.max(f32x4.splat(-1.0), v));
    let scaled = f32x4.mul(v, f32x4.splat(scale));
    let rounded = f32x4.round(scaled);            // nearest integer
    let res = f32x4.div(rounded, f32x4.splat(scale)); // back to [-1,1]
    v128.store(out.dataStart + (i << 2), res);
    i += 4;
  }

  // leftover
  for (; i < len; i++) {
    let v = Math.max(-1, Math.min(1, f32a[i]));
    out[i] = Math.round(v * scale) / scale;
  }

  return out;
}
