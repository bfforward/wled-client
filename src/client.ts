import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ClientOptions, ClientStatus } from "../types/client";
import axiosRetry from "axios-retry";
import { WLEDJSONAll } from "../types/wled-all";
import { WLEDInfo } from "../types/wled-info";
import { WLEDState, WLEDUpdatableState } from "../types/wled-state";
import { WLEDEffects } from "../types/wled-effects";
import { WLEDPalettes } from "../types/wled-palettes";
import EventEmitter from "events";

class client extends EventEmitter {
  private _baseUrl: string;
  private _axiosInstance: AxiosInstance;
  private _status: ClientStatus = "disconnected";
  private _info: WLEDInfo | null = null;
  private _state: WLEDState | null = null;
  private _effects: WLEDEffects | null = null;
  private _palettes: WLEDPalettes | null = null;

  constructor({ baseUrl, ssl = false, port = 80 }: ClientOptions) {
    super();
    this._baseUrl = `${ssl ? "https" : "http"}://${baseUrl}:${port}`;
    this._axiosInstance = axios.create({
      baseURL: `${ssl ? "https" : "http"}://${baseUrl}:${port}/json`,
    });
    axiosRetry(this._axiosInstance, { retries: 3 });
  }

  /* -------------------------------------------------------------------------- */
  /*                                 CONNECTION                                 */
  /* -------------------------------------------------------------------------- */
  public async connect() {
    try {
      if (this._status === "connected") {
        this.emit("statusChange");
      }
      await this.getAll();
      this._status = "connected";
      this.emit("statusChange");
    } catch (error) {
      this._status = "failed";
      this.emit("statusChange");
    }
  }

  public async disconnect() {
    this._status = "disconnected";
    this.emit("statusChange");
  }

  public get status() {
    return this._status;
  }

  /* -------------------------------------------------------------------------- */
  /*                                   GET ALL                                  */
  /* -------------------------------------------------------------------------- */
  public async getAll(config?: AxiosRequestConfig) {
    try {
      const response: AxiosResponse<WLEDJSONAll> =
        await this._axiosInstance.get("/", config);
      this._info = response.data.info;
      this._state = response.data.state;
      this._effects = response.data.effects;
      this._palettes = response.data.palettes;
      this.emit("infoChange");
      this.emit("stateChange");
      this.emit("effectsChange");
      this.emit("palettesChange");
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                    INFO                                    */
  /* -------------------------------------------------------------------------- */
  public async getInfo(config?: AxiosRequestConfig) {
    try {
      const response: AxiosResponse<WLEDInfo> = await this._axiosInstance.get(
        "/info",
        config
      );
      this._info = response.data;
      this.emit("infoChange");
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  public async rename(newName: string) {
    const url = `${this._baseUrl}/settings/ui`;
    const formData = new FormData();
    formData.append("DS", newName);
    try {
      await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error renaming:", error);
    }
  }

  public get info() {
    return this._info;
  }

  /* -------------------------------------------------------------------------- */
  /*                                    STATE                                   */
  /* -------------------------------------------------------------------------- */
  public async getState(config?: AxiosRequestConfig) {
    try {
      const response: AxiosResponse<WLEDState> = await this._axiosInstance.get(
        "/state",
        config
      );
      this._state = response.data;
      this.emit("stateChange");
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  public async setState(
    newState: WLEDUpdatableState,
    config?: AxiosRequestConfig
  ) {
    try {
      const response: AxiosResponse<WLEDState> = await this._axiosInstance.post(
        "/state",
        newState,
        config
      );
      const updatedState = { ...this._state, ...newState };
      this._state = updatedState;
      this.emit("stateChange");
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  public get state() {
    return this._state;
  }

  /* -------------------------------------------------------------------------- */
  /*                                   EFFECTS                                  */
  /* -------------------------------------------------------------------------- */
  public async getEffects(config?: AxiosRequestConfig) {
    try {
      const response: AxiosResponse<WLEDEffects> =
        await this._axiosInstance.get("/eff", config);
      this._effects = response.data;
      this.emit("effectsChange");
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  public get effects() {
    return this._effects;
  }

  /* -------------------------------------------------------------------------- */
  /*                                  PALETTES                                  */
  /* -------------------------------------------------------------------------- */
  public async getPalettes(config?: AxiosRequestConfig) {
    try {
      const response: AxiosResponse<WLEDPalettes> =
        await this._axiosInstance.get("/pal", config);
      this._palettes = response.data;
      this.emit("palettesChange");
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  public get palettes() {
    return this._palettes;
  }

  /* -------------------------------------------------------------------------- */
  /*                                ERROR HANDLER                               */
  /* -------------------------------------------------------------------------- */
  private handleError(error: any) {
    console.error("API Error:", error.message);
  }
}

export default client;
