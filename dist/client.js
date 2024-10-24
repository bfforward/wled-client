import axios from "axios";
import axiosRetry from "axios-retry";
class client {
    axiosInstance;
    status = 'disconnected';
    info = {};
    state = {};
    effects = [];
    palettes = [];
    constructor({ baseUrl, ssl = false, port = 80 }) {
        this.axiosInstance = axios.create({
            baseURL: `${ssl ? "https" : "http"}://${baseUrl}:${port}/json`,
        });
        axiosRetry(this.axiosInstance, { retries: 3 });
    }
    async init() {
        try {
            if (this.status === 'connected') {
                return Promise.resolve(this.status);
            }
            await this.getAll();
            this.status = 'connected';
            return Promise.resolve(this.status);
        }
        catch (error) {
            this.status = 'failed';
            return Promise.resolve(this.status);
        }
    }
    async getAll(config) {
        try {
            const response = await this.axiosInstance.get('/', config);
            this.info = response.data.info;
            this.state = response.data.state;
            this.effects = response.data.effects;
            this.palettes = response.data.palettes;
            return response.data;
        }
        catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    async getInfo(config) {
        try {
            const response = await this.axiosInstance.get('/info', config);
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
            this.state = response.data;
            return response.data;
        }
        catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    async setState(newState, config) {
        try {
            const response = await this.axiosInstance.post('/state', newState, config);
            const updatedState = { ...this.state, ...newState };
            this.state = updatedState;
            return updatedState;
        }
        catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    async getEffects(config) {
        try {
            const response = await this.axiosInstance.get('/eff', config);
            this.effects = response.data;
            return response.data;
        }
        catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    async getPalettes(config) {
        try {
            const response = await this.axiosInstance.get('/pal', config);
            this.palettes = response.data;
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
