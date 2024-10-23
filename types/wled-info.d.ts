import { Uint16, Uint32 } from "./wled-constants";

/* -------------------------------------------------------------------------- */
/*                                WLEDInfoLeds                                */
/* -------------------------------------------------------------------------- */
export type WLEDInfoLeds = {
  cct   : boolean;                // true if the light supports color temperature control (available since 0.13.0, deprecated, use info.leds.lc)
  count : IntRange<1, 1200>;      // 1 to 1200	Total LED count.
  fps   : IntRange<0, 255>;       // 0 to 255	Current frames per second. (available since 0.12.0)
  rgbw  : boolean;                // true if LEDs are 4-channel (RGB + White). (deprecated, use info.leds.lc)
  wv    : boolean;                // true if a white channel slider should be displayed. (available since 0.10.0, deprecated, use info.leds.lc)
  // pin   : number                  // LED strip pin(s). Always one element. REMOVED as of v0.13
  pwr   : IntRange<0, 65000>;     // Current LED power usage in milliamps as determined by the ABL. 0 if ABL is disabled.
  maxpwr: IntRange<0, 65000>;     // Maximum power budget in milliamps for the ABL. 0 if ABL is disabled.
  maxseg: number;                 // Maximum number of segments supported by this version.
  lc    : number;                 // Logical AND of all active segment's virtual light capabilities
  seglc : number;                 // Per-segment virtual light capabilities
};

/* -------------------------------------------------------------------------- */
/*                                WLEDInfoWifi                                */
/* -------------------------------------------------------------------------- */
export type WLEDInfoWifi = {
  bssid  : string;            // The BSSID of the currently connected network.
  signal : IntRange<0, 100>;  // Relative signal quality of the current connection.
  channel: IntRange<0, 14>;   // The current WiFi channel.
};

/* -------------------------------------------------------------------------- */
/*                                 WLEDInfoFs                                 */
/* -------------------------------------------------------------------------- */
export type WLEDInfoFs = {
  u  : Uint32;   // Estimate of used filesystem space in kilobytes
  t  : Uint32;   // Total filesystem size in kilobytes
  pmt: Uint32;   // Unix timestamp for the last modification to the presets.json file. Not accurate after boot or after using /edit
};

/* -------------------------------------------------------------------------- */
/*                                  WLEDInfo                                  */
/* -------------------------------------------------------------------------- */
export type WLEDInfo = {
  ver     : string;             // Version name.
  vid     : Uint32;             // Build ID (YYMMDDB, B = daily build index).
  leds    : WLEDInfoLeds;
  str     : boolean;            // If true, an UI with only a single button for toggling sync should toggle receive+send, otherwise send only
  name    : string;             // Friendly name of the light. Intended for display in lists and titles.
  udpport : Uint16;             // The UDP port for realtime packets and WLED broadcast.
  live    : boolean;            // If true, the software is currently receiving realtime data via UDP or E1.31.
  lm      : string;             // Info about the realtime data source
  lip     : string;             // Realtime data source IP address
  ws      : IntRange<-1, 8>;    // Number of currently connected WebSockets clients. -1 indicates that WS is unsupported in this build.
  fxcount : number;             // Number of effects included.
  palcount: Uint16;             // Number of palettes configured.
  wifi    : WLEDInfoWifi;
  fs      : WLEDInfoFs;
  ndc     : IntRange<-1, 255>;  // Number of other WLED devices discovered on the network. -1 if Node discovery disabled. (since 0.12.0)
  arch    : string;             // Name of the platform.
  core    : string;             // Version of the underlying (Arduino core) SDK.
  lwip    : 0 | 1 | 1;          //  Version of LwIP. 1 or 2 on ESP8266, 0 (does not apply) on ESP32. Deprecated, removal in 0.14.0
  freeheap: Uint32;             // Bytes of heap memory (RAM) currently available. Problematic if <10k.
  uptime  : Uint32;             // Time since the last boot/reset in seconds.
  opt     : Uint16;             // Used for debugging purposes only.
  brand   : string;             // The producer/vendor of the light. Always WLED for standard installations.
  product : string;             // The product name. Always FOSS for standard installations.
  // btype   : string              // The origin of the build. src if a release version is compiled from source, bin for an official release image, dev for a development build (regardless of src/bin origin) and exp for experimental versions. ogn if the image is flashed to hardware by the vendor. REMOVED as of v0.10
  mac     : string;             // The hexadecimal hardware MAC address of the light, lowercase and without colons.
  ip      : string;             // The IP address of this instance. Empty string if not connected. (since 0.13.0)
};

/* -------------------------------------------------------------------------- */
/*                                WLEDMockInfo                                */
/* -------------------------------------------------------------------------- */
export type WLEDMockInfo = PartialDeep<WLEDInfo>;
