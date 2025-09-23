export interface RGBColorInterface {
    /** 0-255 */
    R: number;
    /** 0-255 */
    G: number;
    /** 0-255 */
    B: number,
    /** 0-255 */
    A?: number
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function RGBColor(r: number,g: number, b: number, a?: number): RGBColorInterface {
    return {
        R: clamp(r,0,255),
        G: clamp(g,0,255),
        B: clamp(b,0,255),
        A: a ? clamp(a,0,255) : 255
    }
}

export function colorAsHex(c: RGBColorInterface) {
    return "#" + [c.R,c.G,c.B,c.A].map(n => (n ?? 255).toString(16).padStart(2,'0')).join('')
}