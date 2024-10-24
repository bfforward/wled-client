import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ClientConstructor, ClientStatus } from "../types/client";
import axiosRetry from "axios-retry";
import { WLEDJSONAll } from "../types/wled-all";
import { WLEDInfo } from "../types/wled-info";
import { WLEDState, WLEDUpdatableState } from "../types/wled-state";
import { WLEDEffects } from "../types/wled-effects";
import { WLEDPalettes } from "../types/wled-palettes";

class client {
  private axiosInstance: AxiosInstance;
  public status: ClientStatus = 'disconnected';
  public info: WLEDInfo | {} = {};
  public state: WLEDState | {} = {};
  public effects: WLEDEffects | [] = [];
  public palettes: WLEDPalettes | [] = [];

  constructor({ baseUrl, ssl = false, port = 80 }: ClientConstructor) {
    this.axiosInstance = axios.create({
      baseURL: `${ssl ? "https" : "http"}://${baseUrl}:${port}/json`,
    });
    axiosRetry(this.axiosInstance, { retries: 3 });
  }

  public async init(): Promise<ClientStatus> {
    try {
      if (this.status === 'connected') {
        return Promise.resolve(this.status);
      }
      await this.getAll();
      this.status = 'connected';
      return Promise.resolve(this.status);
    } catch (error) {
      this.status = 'failed';
      return Promise.resolve(this.status);
    }
  }

  public async getAll(config?: AxiosRequestConfig): Promise<WLEDJSONAll> {
    try {
      const response: AxiosResponse<WLEDJSONAll> = await this.axiosInstance.get('/', config);
      this.info = response.data.info;
      this.state = response.data.state;
      this.effects = response.data.effects;
      this.palettes = response.data.palettes;
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  public async getInfo(config?: AxiosRequestConfig): Promise<WLEDInfo> {
    try {
      const response: AxiosResponse<WLEDInfo> = await this.axiosInstance.get('/info', config);
      this.info = response.data;
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  public async getState(config?: AxiosRequestConfig): Promise<WLEDState> {
    try {
      const response: AxiosResponse<WLEDState> = await this.axiosInstance.get('/state', config);
      this.state = response.data;
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  public async setState(newState: WLEDUpdatableState, config?: AxiosRequestConfig): Promise<WLEDState> {
    try {
      const response: AxiosResponse<WLEDState> = await this.axiosInstance.post('/state', newState, config);
      const updatedState = { ...this.state, ...newState };
      this.state = updatedState;
      return updatedState;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  public async getEffects(config?: AxiosRequestConfig): Promise<WLEDEffects> {
    try {
      const response: AxiosResponse<WLEDEffects> = await this.axiosInstance.get('/eff', config);
      this.effects = response.data;
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  public async getPalettes(config?: AxiosRequestConfig): Promise<WLEDPalettes> {
    try {
      const response: AxiosResponse<WLEDPalettes> = await this.axiosInstance.get('/pal', config);
      this.palettes = response.data;
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: any) {
    console.error("API Error:", error.message);
  }
}

export default client;
