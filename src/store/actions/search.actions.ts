// src/store/actions/search.actions.ts
import { createAction } from "typesafe-actions";
import { TModelSearch } from "@/types/apis/search";

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

export const trySearchQuery = createAction("@search/TRY_SEARCH_QUERY")();

export const setSearchResult = createAction(
  "@search/SET_SEARCH_RESULT",
  (result: any) => result
)();

export const setRemoveQuery = createAction(
  "@search/SET_REMOVE_QUERY",
  (index: number) => index
)();

export const setAddObjectQuery = createAction(
  "@search/SET_ADD_OBJECT_QUERY",
  (tabKey: number) => tabKey
)();
