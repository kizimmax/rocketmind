"use client";

import { useCallback, useReducer } from "react";
import type { GlossaryTerm } from "./types";

const MAX_HISTORY = 50;

interface EditorState {
  original: GlossaryTerm;
  past: GlossaryTerm[];
  present: GlossaryTerm;
  future: GlossaryTerm[];
}

type Action =
  | {
      type: "UPDATE";
      field: keyof GlossaryTerm;
      value: GlossaryTerm[keyof GlossaryTerm];
    }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SAVE"; term: GlossaryTerm }
  | { type: "DISCARD" };

function pushHistory(state: EditorState, next: GlossaryTerm): EditorState {
  return {
    ...state,
    past: [...state.past, state.present].slice(-MAX_HISTORY),
    present: next,
    future: [],
  };
}

function reducer(state: EditorState, action: Action): EditorState {
  switch (action.type) {
    case "UPDATE": {
      const next = { ...state.present, [action.field]: action.value };
      return pushHistory(state, next);
    }
    case "UNDO": {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return {
        ...state,
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      };
    }
    case "REDO": {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        ...state,
        past: [...state.past, state.present],
        present: next,
        future: state.future.slice(1),
      };
    }
    case "SAVE":
      return {
        original: action.term,
        past: [],
        present: action.term,
        future: [],
      };
    case "DISCARD":
      return {
        ...state,
        past: [],
        present: state.original,
        future: [],
      };
    default:
      return state;
  }
}

function init(term: GlossaryTerm): EditorState {
  return { original: term, past: [], present: term, future: [] };
}

export function useGlossaryTermEditor(term: GlossaryTerm) {
  const [state, dispatch] = useReducer(reducer, term, init);

  // Глубокое сравнение через JSON — секции/массивы тегов не идентичны по ссылке
  // после `update`, поэтому строгое `!==` всегда показывало бы dirty. JSON
  // сравнение совпадает с алгоритмом, который раньше был инлайн в редакторе.
  const isDirty = !shallowEqualTerm(state.original, state.present);
  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const update = useCallback(
    <K extends keyof GlossaryTerm>(field: K, value: GlossaryTerm[K]) =>
      dispatch({
        type: "UPDATE",
        field: field as keyof GlossaryTerm,
        value: value as GlossaryTerm[keyof GlossaryTerm],
      }),
    [],
  );

  const undo = useCallback(() => dispatch({ type: "UNDO" }), []);
  const redo = useCallback(() => dispatch({ type: "REDO" }), []);
  const markSaved = useCallback(
    (saved: GlossaryTerm) => dispatch({ type: "SAVE", term: saved }),
    [],
  );
  const discard = useCallback(() => dispatch({ type: "DISCARD" }), []);

  return {
    term: state.present,
    original: state.original,
    isDirty,
    canUndo,
    canRedo,
    update,
    undo,
    redo,
    markSaved,
    discard,
  };
}

function shallowEqualTerm(a: GlossaryTerm, b: GlossaryTerm): boolean {
  if (a === b) return true;
  if (
    a.title !== b.title ||
    a.description !== b.description ||
    a.slug !== b.slug ||
    a.status !== b.status ||
    a.metaTitle !== b.metaTitle ||
    a.metaDescription !== b.metaDescription
  ) {
    return false;
  }
  if (JSON.stringify(a.tagIds) !== JSON.stringify(b.tagIds)) return false;
  if (JSON.stringify(a.sections ?? []) !== JSON.stringify(b.sections ?? []))
    return false;
  return true;
}

// ── Changes description ─────────────────────────────────────────────────────

const FIELD_LABELS: Partial<Record<keyof GlossaryTerm, string>> = {
  title: "Название",
  description: "Описание",
  status: "Статус публикации",
  tagIds: "Теги",
  sections: "Тело термина",
  metaTitle: "SEO Title",
  metaDescription: "SEO Description",
};

function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((x, i) => isEqual(x, b[i]));
  }
  // Глубокое сравнение объектов/массивов через JSON — нужно для sections.
  if (typeof a === "object" && typeof b === "object" && a && b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return false;
}

export function getGlossaryTermChanges(
  original: GlossaryTerm,
  current: GlossaryTerm,
): string[] {
  const out: string[] = [];
  for (const key of Object.keys(FIELD_LABELS) as (keyof GlossaryTerm)[]) {
    if (!isEqual(original[key], current[key])) {
      const label = FIELD_LABELS[key];
      if (label) out.push(label);
    }
  }
  return out;
}
