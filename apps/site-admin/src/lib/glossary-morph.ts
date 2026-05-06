/**
 * Авто-генерация падежных форм для названий терминов глоссария.
 *
 * Гибрид: `russian-nouns-js` для существительных + ручная таблица окончаний
 * для прилагательных (на npm нет пакета склонения прилагательных).
 *
 * Логика для многословной фразы «<adj1> <adj2> <noun>»:
 *  1. Последнее слово — существительное. Склоняется russian-nouns-js по
 *     указанному роду (gender в `GlossaryTerm`).
 *  2. Все предыдущие слова считаем прилагательными в согласовании с
 *     существительным. Склоняем по той же таблице окончаний (твёрдая/мягкая
 *     основа определяется по последней букве основы).
 *  3. Для каждого падежа склеиваем формы и складываем в общий список.
 *
 * Покрытие: ~80-90% типичных техногологических терминов («Адаптивная вёрстка»,
 * «UX-дизайн», «Контент-маркетинг»). Несклоняемые слова, латиница, аббревиатуры
 * остаются без изменений.
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

const ADJ_NOM_SUFFIX_RE = /(ый|ий|ой|ая|яя|ое|ее)$/i;

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
  return ADJ_NOM_SUFFIX_RE.test(word);
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

function declineAdjective(adj: string, gender: Gender, caseKey: CaseKey): string {
  const { stem, type } = adjectiveStem(adj);
  const ending = ADJ_ENDINGS[gender][type][caseKey];
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

function declineNoun(noun: string, gender: Gender, caseKey: CaseKey): string[] {
  try {
    const lemma = RN.Lemma.create({ text: noun, gender: RN_GENDER[gender] });
    const out = NOUNS_ENGINE.decline(lemma, RN_CASE[caseKey]);
    if (Array.isArray(out) && out.length > 0) return out;
  } catch {
    // Несклоняемое или неизвестное — оставляем как есть.
  }
  return [noun];
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

  // Если фраза состоит из не-кириллицы (латинская аббревиатура и т.п.) — не склоняем.
  const allLatin = tokens.every((t) => !RU_WORD_RE.test(t));
  if (allLatin) return [];

  const lastIdx = tokens.length - 1;
  const noun = tokens[lastIdx];
  const adjs = tokens.slice(0, lastIdx);

  const variants = new Set<string>();
  for (const c of CASES) {
    if (c === "NOMINATIVE") continue; // совпадает с title
    const nounForms = RU_WORD_RE.test(noun) ? declineNoun(noun, gender, c) : [noun];
    for (const nf of nounForms) {
      const adjForms = adjs.map((a) =>
        isAdjective(a) ? declineAdjective(a, gender, c) : a,
      );
      const phrase = [...adjForms, nf].join(" ");
      if (phrase && phrase !== trimmed) variants.add(phrase);
    }
  }
  return Array.from(variants);
}
