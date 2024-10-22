import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ClientConstructor } from "../types/client";
import axiosRetry from "axios-retry";
import { WLEDInfo } from "../types/wled-info";
import { WLEDState } from "../types/wled-state";

class client {
  private axiosInstance: AxiosInstance;
  public readonly isReady: Promise<boolean> = Promise.resolve(false);
  public readonly info: WLEDInfo | {} = {};
  public readonly state: WLEDState | {} = {};

  constructor({ baseUrl, ssl = false, port = 80 }: ClientConstructor) {
    this.axiosInstance = axios.create({
      baseURL: `${ssl ? "https" : "http"}://${baseUrl}:${port}/api`,
    });
    axiosRetry(this.axiosInstance, { retries: 3 });
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get(
        url,
        config
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  public async post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(
        url,
        data,
        config
      );
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
