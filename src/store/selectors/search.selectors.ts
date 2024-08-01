// src/store/selectors/search.selectors.ts
import { createSelector } from "reselect";
import { TSearchState } from "../reducers/search.reducers";


const getSearchState = (state: { search: TSearchState }) => state.search;

export const selectSearchState = createSelector(
  [getSearchState],
  (searchState) => ({
    searchTerm: searchState.search
  })
);
