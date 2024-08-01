// src/store/reducers/search.reducer.ts
import * as actions from "../actions/search.actions";
import update from "immutability-helper";
import { ActionType, getType } from "typesafe-actions";

export type TSearchState = {
  searchTerm: string;
};

const initialSearchState: TSearchState = {
  searchTerm: "",
};

export type TSearchActionType = ActionType<typeof actions>;

export default (
  state: TSearchState = initialSearchState,
  action: TSearchActionType
): TSearchState => {
  switch (action.type) {
    case getType(actions.setSearchTerm):
      return update(state, {
        searchTerm: { $set: action.payload },
      });
    default:
      return state;
  }
};
