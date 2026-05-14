/**
 * Авто-генерация падежных форм для названий терминов глоссария.
 *
 * Гибрид: `russian-nouns-js` для существительных + ручная таблица окончаний
 * для прилагательных (на npm нет пакета склонения прилагательных).
 *
 * Логика для многословной фразы:
 *  1. Голова фразы — первый слева токен, не похожий на прилагательное.
 *     Склоняется russian-nouns-js по роду головы.
 *  2. Слова перед головой считаем прилагательными-определениями: склоняем в
 *     согласовании по той же таблице окончаний (твёрдая/мягкая основа).
 *  3. Слова после головы — это, как правило, родительный довесок
 *     («Адаптация бизнеса», «Карта пути клиента»). В русском такой довесок
 *     не меняется по падежам, поэтому держим их как есть.
 *  4. Для каждого падежа склеиваем формы и складываем в общий список.
 *
 * Покрытие: «Адаптивная вёрстка», «Адаптация бизнеса», «UX-дизайн»,
 * «Контент-маркетинг», «Карта пути клиента». Несклоняемые слова, латиница,
 * аббревиатуры остаются без изменений.
 */

import RN from "russian-nouns-js";

export type Gender = "masculine" | "feminine" | "neuter";

const RU_WORD_RE = /^[а-яёА-ЯЁ-]+$/u;

const CASES = ["NOMINATIVE", "GENITIVE", "DATIVE", "ACCUSATIVE", "INSTRUMENTAL", "PREPOSITIONAL"] as const;
type CaseKey = (typeof CASES)[number];

/** Окончания прилагательных по падежу (ед. ч.), три рода × твёрдая/мягкая основа.
 *  Таблица из академической грамматики; ключ — последняя буква основы. */
const ADJ_ENDINGS: Record<Gender, Record<"hard" | "soft", Record<CaseKey, string>>> = {
  masculine: {
    hard: {
      NOMINATIVE: "ый",
      GENITIVE: "ого",
      DATIVE: "ому",
      ACCUSATIVE: "ый", // неодушевл.; одушевл. = род.п. — упрощаем
      INSTRUMENTAL: "ым",
      PREPOSITIONAL: "ом",
    },
    soft: {
      NOMINATIVE: "ий",
      GENITIVE: "его",
      DATIVE: "ему",
      ACCUSATIVE: "ий",
      INSTRUMENTAL: "им",
      PREPOSITIONAL: "ем",
    },
  },
  feminine: {
    hard: {
      NOMINATIVE: "ая",
      GENITIVE: "ой",
      DATIVE: "ой",
      ACCUSATIVE: "ую",
      INSTRUMENTAL: "ой",
      PREPOSITIONAL: "ой",
    },
    soft: {
      NOMINATIVE: "яя",
      GENITIVE: "ей",
      DATIVE: "ей",
      ACCUSATIVE: "юю",
      INSTRUMENTAL: "ей",
      PREPOSITIONAL: "ей",
    },
  },
  neuter: {
    hard: {
      NOMINATIVE: "ое",
      GENITIVE: "ого",
      DATIVE: "ому",
      ACCUSATIVE: "ое",
      INSTRUMENTAL: "ым",
      PREPOSITIONAL: "ом",
    },
    soft: {
      NOMINATIVE: "ее",
      GENITIVE: "его",
      DATIVE: "ему",
      ACCUSATIVE: "ее",
      INSTRUMENTAL: "им",
      PREPOSITIONAL: "ем",
    },
  },
};

/** Окончания прилагательных во мн. ч. — для всех родов одинаковые, отличаются
 *  только твёрдой/мягкой основой. */
const ADJ_ENDINGS_PL: Record<"hard" | "soft", Record<CaseKey, string>> = {
  hard: {
    NOMINATIVE: "ые",
    GENITIVE: "ых",
    DATIVE: "ым",
    ACCUSATIVE: "ые",
    INSTRUMENTAL: "ыми",
    PREPOSITIONAL: "ых",
  },
  soft: {
    NOMINATIVE: "ие",
    GENITIVE: "их",
    DATIVE: "им",
    ACCUSATIVE: "ие",
    INSTRUMENTAL: "ими",
    PREPOSITIONAL: "их",
  },
};

const ADJ_NOM_SUFFIX_RE = /(ый|ий|ой|ая|яя|ое|ее)$/i;

/** Сильные именные суффиксы — слова с такими хвостами заведомо существительные,
 *  даже если последние две буквы совпали с прилагательным («Адаптация» → -ая,
 *  «Стратегия» → -ия, «Аналитика» → -ка). Перебиваем `ADJ_NOM_SUFFIX_RE`. */
