import { AxiosRequestConfig } from "axios";
import { ClientConstructor, ClientStatus } from "../types/client";
import { WLEDJSONAll } from "../types/wled-all";
import { WLEDInfo } from "../types/wled-info";
import { WLEDState, WLEDUpdatableState } from "../types/wled-state";
import { WLEDEffects } from "../types/wled-effects";
import { WLEDPalettes } from "../types/wled-palettes";
declare class client {
    private axiosInstance;
    status: ClientStatus;
    info: WLEDInfo | {};
    state: WLEDState | {};
    effects: WLEDEffects | [];
    palettes: WLEDPalettes | [];
    constructor({ baseUrl, ssl, port }: ClientConstructor);
    init(): Promise<ClientStatus>;
    getAll(config?: AxiosRequestConfig): Promise<WLEDJSONAll>;
    getInfo(config?: AxiosRequestConfig): Promise<WLEDInfo>;
    getState(config?: AxiosRequestConfig): Promise<WLEDState>;
    setState(newState: WLEDUpdatableState, config?: AxiosRequestConfig): Promise<WLEDState>;
    getEffects(config?: AxiosRequestConfig): Promise<WLEDEffects>;
    getPalettes(config?: AxiosRequestConfig): Promise<WLEDPalettes>;
    private handleError;
}
export default client;
