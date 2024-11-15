import { ClientOptions } from "../types/client";
import client from "./client";
export declare const useClient: (options: ClientOptions) => {
    wledClient: client;
    status: "connected" | "disconnected" | "failed";
    info: {} | import(".").WLEDInfo;
    state: {} | import(".").WLEDState;
    effects: import("../types/wled-effects").WLEDEffects | [];
    palettes: [] | import("../types/wled-palettes").WLEDPalettes;
};
