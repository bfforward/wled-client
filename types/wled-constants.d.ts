export type RGBColor = [number, number, number]
export type HexColor = [string, string, string];
export type RGBWColor = [number, number, number, number];
export type Color = RGBColor | RGBWColor | HexColor;
export type Uint16 = IntRange<0, 65535>;
export type Uint32 = number;
