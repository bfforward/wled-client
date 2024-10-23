import axios from "axios";
import axiosRetry from "axios-retry";
class client {
    axiosInstance;
    isReady = Promise.resolve(false);
    info = {};
    state = {};
    constructor({ baseUrl, ssl = false, port = 80 }) {
        this.axiosInstance = axios.create({
            baseURL: `${ssl ? "https" : "http"}://${baseUrl}:${port}`,
        });
        axiosRetry(this.axiosInstance, { retries: 3 });
    }
    async getInfo(config) {
        try {
            const response = await this.axiosInstance.get('/info', config);
            console.debug("getInfo response:", response.data);
            this.info = response.data;
            return response.data;
        }
        catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    async getState(config) {
        try {
            const response = await this.axiosInstance.get('/state', config);
            console.debug("getState response:", response.data);
            this.state = response.data;
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
