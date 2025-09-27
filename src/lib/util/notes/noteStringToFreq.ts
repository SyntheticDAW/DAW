export function noteToFrequency(note: string, a4: number = 440): number {
  const noteOffsets: Record<string, number> = { 
    "c": -9, "c#": -8, "db": -8,
    "d": -7, "d#": -6, "eb": -6,
    "e": -5,
    "f": -4, "f#": -3, "gb": -3,
    "g": -2, "g#": -1, "ab": -1,
    "a": 0, "a#": 1, "bb": 1,
    "b": 2
  };

  const match = note.match(/^([a-gA-G])([b#]?)(-?\d+)$/);
  if (!match) throw new Error("Invalid note format: " + note);

  const [, letter, accidental, octaveStr] = match;
  const pitchClass = (letter + accidental).toLowerCase();

  const semitoneOffset = noteOffsets[pitchClass];
  if (semitoneOffset === undefined) throw new Error("Invalid pitch class: " + pitchClass);

  const octave = parseInt(octaveStr, 10);
  const n = semitoneOffset + (octave - 4) * 12;

  return a4 * Math.pow(2, n / 12);
}