const NOUN_SUFFIX_RE =
  /(ция|сия|зия|гия|ика|ия|ость|есть|ение|ание|ствие|ство|изм|тор|лог|ист|ник|тель|ник|чка|шка|щина|ость)$/i;

/** Угадывает род существительного по окончанию его именительного падежа.
 *  Эвристика — пользователь может переопределить вручную. */
export function guessGender(noun: string): Gender {
  const w = noun.trim().toLowerCase();
  if (!w) return "masculine";
  // Нашли -а/-я (не -ия/-мя — отдельно): женский. Простая эвристика.
  if (/[ая]$/.test(w)) {
    if (/мя$/.test(w)) return "neuter"; // время, имя, племя
    return "feminine";
  }
  if (/[ое]$/.test(w)) return "neuter";
  if (/ь$/.test(w)) return "feminine"; // упрощение — может быть masculine (день, конь)
  return "masculine";
}

function isAdjective(word: string): boolean {
  return ADJ_NOM_SUFFIX_RE.test(word) && !NOUN_SUFFIX_RE.test(word);
}

/** Токен, который мы умеем склонять как существительное: чистая кириллица
 *  («тест», «бизнес-модель») либо латинско-цифровая приставка через дефис +
 *  кириллический хвост («UX-дизайн»). Прочее («A/B», «SaaS», «v2») — пропуск. */
function isDeclinable(word: string): boolean {
  return RU_WORD_RE.test(word) || splitLatinHyphenPrefix(word) !== null;
}

/** Находит индекс головы фразы — первого слева склоняемого токена, не похожего
 *  на прилагательное. Несклоняемые токены пропускаются: для «A/B тест» голова —
 *  «тест», для «Адаптация бизнеса» — «Адаптация». */
function findHeadIndex(tokens: string[]): number {
  for (let i = 0; i < tokens.length; i++) {
    if (!isDeclinable(tokens[i])) continue;
    if (!isAdjective(tokens[i])) return i;
  }
  // Все либо прилагательные, либо несклоняемые — берём последний склоняемый.
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (isDeclinable(tokens[i])) return i;
  }
  return tokens.length - 1;
}

/** Род по умолчанию для всей фразы — определяется по голове, не по последнему
 *  слову. Для «A/B тест» это «тест», для «Адаптация бизнеса» — «Адаптация». */
export function guessGenderForTitle(title: string): Gender {
  const tokens = (title || "").trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return "masculine";
  const head = tokens[findHeadIndex(tokens)];
  // Род берём по кириллическому хвосту (если есть префикс через дефис).
  const split = splitLatinHyphenPrefix(head);
  return guessGender(split ? split.tail : head);
}

/** Стем-основа прилагательного: режем 2-буквенное окончание им.п. */
function adjectiveStem(adj: string): { stem: string; type: "hard" | "soft" } {
  const lower = adj.toLowerCase();
  const m = lower.match(ADJ_NOM_SUFFIX_RE);
  if (!m) return { stem: adj, type: "hard" };
  const ending = m[1];
  const stem = adj.slice(0, -ending.length);
  // Мягкая основа — если окончание «ий/яя/ее/юю/яя» или последняя буква основы шипящая+«-ий»
  const soft = ["ий", "яя", "ее", "юю"].includes(ending);
  return { stem, type: soft ? "soft" : "hard" };
}

function declineAdjective(
  adj: string,
  gender: Gender,
  caseKey: CaseKey,
  number: "singular" | "plural" = "singular",
): string {
  const { stem, type } = adjectiveStem(adj);
  const ending =
    number === "plural"
      ? ADJ_ENDINGS_PL[type][caseKey]
      : ADJ_ENDINGS[gender][type][caseKey];
  // Сохраняем регистр первой буквы оригинала.
  const out = stem + ending;
  if (adj[0] === adj[0]?.toUpperCase()) {
    return out.charAt(0).toUpperCase() + out.slice(1);
  }
  return out;
}

const NOUNS_ENGINE = new RN.Engine();
const RN_GENDER: Record<Gender, unknown> = {
  masculine: RN.Gender.MASCULINE,
  feminine: RN.Gender.FEMININE,
  neuter: RN.Gender.NEUTER,
};
const RN_CASE: Record<CaseKey, unknown> = {
  NOMINATIVE: RN.Case.NOMINATIVE,
  GENITIVE: RN.Case.GENITIVE,
  DATIVE: RN.Case.DATIVE,
  ACCUSATIVE: RN.Case.ACCUSATIVE,
  INSTRUMENTAL: RN.Case.INSTRUMENTAL,
  PREPOSITIONAL: RN.Case.PREPOSITIONAL,
};

