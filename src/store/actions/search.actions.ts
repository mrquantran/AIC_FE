// src/store/actions/search.actions.ts
import { createAction } from "typesafe-actions";
import { TModelSearch } from "@/types/apis/search";

export const setSearchTerm = createAction(
  "@search/SET_SEARCH_TERM",
  (model: TModelSearch, value: string, tabKey: number) => ({
    model,
    value,
    tabKey,
  })
)();

export const submitSearchQuery = createAction("@search/SUBMIT_SEARCH_QUERY")();
