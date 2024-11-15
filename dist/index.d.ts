import client from './client';
export * from '../types/client.d';
export * from '../types/wled-constants.d';
export * from '../types/wled-info.d';
export * from '../types/wled-segment.d';
export * from '../types/wled-state.d';
declare const useWledClient: (options: import("../types/client.d").ClientOptions) => {
    wledClient: client;
    status: "connected" | "disconnected" | "failed";
    info: {} | import("../types/wled-info.d").WLEDInfo;
    state: {} | import("../types/wled-state.d").WLEDState;
    effects: import("../types/wled-effects").WLEDEffects | [];
    palettes: [] | import("../types/wled-palettes").WLEDPalettes;
};
export { useWledClient };
declare const wledClient: typeof client;
export default wledClient;
