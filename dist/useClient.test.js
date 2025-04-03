import { renderHook, act } from '@testing-library/react';
import { useClient } from './useClient';
import WLEDClient from './client'; // Use the actual class for mocking
// Mock the entire WLEDClient class
jest.mock('./client');
const MockWLEDClient = WLEDClient;
describe('useClient Hook', () => {
    const mockOptions = { baseUrl: 'mock-host' };
    let mockClientInstance;
    beforeEach(() => {
        // Reset mocks before each test
        MockWLEDClient.mockClear();
        // Create a mock instance with mocked methods
        mockClientInstance = {
            connect: jest.fn().mockResolvedValue(undefined),
            disconnect: jest.fn().mockResolvedValue(undefined),
            getAll: jest.fn().mockResolvedValue(undefined),
            getInfo: jest.fn().mockResolvedValue(undefined),
            getState: jest.fn().mockResolvedValue(undefined),
            setState: jest.fn().mockResolvedValue(undefined),
            getEffects: jest.fn().mockResolvedValue(undefined),
            getPalettes: jest.fn().mockResolvedValue(undefined),
            rename: jest.fn().mockResolvedValue(undefined),
            // Mock event emitter methods
            on: jest.fn(),
            off: jest.fn(),
            emit: jest.fn(),
            // Mock initial properties (getter mocks)
            get status() { return 'disconnected'; },
            get info() { return null; },
            get state() { return null; },
            get effects() { return null; },
            get palettes() { return null; },
        }; // Type assertion needed for complex mock
        // Make the constructor return our mock instance
        MockWLEDClient.mockImplementation(() => mockClientInstance);
    });
    it('should initialize the client and attempt connection', () => {
        renderHook(() => useClient(mockOptions));
        // Check if the constructor was called with options
        expect(MockWLEDClient).toHaveBeenCalledTimes(1);
        expect(MockWLEDClient).toHaveBeenCalledWith(mockOptions);
        // Check if connect was called on mount
        expect(mockClientInstance.connect).toHaveBeenCalledTimes(1);
    });
    it('should call disconnect on unmount', () => {
        const { unmount } = renderHook(() => useClient(mockOptions));
        unmount();
        // Check if disconnect was called
        expect(mockClientInstance.disconnect).toHaveBeenCalledTimes(1);
    });
    it('should update status when statusChange event is emitted', () => {
        let statusChangeCallback = null;
        // Capture the callback registered with 'on'
        mockClientInstance.on.mockImplementation((event, callback) => {
            if (event === 'statusChange') {
                statusChangeCallback = callback;
            }
            return mockClientInstance; // Return the instance for chaining if needed
        });
        // Mock the getter for status to change after the event
        Object.defineProperty(mockClientInstance, 'status', {
            get: jest.fn().mockReturnValueOnce('disconnected').mockReturnValue('connected')
        });
        const { result } = renderHook(() => useClient(mockOptions));
        // Initial status
        expect(result.current.status).toBe('disconnected');
        // Simulate the event emission by calling the captured callback
        act(() => {
            if (statusChangeCallback) {
                statusChangeCallback();
            }
        });
        // Check if status updated in the hook's return value
        expect(result.current.status).toBe('connected');
    });
    it('should update info when infoChange event is emitted', () => {
        let infoChangeCallback = null;
        const mockInfoData = { name: 'Test WLED', ver: '0.14.0' };
        mockClientInstance.on.mockImplementation((event, callback) => {
            if (event === 'infoChange') {
                infoChangeCallback = callback;
            }
            return mockClientInstance;
        });
        Object.defineProperty(mockClientInstance, 'info', {
            get: jest.fn().mockReturnValueOnce(null).mockReturnValue(mockInfoData)
        });
        const { result } = renderHook(() => useClient(mockOptions));
        expect(result.current.info).toBeNull();
        act(() => {
            if (infoChangeCallback)
                infoChangeCallback();
        });
        expect(result.current.info).toEqual(mockInfoData);
    });
    it('should update state when stateChange event is emitted', () => {
        let stateChangeCallback = null;
        const mockStateData = { on: true, bri: 100 };
        mockClientInstance.on.mockImplementation((event, callback) => {
            if (event === 'stateChange') {
                stateChangeCallback = callback;
            }
            return mockClientInstance;
        });
        Object.defineProperty(mockClientInstance, 'state', {
            get: jest.fn().mockReturnValueOnce(null).mockReturnValue(mockStateData)
        });
        const { result } = renderHook(() => useClient(mockOptions));
        expect(result.current.state).toBeNull();
        act(() => {
            if (stateChangeCallback)
                stateChangeCallback();
        });
        expect(result.current.state).toEqual(mockStateData);
    });
    it('should update effects when effectsChange event is emitted', () => {
        let effectsChangeCallback = null;
        const mockEffectsData = ['Solid', 'Blink'];
        mockClientInstance.on.mockImplementation((event, callback) => {
            if (event === 'effectsChange') {
                effectsChangeCallback = callback;
            }
            return mockClientInstance;
        });
        Object.defineProperty(mockClientInstance, 'effects', {
            get: jest.fn().mockReturnValueOnce(null).mockReturnValue(mockEffectsData)
        });
        const { result } = renderHook(() => useClient(mockOptions));
        expect(result.current.effects).toBeNull();
        act(() => {
            if (effectsChangeCallback)
                effectsChangeCallback();
        });
        expect(result.current.effects).toEqual(mockEffectsData);
    });
    it('should update palettes when palettesChange event is emitted', () => {
        let palettesChangeCallback = null;
        const mockPalettesData = ['Default', 'Rainbow'];
        mockClientInstance.on.mockImplementation((event, callback) => {
            if (event === 'palettesChange') {
                palettesChangeCallback = callback;
            }
            return mockClientInstance;
        });
        Object.defineProperty(mockClientInstance, 'palettes', {
            get: jest.fn().mockReturnValueOnce(null).mockReturnValue(mockPalettesData)
        });
        const { result } = renderHook(() => useClient(mockOptions));
        expect(result.current.palettes).toBeNull();
        act(() => {
            if (palettesChangeCallback)
                palettesChangeCallback();
        });
        expect(result.current.palettes).toEqual(mockPalettesData);
    });
    it('should remove event listeners on unmount', () => {
        const { unmount } = renderHook(() => useClient(mockOptions));
        // Expect 'on' to have been called 5 times (once for each event type)
        expect(mockClientInstance.on).toHaveBeenCalledTimes(5);
        unmount();
        // Expect 'off' to have been called 5 times with the correct args
        expect(mockClientInstance.off).toHaveBeenCalledTimes(5);
        expect(mockClientInstance.off).toHaveBeenCalledWith('statusChange', expect.any(Function));
        expect(mockClientInstance.off).toHaveBeenCalledWith('infoChange', expect.any(Function));
        expect(mockClientInstance.off).toHaveBeenCalledWith('stateChange', expect.any(Function));
        expect(mockClientInstance.off).toHaveBeenCalledWith('effectsChange', expect.any(Function));
        expect(mockClientInstance.off).toHaveBeenCalledWith('palettesChange', expect.any(Function));
    });
    it('should handle disconnect error during unmount', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        const disconnectError = new Error('Disconnect failed');
        mockClientInstance.disconnect.mockRejectedValue(disconnectError);
        const { unmount } = renderHook(() => useClient(mockOptions));
        act(() => {
            unmount();
        });
        expect(mockClientInstance.disconnect).toHaveBeenCalledTimes(1);
        // Need to wait for the promise rejection to be handled
        // Use Promise.resolve().then() trick or await next tick if using a specific library feature
        return Promise.resolve().then(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to disconnect:', disconnectError);
            consoleErrorSpy.mockRestore();
        });
    });
});
