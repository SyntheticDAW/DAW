export function sumTracksNormalizedLive(tracks: Float32Array[], out: Float32Array): void {
  const len: i32 = out.length;
  const nTracks: f32 = tracks.length as f32;
  const scale: f32 = 1.0 / nTracks;

  let i: i32 = 0;
  for (; i <= len - 4; i += 4) {
    let acc: v128 = f32x4.splat(0.0);

    for (let t: i32 = 0; t < tracks.length; t++) {
      let vec: v128 = v128.load(tracks[t].dataStart + (i << 2));
      acc = f32x4.add(acc, vec);
    }

    acc = f32x4.mul(acc, f32x4.splat(scale));
    v128.store(out.dataStart + (i << 2), acc);
  }
  for (; i < len; i++) {
    let sum: f32 = 0.0;
    for (let t: i32 = 0; t < tracks.length; t++) {
      sum += tracks[t][i];
    }
    out[i] = sum * scale;
  }
}


export function applyGainFast(buffer: Float32Array, gain: f32): void {
  const len: i32 = buffer.length;
  const gainVec: v128 = f32x4.splat(gain);

  let i: i32 = 0;
  for (; i <= len - 4; i += 4) {
    let vec: v128 = v128.load(buffer.dataStart + (i << 2));
    vec = f32x4.mul(vec, gainVec);
    v128.store(buffer.dataStart + (i << 2), vec);
  }

  for (; i < len; i++) {
    buffer[i] *= gain;
  }
}
