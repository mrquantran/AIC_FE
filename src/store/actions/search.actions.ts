// src/store/actions/search.actions.ts
import { createAction } from "typesafe-actions";
import { TModelSearch } from "@/types/apis/search";
import { TQuestion } from "@/types";

export const setSearchTerm = createAction(
  "@search/SET_SEARCH_TERM",
  (model: TModelSearch, value: string | string[], tabKey: number) => ({
    model,
    value,
    tabKey,
  })
)();

export const submitSearchQuery = createAction("@search/SUBMIT_SEARCH_QUERY")();

export const clearSearchQuery = createAction("@search/CLEAR_SEARCH_QUERY")();

export const trySearchQuery = createAction(
  "@search/TRY_SEARCH_QUERY",
  (content: string) => content
)();

export const setTemporalSearchResult = createAction(
  "@search/SET_TEMPORAL_SEARCH_RESULT",
  (result: any) => result
)();

export const setSearchResult = createAction(
  "@search/SET_SEARCH_RESULT",
  (result: any) => result
)();

export const setRemoveQuery = createAction(
  "@search/SET_REMOVE_QUERY",
  (index: number) => index
)();

export const setRemoveQueryValue = createAction(
  "@search/SET_REMOVE_QUERY_VALUE",
  (tabKey: number) => tabKey
)();

export const setAddObjectQuery = createAction(
  "@search/SET_ADD_OBJECT_QUERY",
  (tabKey: number) => tabKey
)();

export const setSelectedTemporalQuery = createAction(
  "@search/SET_SELECTED_TEMPORAL_QUERY",
  (value: string) => value
)();

export const setEnabledTabs = createAction(
  "@search/SET_ENABLED_TABS",
  (tabs: number[]) => tabs
)();

export const setDisabledTabs = createAction(
  "@search/SET_DISABLED_TABS",
  (tabs: number[]) => tabs
)();

export const setClearTemporalSearch = createAction(
  "@search/SET_CLEAR_TEMPORAL_SEARCH"
)();

export const setFilterIndexes = createAction(
  "@search/SET_FILTER_INDEXES",
  (indexes: number[]) => indexes
)();

export const clearFilterIndexes = createAction("@search/CLEAR_FILTER_INDEXES")();