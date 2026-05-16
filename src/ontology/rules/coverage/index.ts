import { COV_01 } from "./COV-01";
import { COV_02 } from "./COV-02";
import { COV_EXCL_031 } from "./COV-EXCL-031";
import { COV_SUB_LIMIT_042 } from "./COV-SUB-LIMIT-042";
import { COV_DED_001 } from "./COV-DED-001";
import { COV_CYB_RANSOM_001 } from "./COV-CYB-RANSOM-001";
import { COV_CYB_OFAC_001 } from "./COV-CYB-OFAC-001";
import { CLM_SUB_CARRIER_001 } from "./CLM-SUB-CARRIER-001";
import { COV_FRAUD } from "./COV-FRAUD";
import { COV_NOTICE } from "./COV-NOTICE";

export const COVERAGE_RULES = [
  COV_01,
  COV_02,
  COV_NOTICE,
  COV_FRAUD,
  COV_EXCL_031,
  COV_SUB_LIMIT_042,
  COV_DED_001,
  COV_CYB_RANSOM_001,
  COV_CYB_OFAC_001,
  CLM_SUB_CARRIER_001,
];

export {
  COV_01,
  COV_02,
  COV_NOTICE,
  COV_FRAUD,
  COV_EXCL_031,
  COV_SUB_LIMIT_042,
  COV_DED_001,
  COV_CYB_RANSOM_001,
  COV_CYB_OFAC_001,
  CLM_SUB_CARRIER_001,
};

export * from "./types";
