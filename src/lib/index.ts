import { decode, encode } from "@msgpack/msgpack";
import { AutomationTrack } from "./AudioEngine/classes/automation_track";
import { SProject } from "./AudioEngine/classes/project";
import { Track } from "./AudioEngine/classes/track";
import { SPlugin } from "./AudioEngine/classes/plugins/SPlugin";
import { TrackOptionTips } from "./docs/tips/TrackOptions";
import { RGBColor, RGBColorInterface } from "./ui/interfaces/RGBColorInterface";
import { hex2str, str2hex } from "./util/encoding/stringToHex";
import { Wavetable } from "./util/encoding/wavetable";


export {
    AutomationTrack,
    SProject,
    Track,
    TrackOptionTips,
    RGBColor,
    type RGBColorInterface,
    str2hex,
    hex2str,
    Wavetable,
    decode,
    encode,
    SPlugin
}
