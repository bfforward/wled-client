import { Uint32 } from "./wled-constants";

/* -------------------------------------------------------------------------- */
/*                             WLEDStateNightlight                            */
/* -------------------------------------------------------------------------- */
export type WLEDStateNightlight = {
  on  : boolean;                 // Nightlight currently active
  dur : IntRange<1, 255>;        // Duration of nightlight in minutes
  // fade: boolean;                 // If true, the light will gradually dim over the course of the nightlight duration. If false, it will instantly turn to the target brightness once the duration has elapsed. REMOVED in 0.13.0 (use mode instead)
  mode: IntRange<0, 3>;          // Nightlight mode (0: instant, 1: fade, 2: color fade, 3: sunrise) (available since 0.10.2)
  tbri: IntRange<0, 255>;        // Target brightness of nightlight feature
  rem : IntRange<-1, 15300>;     // Remaining nightlight duration in seconds, -1 if not active. Only in state response, can not be set.
};

/* -------------------------------------------------------------------------- */
/*                                WLEDStateUdp                                */
/* -------------------------------------------------------------------------- */
export type WLEDStateUdp = {
  send: boolean;            // Send WLED broadcast (UDP sync) packet on state change
  recv: boolean;            // Receive broadcast packets
  sgrp: IntRange<0, 255>;   // Bitfield for broadcast send groups 1-8
  rgrp: IntRange<0, 255>;   // Bitfield for broadcast receive groups 1-8
  nn  : boolean;            // Don't send a broadcast packet (applies to just the current API call). Not included in state response.
};

/* -------------------------------------------------------------------------- */
/*                                  WLEDState                                 */
/* -------------------------------------------------------------------------- */
export type WLEDState = {
  on        : boolean;                     // On/Off state of the light. You can also use "t" instead of true or false to toggle.
  bri       : IntRange<0, 255>;            // Brightness of the light. If on is false, contains last brightness when light was on (aka brightness when on is set to true). Setting bri to 0 is supported but it is recommended to use the range 1-255 and use on: false to turn off. The state response will never have the value 0 for bri.
  transition: IntRange<0, 65535>;          // Duration of the crossfade between different colors/brightness levels. One unit is 100ms, so a value of 4 results in atransition of 400ms.
  tt        : IntRange<0, 65535>;          // Similar to transition, but applies to just the current API call. Not included in state response.
  ps        : IntRange<-1, 250>;           // ID of currently set preset. 1~17~ can be used to iterate through presets 1-17, or 4~10~r to select random preset between presets 4 and 10 (inclusive).
  // pss       : IntRange<0, 65535>           // Bitwise indication of preset slots (0 - vacant, 1 - written). Always 0 in 0.11. Not changable. REMOVED as of v0.11.1
  psave     : IntRange<1, 250>;            // (16 prior to 0.11)	Save current light config (state) to specified preset slot. Not included in state response.
  pl        : IntRange<-1, 250>;           // ID of currently set playlist. (read-olny)
  pdel      : IntRange<1, 250>;            // Preset ID to delete. Not included in state response.
  nl        : WLEDStateNightlight;
  udpn      : WLEDStateUdp;
  v         : boolean;                     // If set to true in a JSON POST command, the response will contain the full JSON state object. Not included in state response
  rb        : boolean;                     // If set to true, device will reboot immediately. Not included in state response.
  live      : boolean;                     // If set to true, enters realtime mode and blanks the LEDs. The realtime timeout option does not have an effect when this command is used, WLED will stay in realtime mode until the state (color/effect/segments, excluding brightness) is changed. It is expected that {"live":false} is sent once live data sending is terminated. Not included in state response.
  lor       : 0 | 1 | 2;                   // Live data override. 0 is off, 1 is override until live data ends, 2 is override until ESP reboot (available since 0.10.0)
  time      : Uint32;                      // Set module time to unix timestamp. Not included in state response.
  mainseg   : number;                      // Main Segment
  seg       : object | object[];           // Segments are individual parts of the LED strip. Since 0.9.0 this enables running different effects on differentparts of the strip.
  playlist  : object;                      // Custom preset playlists. Not included in state response. (available since 0.11.0)
  tb        : Uint32;                      // Sets timebase for effects. Not reported.
  ledmap    : IntRange<0, 9>;              // Load specified ledmap (0 for ledmap.json, 1-9 for ledmap1.json to ledmap9.json). See mapping. Not included in state response. (available since 0.14.0)
  rmcpal    : boolean;                     // Remove last custom palette if set to true. Not included in state response. (available since 0.14.0)
  np        : boolean;                     // Advance to the next preset in a playlist if set to true. Not included in state response. (available since 0.15)
};

/* -------------------------------------------------------------------------- */
/*                              WLEDUdatableState                             */
/* -------------------------------------------------------------------------- */
export type WLEDUpdatableState = PartialDeep<WLEDState>;
export type WLEDMockState = PartialDeep<WLEDState>;