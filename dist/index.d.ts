import client from './client';
export * from '../types/client.d';
export * from '../types/wled-constants.d';
export * from '../types/wled-info.d';
export * from '../types/wled-segment.d';
export * from '../types/wled-state.d';
declare const useWledClient: (options: import("../types/client.d").ClientOptions) => {
    wledClient: client;
    status: "connected" | "disconnected" | "failed";
    info: import("../types/wled-info.d").WLEDInfo | null;
    state: import("../types/wled-state.d").WLEDState | null;
    effects: import("../types/wled-effects").WLEDEffects | null;
    palettes: import("../types/wled-palettes").WLEDPalettes | null;
};
export { useWledClient };
declare const wledClient: typeof client;
export default wledClient;
