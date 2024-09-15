import { createAction } from "typesafe-actions";
import { TAppState } from "../reducers/app.reducers";
import { THistory, TQuestion } from "@/types";

export const setAppError = createAction(
  "@api/SET_APP_FAILURE",
  (error: string) => error
)();

export const setAppSettings = createAction(
  "@api/SET_ONE_FIELD_APP_SETTINGS",
  (
    field: keyof TAppState["settings"],
    value: TAppState["settings"][keyof TAppState["settings"]]
  ) => ({ field, value })
)();

export const setTemporalSearchEnabled = createAction(
  "@api/SET_TEMPORAL_SEARCH_ENABLED",
  (enabled: boolean) => enabled
)();

export const setObjectNames = createAction(
  "@api/SET_OBJECT_NAMES",
  (objectNames: string[]) => objectNames
)();

export const setModeTab = createAction(
  "@api/SET_MODE_TAB",
  (modeTab: TAppState["modeTab"]) => modeTab
)();

export const addHistory = createAction(
  "@api/ADD_HISTORY",
  (history: THistory, selectedQuestion: TQuestion) => ({ history, selectedQuestion })
)();

export const clearHistory = createAction("@api/CLEAR_HISTORY")();

export const clearOneHistory = createAction(
  "@api/CLEAR_ONE_HISTORY",
  (index: number) => index
)();

export const setQuestions = createAction(
  "@api/SET_QUESTIONS",
  (questions: TQuestion[]) => questions
)();

export const setSelectedQuestion = createAction(
  "@api/SET_SELECTED_QUESTION",
  (question: TQuestion) => question
)();

export const clearSearchHistory = createAction("@v/CLEAR_SEARCH_HISTORY")();