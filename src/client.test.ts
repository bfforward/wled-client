import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import client from "./client";
import { WLEDMockInfo } from "../types/wled-info";
import { WLEDMockState } from "../types/wled-state";
import { WLEDEffects } from "../types/wled-effects";
import { WLEDPalettes } from "../types/wled-palettes";
import { WLEDMockJSONAll } from "../types/wled-all";
import { ClientConstructor } from "../types/client";

describe("WLED Client", () => {
  let wledClient: client;
  let mock: MockAdapter;

  const mockConstructor: ClientConstructor = {
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
    expect(wledClient["axiosInstance"].defaults.baseURL).toBe(
      expectedBaseURL
    );
  });

  it("should be initialized with ssl and port 443", () => {
    const constructorSecureParams: ClientConstructor = {
      baseUrl: mockConstructor.baseUrl,
      ssl: true,
      port: 443,
    };
    const secureInstance = new client(constructorSecureParams);
    const expectedBaseURL = `https://${mockConstructor.baseUrl}:443/json`;
    expect(secureInstance["axiosInstance"].defaults.baseURL).toBe(
      expectedBaseURL
    );
  });

  it("should be initialized with default security and port", () => {
    const minimumParams: ClientConstructor = {
      baseUrl: mockConstructor.baseUrl,
    };
    const defaultInstance = new client(minimumParams);
    const expectedBaseURL = `http://${mockConstructor.baseUrl}:80/json`;
    expect(defaultInstance["axiosInstance"].defaults.baseURL).toBe(
      expectedBaseURL
    );
  });

  test("should initialize and fetch info and state", async () => {
    const mockAll: WLEDMockJSONAll = {
      info: {},
      state: {},
      effects: [],
      palettes: [],
    };
    mock.onGet("/").reply(200, mockAll);
    const result = await wledClient.init();
    expect(result).toBe("connected");
    expect(wledClient.info).toEqual(mockAll.info);
    expect(wledClient.state).toEqual(mockAll.state);
    expect(wledClient.effects).toEqual(mockAll.effects);
    expect(wledClient.palettes).toEqual(mockAll.palettes);
  });

  test("should return connected if already connected", async () => {
    mock.onGet("/").reply(200, {});
    wledClient.status = "connected";
    const result = await wledClient.init();
    expect(result).toBe("connected");
  });

  test("should return failed if init fails to get data", async () => {
    mock.onGet("/").reply(404);
    const result = await wledClient.init();
    expect(result).toBe("failed");
  });

  test("should fetch info", async () => {
    const mockInfo: WLEDMockInfo = {
      ver: "0.12.0",
      leds: { count: 150 },
      name: "WLED",
    };
    mock.onGet("/info").reply(200, mockInfo);
    const result = await wledClient.getInfo();
    expect(result).toEqual(mockInfo);
    expect(wledClient.info).toEqual(mockInfo);
  });

  test("should fetch state", async () => {
    const mockState: WLEDMockState = { on: true, bri: 128 };
    mock.onGet("/state").reply(200, mockState);
    const result = await wledClient.getState();
    expect(result).toEqual(mockState);
    expect(wledClient.state).toEqual(mockState);
  });

  test("should set new state", async () => {
    const mockState: WLEDMockState = { on: true, bri: 128 };
    const newState: WLEDMockState = { on: false };
    wledClient.state = mockState;
    mock.onPost("/state").reply(200, { ...mockState, ...newState });
    const result = await wledClient.setState(newState);
    expect(result).toEqual({ ...mockState, ...newState });
    expect(wledClient.state).toEqual({ ...mockState, ...newState });
  });

  test("should fetch effects", async () => {
    const mockEffects: WLEDEffects = ["Effect1", "Effect2"];
    mock.onGet("/eff").reply(200, mockEffects);
    const result = await wledClient.getEffects();
    expect(result).toEqual(mockEffects);
    expect(wledClient.effects).toEqual(mockEffects);
  });

  test("should fetch palettes", async () => {
    const mockPalettes: WLEDPalettes = ["Palette1", "Palette2"];
    mock.onGet("/pal").reply(200, mockPalettes);
    const result = await wledClient.getPalettes();
    expect(result).toEqual(mockPalettes);
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
});
