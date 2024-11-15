import { ClientOptions } from "../types/client";
import client from "./client";
export declare const useClient: (options: ClientOptions) => {
    wledClient: client;
    status: "connected" | "disconnected" | "failed";
    info: import(".").WLEDInfo | null;
    state: import(".").WLEDState | null;
    effects: import("../types/wled-effects").WLEDEffects | null;
    palettes: import("../types/wled-palettes").WLEDPalettes | null;
};
