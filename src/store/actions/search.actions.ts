// src/store/actions/search.actions.ts
import { createAction } from "typesafe-actions";

export const setSearchTerm = createAction(
  "@search/SET_SEARCH_TERM",
  (searchTerm: string) => searchTerm
)();

export const submitSearchQuery = createAction("@search/SUBMIT_SEARCH_QUERY")();
