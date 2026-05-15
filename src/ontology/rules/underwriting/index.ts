import { MH_ACC_01 } from "./MH-ACC-01";
import { MH_ACC_02 } from "./MH-ACC-02";
import { MH_ACC_03 } from "./MH-ACC-03";
import { MH_ACC_04 } from "./MH-ACC-04";
import { MH_RAD_01 } from "./MH-RAD-01";
import { MH_RAD_02 } from "./MH-RAD-02";
import { MH_REN_01 } from "./MH-REN-01";
import { MH_REN_02 } from "./MH-REN-02";
import { MH_REN_03 } from "./MH-REN-03";

export const UNDERWRITING_ACCUMULATION_RULES = [
  MH_ACC_01,
  MH_ACC_02,
  MH_ACC_03,
  MH_ACC_04,
];

export const UNDERWRITING_RATE_ADEQUACY_RULES = [MH_RAD_01, MH_RAD_02];

export const UNDERWRITING_RENEWAL_RULES = [MH_REN_01, MH_REN_02, MH_REN_03];

export const UNDERWRITING_RULES = [
  ...UNDERWRITING_ACCUMULATION_RULES,
  ...UNDERWRITING_RATE_ADEQUACY_RULES,
  ...UNDERWRITING_RENEWAL_RULES,
];

export {
  MH_ACC_01,
  MH_ACC_02,
  MH_ACC_03,
  MH_ACC_04,
  MH_RAD_01,
  MH_RAD_02,
  MH_REN_01,
  MH_REN_02,
  MH_REN_03,
};

export type { UnderwritingFacts, UnderwritingContext } from "./types";
