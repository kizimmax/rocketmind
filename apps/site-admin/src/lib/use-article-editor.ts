"use client";

import { useCallback, useReducer } from "react";
import type { Article } from "./types";

const MAX_HISTORY = 50;

interface EditorState {
  original: Article;
  past: Article[];
  present: Article;
  future: Article[];
}

type Action =
  | { type: "UPDATE"; field: keyof Article; value: Article[keyof Article] }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SAVE"; article: Article }
  | { type: "DISCARD" };

function pushHistory(state: EditorState, next: Article): EditorState {
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
        original: action.article,
        past: [],
        present: action.article,
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

function init(article: Article): EditorState {
  return { original: article, past: [], present: article, future: [] };
}

export function useArticleEditor(article: Article) {
  const [state, dispatch] = useReducer(reducer, article, init);

  const isDirty = state.present !== state.original;
  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const update = useCallback(
    <K extends keyof Article>(field: K, value: Article[K]) =>
      dispatch({
        type: "UPDATE",
        field: field as keyof Article,
        value: value as Article[keyof Article],
      }),
    []
  );

  const undo = useCallback(() => dispatch({ type: "UNDO" }), []);
  const redo = useCallback(() => dispatch({ type: "REDO" }), []);
  const markSaved = useCallback(
    (saved: Article) => dispatch({ type: "SAVE", article: saved }),
    []
  );
  const discard = useCallback(() => dispatch({ type: "DISCARD" }), []);

  return {
    article: state.present,
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

// ── Changes description ─────────────────────────────────────────────────────

const FIELD_LABELS: Partial<Record<keyof Article, string>> = {
  title: "Заголовок",
  description: "Описание",
  slug: "Slug (URL)",
  status: "Статус публикации",
  publishedAt: "Дата публикации",
  coverImageData: "Обложка",
  expertSlug: "Автор",
  tagIds: "Теги",
  keyThoughts: "Ключевые мысли",
  body: "Тело статьи",
  metaTitle: "Meta Title",
  metaDescription: "Meta Description",
};

function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((x, i) => isEqual(x, b[i]));
  }
  return false;
}

export function getArticleChanges(original: Article, current: Article): string[] {
  const out: string[] = [];
  for (const key of Object.keys(FIELD_LABELS) as (keyof Article)[]) {
    if (!isEqual(original[key], current[key])) {
      const label = FIELD_LABELS[key];
      if (label) out.push(label);
    }
  }
  return out;
}
