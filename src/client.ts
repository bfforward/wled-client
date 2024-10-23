import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ClientConstructor } from "../types/client";
import axiosRetry from "axios-retry";
import { WLEDInfo } from "../types/wled-info";
import { WLEDState } from "../types/wled-state";

class client {
  private axiosInstance: AxiosInstance;
  public readonly isReady: Promise<boolean> = Promise.resolve(false);
  public info: WLEDInfo | {} = {};
  public state: WLEDState | {} = {};

  constructor({ baseUrl, ssl = false, port = 80 }: ClientConstructor) {
    this.axiosInstance = axios.create({
      baseURL: `${ssl ? "https" : "http"}://${baseUrl}:${port}`,
    });
    axiosRetry(this.axiosInstance, { retries: 3 });
  }

  public async getInfo(config?: AxiosRequestConfig): Promise<WLEDInfo> {
    try {
      const response: AxiosResponse<WLEDInfo> = await this.axiosInstance.get('/info', config);
      console.debug("getInfo response:", response.data);
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
      console.debug("getState response:", response.data);
      this.state = response.data;
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
