import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Client from "./client"; // Import the client class
import { ClientConstructor } from "../types/client";
import { WLEDInfo } from "../types/wled-info";
import { WLEDState } from "../types/wled-state";

describe("Client", () => {
  let mockAxios: MockAdapter;
  let clientInstance: Client;

  const baseUrl = "localhost";
  const port = 80;

  const constructorParams: ClientConstructor = {
    baseUrl,
    ssl: false,
    port,
  };

  beforeEach(() => {
    // Initialize the Axios mock adapter and client before each test
    mockAxios = new MockAdapter(axios);
    clientInstance = new Client(constructorParams);
  });

  afterEach(() => {
    // Reset mock after each test
    mockAxios.reset();
  });

  it("should be initialized with the correct base URL", () => {
    const expectedBaseURL = `http://${baseUrl}:${port}/api`;
    expect(clientInstance["axiosInstance"].defaults.baseURL).toBe(
      expectedBaseURL
    );
  });

  it("should be initialized with ssl and port 443", () => {
    const constructorSecureParams: ClientConstructor = {
      baseUrl,
      ssl: true,
      port: 443,
    };
    const secureInstance = new Client(constructorSecureParams);
    const expectedBaseURL = `https://${baseUrl}:443/api`;
    expect(secureInstance["axiosInstance"].defaults.baseURL).toBe(
      expectedBaseURL
    );
  });

  it("should be initialized with default security and port", () => {
    const minimumParams: ClientConstructor = {
      baseUrl,
    };
    const defaultInstance = new Client(minimumParams);
    const expectedBaseURL = `http://${baseUrl}:80/api`;
    expect(defaultInstance["axiosInstance"].defaults.baseURL).toBe(
      expectedBaseURL
    );
  });

  it("should perform a successful GET request", async () => {
    const mockResponseData = { data: "testData" };
    const url = "/test";

    mockAxios.onGet(url).reply(200, mockResponseData);

    const response = await clientInstance.get<typeof mockResponseData>(url);
    expect(response).toEqual(mockResponseData);
  });

  it("should handle GET request errors", async () => {
    const url = "/error";
    mockAxios.onGet(url).reply(500);

    await expect(clientInstance.get(url)).rejects.toThrow();
  });

  it("should perform a successful POST request", async () => {
    const url = "/post";
    const mockRequestData = { name: "test" };
    const mockResponseData = { id: 1, name: "test" };

    mockAxios.onPost(url, mockRequestData).reply(200, mockResponseData);

    const response = await clientInstance.post<typeof mockResponseData>(
      url,
      mockRequestData
    );
    expect(response).toEqual(mockResponseData);
  });

  it("should handle POST request errors", async () => {
    const url = "/error";
    const mockRequestData = { name: "test" };

    mockAxios.onPost(url).reply(500);

    await expect(clientInstance.post(url, mockRequestData)).rejects.toThrow();
  });

  it("should retry requests on failure (axios-retry)", async () => {
    const url = "/retry";
    const mockResponseData = { data: "success" };

    // Simulate failures for the first two requests, success on the third
    mockAxios
      .onGet(url)
      .replyOnce(500)
      .onGet(url)
      .replyOnce(500)
      .onGet(url)
      .reply(200, mockResponseData);

    const response = await clientInstance.get<typeof mockResponseData>(url);
    expect(response).toEqual(mockResponseData);
  });
});
