import { AxiosRequestConfig } from "axios";
import { ClientOptions, ClientStatus } from "../types/client";
import { WLEDInfo } from "../types/wled-info";
import { WLEDState, WLEDUpdatableState } from "../types/wled-state";
import { WLEDEffects } from "../types/wled-effects";
import { WLEDPalettes } from "../types/wled-palettes";
import EventEmitter from "events";
declare class client extends EventEmitter {
    private _baseUrl;
    private _axiosInstance;
    private _status;
    private _info;
    private _state;
    private _effects;
    private _palettes;
    constructor({ baseUrl, ssl, port }: ClientOptions);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get status(): ClientStatus;
    getAll(config?: AxiosRequestConfig): Promise<void>;
    getInfo(config?: AxiosRequestConfig): Promise<void>;
    rename(newName: string): Promise<void>;
    get info(): WLEDInfo | null;
    getState(config?: AxiosRequestConfig): Promise<void>;
    setState(newState: WLEDUpdatableState, config?: AxiosRequestConfig): Promise<void>;
    get state(): WLEDState | null;
    getEffects(config?: AxiosRequestConfig): Promise<void>;
    get effects(): WLEDEffects | null;
    getPalettes(config?: AxiosRequestConfig): Promise<void>;
    get palettes(): WLEDPalettes | null;
    private handleError;
}
export default client;
