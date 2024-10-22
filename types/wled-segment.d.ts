import { Color } from "./wled-constants";

/* -------------------------------------------------------------------------- */
/*                            WLEDSegmentLedControl                           */
/* -------------------------------------------------------------------------- */
export type WLEDSegmentLedControl = (Color | number)[];

/* -------------------------------------------------------------------------- */
/*                                 WLEDSegment                                */
/* -------------------------------------------------------------------------- */
export type WLEDSegment = {
  id    : number;                                             // 0 to info.maxseg -1	Zero-indexed ID of the segment. May be omitted, in that case the ID will be inferred from the order of the segment objects in the seg array.
  start : number;                                             // 0 to info.leds.count -1	LED the segment starts at. For 2D set-up it determines column where segment starts, from top-left corner of the matrix.
  stop  : number;                                             // 0 to info.leds.count	LED the segment stops at, not included in range. If stop is set to a lower or equal value than start (setting to 0 is recommended), the segment is invalidated and deleted. For 2D set-up it determines column where segment stops, from top-left corner of the matrix.
  startY: number;                                             // 0 to matrix width	Start row from top-left corner of a matrix. (available since 0.14.0)
  stopY : number;                                             // 1 to matrix height 	Stop row from top-left corner of matrix. (available since 0.14.0)
  len   : number;                                             // 0 to info.leds.count	Length of the segment (stop - start). stop has preference, so if it is included, len is ignored.
  grp   : IntRange<0, 255>;                                   // Grouping (how many consecutive LEDs of the same segment will be grouped to the same color)
  spc   : IntRange<0, 255>;                                   // Spacing (how many LEDs are turned off and skipped between each group)
  of    : number;                                             // -len+1 to len	Offset (how many LEDs to rotate the virtual start of the segments, available since 0.13.0)
  col   : [Color] | [Color, Color] | [Color, Color, Color];   // array of colors	Array that has up to 3 color arrays as elements, the primary, secondary (background) and tertiary colors of the segment. Each color is an array of 3 or 4 bytes, which represents a RGB(W) color, i.e. [[255,170,0],[0,0,0],[64,64,64]]. It can also be represented as aan array of strings of hex values, i.e. ["FFAA00","000000","404040"] for orange, black and grey.
  fx    : number;                                             // 0 to info.fxcount -1	ID of the effect or ~ to increment, ~- to decrement, or "r" for random.
  sx    : IntRange<0, 255>;                                   // Relative effect speed. ~ to increment, ~- to decrement. ~10 to increment by 10, ~-10 to decrement by 10.
  ix    : IntRange<0, 255>;                                   // Effect intensity. ~ to increment, ~- to decrement. ~10 to increment by 10, ~-10 to decrement by 10.
  c1    : IntRange<0, 255>;                                   // Effect custom slider 1. Custom sliders are hidden or displayed and labeled based on effect metadata.
  c2    : IntRange<0, 255>;                                   // Effect custom slider 2.
  c3    : IntRange<0, 31>;                                    // Effect custom slider 3.
  o1    : boolean;                                            // Effect option 1. Custom options are hidden or displayed and labeled based on effect metadata.
  o2    : boolean;                                            // Effect option 2.
  o3    : boolean;                                            // Effect option 3.
  pal   : number;                                             // 0 to info.palcount -1	ID of the color palette or ~ to increment, ~- to decrement, or r for random.
  sel   : boolean;                                            // true if the segment is selected. Selected segments will have their state (color/FX) updated by APIs that don't support segments (e.g. UDP sync, HTTP API). If no segment is selected, the first segment (id:0) will behave as if selected. WLED will report the state of the first (lowest id) segment that is selected to APIs (HTTP, MQTT, Blynk...), or mainseg in case no segment is selected and for the UDP API. Live data is always applied to all LEDs regardless of segment configuration.
  rev   : boolean;                                            // Flips the segment (in horizontal dimension for 2D set-up), causing animations to change direction.
  rY    : boolean;                                            // Flips the 2D segment in vertical dimension. (available since 0.14.0)
  on    : boolean;                                            // Turns on and off the individual segment. (available since 0.10.0)
  bri   : IntRange<0, 255>;                                   // Sets the individual segment brightness (available since 0.10.0)
  mi    : boolean;                                            // Mirrors the segment (in horizontal dimension for 2D set-up) (available since 0.10.2)
  mY    : boolean;                                            // Mirrors the 2D segment in vertical dimension. (available since 0.14.0)
  tp    : boolean;                                            // Transposes a segment (swaps X and Y dimensions). (available since 0.14.0)
  cct   : IntRange<0, 255>;                                   // or 1900 to 10091	White spectrum color temperature (available since 0.13.0)
  lx    : number;                                             // BBBGGGRRR: 0 - 100100100	Loxone RGB value for primary color. Each color (RRR,GGG,BBB) is specified in the range from 0 to 100%. Only available if Loxone is compiled in. -OR- 20bbbtttt: 200002700 - 201006500	Loxone brightness and color temperature values for primary color. Brightness bbb is specified in the range 0 to 100%. tttt defines the color temperature in the range from 2700 to 6500 Kelvin. (available since 0.11.0, not included in state response) Only available if Loxone is compiled in.
  ly    : number;                                             // BBBGGGRRR: 0 - 100100100	Loxone RGB value for secondary color. Each color (RRR,GGG,BBB) is specified in the range from 0 to 100%. Only available if Loxone is compiled in. -OR- 20bbbtttt: 200002700 - 201006500	Loxone brightness and color temperature values for secondary color. Brightness bbb is specified in the range 0 to 100%. tttt defines the color temperature in the range from 2700 to 6500 Kelvin. (available since 0.11.0, not included in state response) Only available if Loxone is compiled in.
  i     : WLEDSegmentLedControl;                              // array	Individual LED control. Not included in state response (available since 0.10.2)
  frz   : boolean;                                            // freezes/unfreezes the current effect
  m12   : IntRange<0, 4>;                                     // [map1D2D.count]	Setting of segment field 'Expand 1D FX'. (0: Pixels, 1: Bar, 2: Arc, 3: Corner)
  si    : IntRange<0, 3>;                                     // Setting of the sound simulation type for audio enhanced effects. (0: 'BeatSin', 1: 'WeWillRockYou', 2: '10_3', 3: '14_3') (as of 0.14.0-b1, there are these 4 types defined)
  fxdef : boolean;                                            // Forces loading of effect defaults (speed, intensity, etc) from effect metadata. (available since 0.14.0)
  set   : IntRange<0, 3>;                                     // Assigns group or set ID to segment (not to be confused with grouping). Visual aid only (helps in UI). (available since 0.14.0)
  rpt   : boolean;                                            // Flag to repeat current segment settings by creating segments until all available LEDs are included in automatically created segments or maximum segments reached. Will also toggle reverse on every even segment. (available since 0.13.0)
}