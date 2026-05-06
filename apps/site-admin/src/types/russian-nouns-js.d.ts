declare module "russian-nouns-js" {
  export const Gender: {
    MASCULINE: unknown;
    FEMININE: unknown;
    NEUTER: unknown;
    COMMON: unknown;
  };
  export const Case: {
    NOMINATIVE: unknown;
    GENITIVE: unknown;
    DATIVE: unknown;
    ACCUSATIVE: unknown;
    INSTRUMENTAL: unknown;
    PREPOSITIONAL: unknown;
    LOCATIVE: unknown;
  };
  export class Lemma {
    static create(input: { text: string; gender: unknown; indeclinable?: boolean }): Lemma;
  }
  export class Engine {
    decline(lemma: Lemma, caseValue: unknown): string[];
  }
  const RN: {
    Gender: typeof Gender;
    Case: typeof Case;
    Lemma: typeof Lemma;
    Engine: typeof Engine;
  };
  export default RN;
}
