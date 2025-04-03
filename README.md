# @bfforward/wled-client

[![npm version](https://badge.fury.io/js/%40bfforward%2Fwled-client.svg)](https://badge.fury.io/js/%40bfforward%2Fwled-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript client for interacting with WLED devices via their JSON API.

## Installation

```bash
npm install @bfforward/wled-client
# or
yarn add @bfforward/wled-client
```

## Usage

```typescript
import WLEDClient from "@bfforward/wled-client";

// Initialize the client
const wled = new WLEDClient({
  baseUrl: "YOUR_WLED_IP_OR_HOSTNAME", // e.g., '192.168.1.100'
  // port: 80, // Optional, defaults to 80
  // ssl: false, // Optional, defaults to false
});

async function main() {
  try {
    // Connect and fetch initial data
    await wled.connect();
    console.log("Connected to WLED:", wled.info?.name);
    console.log("Current state:", wled.state);

    // Listen for changes
    wled.on("statusChange", () => {
      console.log("Client status changed:", wled.status);
    });

    wled.on("stateChange", () => {
      console.log("WLED state changed:", wled.state);
    });

    wled.on("infoChange", () => {
      console.log("WLED info changed:", wled.info);
    });

    // Example: Turn the light on
    await wled.setState({ on: true, bri: 128 });
    console.log("Light turned on");

    // Example: Get effects list
    const effects = wled.effects; // Already fetched on connect/getAll
    // Or fetch manually: await wled.getEffects();
    console.log("Available effects:", effects);

    // Disconnect when done (optional, client doesn't maintain a persistent connection)
    await wled.disconnect();
    console.log("Client disconnected");
  } catch (error) {
    console.error("Error interacting with WLED:", error);
  }
}

main();
```

## API

The `WLEDClient` class provides methods to interact with the WLED JSON API.

**Connection:**

- `connect()`: Establishes connection and fetches all initial data (`info`, `state`, `effects`, `palettes`). Emits `statusChange`.
- `disconnect()`: Sets the client status to `disconnected`. Emits `statusChange`.
- `status`: Getter property for the current client status (`disconnected`, `connected`, `failed`).

**Data Fetching/Updating:**

- `getAll()`: Fetches all data (`info`, `state`, `effects`, `palettes`) and updates the respective properties. Emits `infoChange`, `stateChange`, `effectsChange`, `palettesChange`.
- `getInfo()`: Fetches device information. Updates `info`. Emits `infoChange`.
- `getState()`: Fetches the current device state. Updates `state`. Emits `stateChange`.
- `getEffects()`: Fetches the list of effects. Updates `effects`. Emits `effectsChange`.
- `getPalettes()`: Fetches the list of palettes. Updates `palettes`. Emits `palettesChange`.
- `setState(newState: WLEDUpdatableState)`: Sends commands to update the WLED state.
- `rename(newName: string)`: Renames the WLED device. Fetches updated info afterwards.

**Properties:**

- `info`: Stores the latest `WLEDInfo`.
- `state`: Stores the latest `WLEDState`.
- `effects`: Stores the list of `WLEDEffects`.
- `palettes`: Stores the list of `WLEDPalettes`.

**Events:**

The client is an `EventEmitter` and emits the following events:

- `statusChange`: When the client connection status changes.
- `infoChange`: When the `info` property is updated.
- `stateChange`: When the `state` property is updated.
- `effectsChange`: When the `effects` property is updated.
- `palettesChange`: When the `palettes` property is updated.

_(For detailed type information, please refer to the source code or generated documentation.)_

## Development

- **Build:** `npm run build` (Compiles TypeScript to JavaScript in `dist/`)
- **Test:** `npm run test`
- **Generate Docs:** `npm run docs` (Generates TypeDoc documentation in `docs/`)

## Contributing

Issues and pull requests are welcome. Please refer to the [GitHub repository](https://github.com/bfforward/wled-client).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (Note: LICENSE file needs to be created if one doesn't exist).
