import axios from "axios";
import axiosRetry from "axios-retry";
class client {
    axiosInstance;
    isReady = Promise.resolve(false);
    info = {};
    state = {};
    constructor({ baseUrl, ssl = false, port = 80 }) {
        this.axiosInstance = axios.create({
            baseURL: `${ssl ? "https" : "http"}://${baseUrl}:${port}/api`,
        });
        axiosRetry(this.axiosInstance, { retries: 3 });
    }
    async get(url, config) {
        try {
            const response = await this.axiosInstance.get(url, config);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    async post(url, data, config) {
        try {
            const response = await this.axiosInstance.post(url, data, config);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    handleError(error) {
        console.error("API Error:", error.message);
    }
}
export default client;
