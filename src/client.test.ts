import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import client from "./client";
import { WLEDMockInfo } from "../types/wled-info";
import { WLEDMockState } from "../types/wled-state";
import { WLEDEffects } from "../types/wled-effects";
import { WLEDPalettes } from "../types/wled-palettes";
import { WLEDMockJSONAll } from "../types/wled-all";
import { ClientOptions } from "../types/client";

describe("WLED Client", () => {
  let wledClient: client;
  let mock: MockAdapter;

  const mockConstructor: ClientOptions = {
    baseUrl: "localhost",
    ssl: false,
    port: 80,
  }

  beforeEach(() => {
    mock = new MockAdapter(axios);
    wledClient = new client(mockConstructor);
  });

  afterEach(() => {
    mock.reset();
  });

  it("should be initialized with the correct base URL", () => {
    const expectedBaseURL = `http://${mockConstructor.baseUrl}:${mockConstructor.port}/json`;
    expect(wledClient["_axiosInstance"].defaults.baseURL).toBe(
      expectedBaseURL
    );
  });

  it("should be initialized with ssl and port 443", () => {
    const constructorSecureParams: ClientOptions = {
      baseUrl: mockConstructor.baseUrl,
      ssl: true,
      port: 443,
    };
    const secureInstance = new client(constructorSecureParams);
    const expectedBaseURL = `https://${mockConstructor.baseUrl}:443/json`;
    expect(secureInstance["_axiosInstance"].defaults.baseURL).toBe(
      expectedBaseURL
    );
  });

  it("should be initialized with default security and port", () => {
    const minimumParams: ClientOptions = {
      baseUrl: mockConstructor.baseUrl,
    };
    const defaultInstance = new client(minimumParams);
    const expectedBaseURL = `http://${mockConstructor.baseUrl}:80/json`;
    expect(defaultInstance["_axiosInstance"].defaults.baseURL).toBe(
      expectedBaseURL
    );
  });

  test("should connect and fetch all data", async () => {
    const mockAll: WLEDMockJSONAll = {
      info: { name: "TestWLED" },
      state: { on: false },
      effects: [],
      palettes: [],
    };
    mock.onGet("/").reply(200, mockAll);
    await wledClient.connect();
    expect(wledClient.status).toBe("connected");
    expect(wledClient.info).toEqual(mockAll.info);
    expect(wledClient.state).toEqual(mockAll.state);
    expect(wledClient.effects).toEqual(mockAll.effects);
    expect(wledClient.palettes).toEqual(mockAll.palettes);
  });

  test("should have status connected if already connected", async () => {
    mock.onGet("/").reply(200, { info: {}, state: {}, effects: [], palettes: [] });
    await wledClient.connect();
    expect(wledClient.status).toBe("connected");

    mock.onGet("/").reply(200, { info: {}, state: {}, effects: [], palettes: [] });
    await wledClient.connect();
    expect(wledClient.status).toBe("connected");
  });

  test("should have status failed if connect fails", async () => {
    mock.onGet("/").reply(404);
    await expect(wledClient.connect()).rejects.toThrow();
    expect(wledClient.status).toBe("failed");
  });

  test("should fetch info", async () => {
    const mockInfo: WLEDMockInfo = {
      ver: "0.12.0",
      leds: { count: 150 },
      name: "WLED",
    };
    mock.onGet("/info").reply(200, mockInfo);
    await wledClient.getInfo();
    expect(wledClient.info).toEqual(mockInfo);
  });

  test("should fetch state", async () => {
    const mockState: WLEDMockState = { on: true, bri: 128 };
    mock.onGet("/state").reply(200, mockState);
    await wledClient.getState();
    expect(wledClient.state).toEqual(mockState);
  });

  test("should set new state", async () => {
    const initialState: WLEDMockState = { on: true, bri: 128 };
    const newState: WLEDMockState = { on: false };
    const expectedState = { ...initialState, ...newState };

    mock.onPost("/state").reply(200, expectedState);

    await wledClient.setState(newState);

    expect(wledClient.state).toEqual(expectedState);
  });

  test("should fetch effects", async () => {
    const mockEffects: WLEDEffects = ["Effect1", "Effect2"];
    mock.onGet("/eff").reply(200, mockEffects);
    await wledClient.getEffects();
    expect(wledClient.effects).toEqual(mockEffects);
  });

  test("should fetch palettes", async () => {
    const mockPalettes: WLEDPalettes = ["Palette1", "Palette2"];
    mock.onGet("/pal").reply(200, mockPalettes);
    await wledClient.getPalettes();
    expect(wledClient.palettes).toEqual(mockPalettes);
  });

  test("should handle errors", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mock.onGet("/json/").reply(404);
    mock.onGet("/json/info").reply(404);
    mock.onGet("/json/state").reply(404);
    mock.onPost("/json/state").reply(404);
    mock.onGet("/json/eff").reply(404);
    mock.onGet("/json/pal").reply(404);
    await expect(wledClient.getAll()).rejects.toThrow();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "API Error:",
      expect.stringContaining("404")
    );
    await expect(wledClient.getInfo()).rejects.toThrow();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "API Error:",
      expect.stringContaining("404")
    );
    await expect(wledClient.getState()).rejects.toThrow();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "API Error:",
      expect.stringContaining("404")
    );
    await expect(wledClient.setState({})).rejects.toThrow();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "API Error:",
      expect.stringContaining("404")
    );
    await expect(wledClient.getEffects()).rejects.toThrow();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "API Error:",
      expect.stringContaining("404")
    );
    await expect(wledClient.getPalettes()).rejects.toThrow();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "API Error:",
      expect.stringContaining("404")
    );

    consoleErrorSpy.mockRestore();
  });

  test("should disconnect", async () => {
    // First connect to set status
    mock.onGet("/").reply(200, { info: {}, state: {}, effects: [], palettes: [] });
    await wledClient.connect();
    expect(wledClient.status).toBe("connected");

    await wledClient.disconnect();
    expect(wledClient.status).toBe("disconnected");
  });

  test("getAll should throw if API call fails", async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mock.onGet("/").reply(404);
    await expect(wledClient.getAll()).rejects.toThrow();
    expect(consoleErrorSpy).toHaveBeenCalledWith("API Error:", expect.stringContaining("404"));
    expect(wledClient.status).not.toBe("connected"); // Status shouldn't become connected
    consoleErrorSpy.mockRestore();
  });

  describe("rename", () => {
    const newName = "NewWLEDName";
    const mockInfo: WLEDMockInfo = {
      ver: "0.14.0",
      leds: { count: 30 },
      name: newName, // Expect the new name after rename + getInfo
    };

    beforeEach(() => {
      // Mock the getInfo call that happens after successful rename
      mock.onGet("/info").reply(200, mockInfo);
      // Mock the POST request to the settings endpoint
      // We need to match the non-JSON base URL and form-data
      const renameUrl = `http://${mockConstructor.baseUrl}:${mockConstructor.port}/settings/ui`;
      mock.onPost(renameUrl).reply((config) => {
        // Axios-mock-adapter doesn't easily assert FormData content,
        // but we can check if the data looks like FormData
        if (config.data instanceof FormData && config.data.get("DS") === newName) {
          return [200, "OK"]; // Simulate success
        } else {
          return [400, "Bad Request"]; // Fail if data is wrong
        }
      });
    });

    it("should rename the device and update info", async () => {
      await wledClient.rename(newName);
      // Check if getInfo was called implicitly and updated the client state
      expect(wledClient.info).toEqual(mockInfo);
    });

    it("should handle errors during rename POST", async () => {
      const renameUrl = `http://${mockConstructor.baseUrl}:${mockConstructor.port}/settings/ui`;
      // Override the specific POST mock to return an error
      mock.onPost(renameUrl).reply(500, "Server Error");

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // rename catches the error internally and logs it
      await wledClient.rename(newName);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error renaming:", expect.anything());
      // Ensure getInfo wasn't called and info wasn't updated with mockInfo
      expect(wledClient.info).toBeNull(); // Assuming it starts as null
      
      consoleErrorSpy.mockRestore();
    });

     it("should handle errors during getInfo after rename", async () => {
      // Keep the POST mock successful, but make the subsequent getInfo fail
       mock.onGet("/info").reply(500, "Server Error");

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // rename catches the error internally and logs it
      await wledClient.rename(newName);
      
      // The error comes from the getInfo call within rename
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error renaming:", expect.anything()); 
      // Ensure info wasn't updated
      expect(wledClient.info).toBeNull(); 
      
      consoleErrorSpy.mockRestore();
    });
  });
});