function declineNoun(
  noun: string,
  gender: Gender,
  caseKey: CaseKey,
  pluralNom?: string,
): string[] {
  try {
    const lemma = RN.Lemma.create({ text: noun, gender: RN_GENDER[gender] });
    const out = pluralNom
      ? NOUNS_ENGINE.decline(lemma, RN_CASE[caseKey], pluralNom)
      : NOUNS_ENGINE.decline(lemma, RN_CASE[caseKey]);
    if (Array.isArray(out) && out.length > 0) return out;
  } catch {
    // Несклоняемое или неизвестное — оставляем как есть.
  }
  return [noun];
}

function pluralizeNoun(noun: string, gender: Gender): string | null {
  try {
    const lemma = RN.Lemma.create({ text: noun, gender: RN_GENDER[gender] });
    const out = NOUNS_ENGINE.pluralize(lemma);
    if (Array.isArray(out) && out.length > 0) return out[0];
  } catch {
    // Несклоняемое — нет мн. ч.
  }
  return null;
}

/** Слова вида «UX-дизайн», «AI-агент», «SaaS-платформа»: латинская/цифровая
 *  приставка через дефис + кириллический хвост. Склоняем только хвост. */
const LATIN_HYPHEN_PREFIX_RE = /^([A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)-([а-яёА-ЯЁ]+)$/u;

function splitLatinHyphenPrefix(word: string): { prefix: string; tail: string } | null {
  const m = word.match(LATIN_HYPHEN_PREFIX_RE);
  if (!m) return null;
  return { prefix: `${m[1]}-`, tail: m[2] };
}

/** Склонение головы: чистая кириллица → russian-nouns-js напрямую; «UX-дизайн»
 *  → склоняем кириллический хвост и возвращаем приставку обратно. */
function declineHead(
  head: string,
  gender: Gender,
  caseKey: CaseKey,
  pluralNom?: string,
): string[] {
  if (RU_WORD_RE.test(head)) return declineNoun(head, gender, caseKey, pluralNom);
  const split = splitLatinHyphenPrefix(head);
  if (split)
    return declineNoun(split.tail, gender, caseKey, pluralNom).map(
      (f) => split.prefix + f,
    );
  return [head];
}

/** Им.п. мн. ч. для головы (для последующего склонения во мн.ч.).
 *  Возвращает строку именно в той форме, какая будет в фразе (с префиксом). */
function pluralizeHead(head: string, gender: Gender): string | null {
  if (RU_WORD_RE.test(head)) return pluralizeNoun(head, gender);
  const split = splitLatinHyphenPrefix(head);
  if (split) {
    const pl = pluralizeNoun(split.tail, gender);
    return pl ? pl : null;
  }
  return null;
}

/**
 * Генерирует все падежные формы термина (без именительного — он уже title).
 * Возвращает уникальный список форм без дубликата исходного title.
 */
export function generateAutoAliases(
  title: string,
  gender: Gender,
): string[] {
  const trimmed = title.trim();
  if (!trimmed) return [];
  const tokens = trimmed.split(/\s+/);
  if (tokens.length === 0) return [];

  // Если в фразе нет ни одного склоняемого токена — не склоняем.
  if (!tokens.some((t) => isDeclinable(t))) return [];

  const headIdx = findHeadIndex(tokens);
  const head = tokens[headIdx];
  const adjs = tokens.slice(0, headIdx); // определения слева — согласуются
  const tail = tokens.slice(headIdx + 1); // родительный довесок — не склоняется

  const pluralNom = pluralizeHead(head, gender);

  const variants = new Set<string>();
  const numbers: Array<"singular" | "plural"> = pluralNom
    ? ["singular", "plural"]
    : ["singular"];

  for (const number of numbers) {
    for (const c of CASES) {
      // Им.п. ед.ч. = title, пропускаем. Им.п. мн.ч. («тесты», «адаптации») —
      // полезный алиас, оставляем.
      if (number === "singular" && c === "NOMINATIVE") continue;
      const headForms = declineHead(
        head,
        gender,
        c,
        number === "plural" ? (pluralNom ?? undefined) : undefined,
      );
      for (const hf of headForms) {
        const adjForms = adjs.map((a) =>
          isAdjective(a) ? declineAdjective(a, gender, c, number) : a,
        );
        const phrase = [...adjForms, hf, ...tail].join(" ");
        if (phrase && phrase !== trimmed) variants.add(phrase);
      }
    }
  }
  return Array.from(variants);
}
