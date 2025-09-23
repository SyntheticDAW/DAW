import { Tip } from "./TipInterface"


type tipPropertyNames = "bitDepth"
export const TrackOptionTips: Record<tipPropertyNames,Tip> = {
    "bitDepth": {
        name: "Bit Depth",
        value: "Bit depth is the amount of possible amplitude values for each sample value. E.g. 8 bit can only be 0-255, while 16 bit can be -32,768 to 32,767. "
    }
}


