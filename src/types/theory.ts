import { EpistemicStatus } from './construct';

export interface TheoryCouncilLens {
  lensId: string;
  name: string;
  historicalPeriod: string;
  coreConcepts: string[];
  supportedInputs: string[];
  prohibitedClaims: string[];
  epistemicStatus: EpistemicStatus;
  interpretationRules: string[];
  limitations: string;
  references: string[];
}

export interface TheoryCouncilInterpretation {
  lensId: string;
  lensName: string;
  epistemicStatus: EpistemicStatus;
  inputFacetIds: string[];
  interpretation_tr: string;
  counterExplanation_tr?: string;
  limitationsDisclaimer_tr: string;
}
