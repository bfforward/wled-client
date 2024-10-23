import { WLEDEffects } from "./wled-effects";
import { WLEDInfo } from "./wled-info";
import { WLEDPalettes } from "./wled-palettes";
import { WLEDState } from "./wled-state";

/* -------------------------------------------------------------------------- */
/*                                 WLEDJSONAll                                */
/* -------------------------------------------------------------------------- */
export type WLEDJSONAll = {
  info: WLEDInfo;
  state: WLEDState;
  effects: WLEDEffects;
  palettes: WLEDPalettes;
}

/* -------------------------------------------------------------------------- */
/*                               WLEDMockJSONAll                              */
/* -------------------------------------------------------------------------- */

export type WLEDMockJSONAll = PartialDeep<WLEDJsonAll>;