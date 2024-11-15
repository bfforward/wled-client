import axios from "axios";
import axiosRetry from "axios-retry";
import EventEmitter from "events";
class client extends EventEmitter {
    _baseUrl;
    _axiosInstance;
    _status = "disconnected";
    _info = null;
    _state = null;
    _effects = null;
    _palettes = null;
    constructor({ baseUrl, ssl = false, port = 80 }) {
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
    async connect() {
        try {
            if (this._status === "connected") {
                this.emit("statusChange");
            }
            await this.getAll();
            this._status = "connected";
            this.emit("statusChange");
        }
        catch (error) {
            this._status = "failed";
            this.emit("statusChange");
        }
    }
    async disconnect() {
        this._status = "disconnected";
        this.emit("statusChange");
    }
    get status() {
        return this._status;
    }
    /* -------------------------------------------------------------------------- */
    /*                                   GET ALL                                  */
    /* -------------------------------------------------------------------------- */
    async getAll(config) {
        try {
            const response = await this._axiosInstance.get("/", config);
            this._info = response.data.info;
            this._state = response.data.state;
            this._effects = response.data.effects;
            this._palettes = response.data.palettes;
            this.emit("infoChange");
            this.emit("stateChange");
            this.emit("effectsChange");
            this.emit("palettesChange");
        }
        catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    /* -------------------------------------------------------------------------- */
    /*                                    INFO                                    */
    /* -------------------------------------------------------------------------- */
    async getInfo(config) {
        try {
            const response = await this._axiosInstance.get("/info", config);
            this._info = response.data;
            this.emit("infoChange");
        }
        catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    async rename(newName) {
        const url = `${this._baseUrl}/settings/ui`;
        const formData = new FormData();
        formData.append("DS", newName);
        try {
            await axios.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            await this.getInfo();
            this.emit("infoChange");
        }
        catch (error) {
            console.error("Error renaming:", error);
        }
    }
    get info() {
        return this._info;
    }
    /* -------------------------------------------------------------------------- */
    /*                                    STATE                                   */
    /* -------------------------------------------------------------------------- */
    async getState(config) {
        try {
            const response = await this._axiosInstance.get("/state", config);
            this._state = response.data;
            this.emit("stateChange");
        }
        catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    async setState(newState, config) {
        try {
            const response = await this._axiosInstance.post("/state", newState, config);
            const updatedState = { ...this._state, ...newState };
            this._state = updatedState;
            this.emit("stateChange");
        }
        catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    get state() {
        return this._state;
    }
    /* -------------------------------------------------------------------------- */
    /*                                   EFFECTS                                  */
    /* -------------------------------------------------------------------------- */
    async getEffects(config) {
        try {
            const response = await this._axiosInstance.get("/eff", config);
            this._effects = response.data;
            this.emit("effectsChange");
        }
        catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    get effects() {
        return this._effects;
    }
    /* -------------------------------------------------------------------------- */
    /*                                  PALETTES                                  */
    /* -------------------------------------------------------------------------- */
    async getPalettes(config) {
        try {
            const response = await this._axiosInstance.get("/pal", config);
            this._palettes = response.data;
            this.emit("palettesChange");
        }
        catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    get palettes() {
        return this._palettes;
    }
    /* -------------------------------------------------------------------------- */
    /*                                ERROR HANDLER                               */
    /* -------------------------------------------------------------------------- */
    handleError(error) {
        console.error("API Error:", error.message);
    }
}
export default client;
