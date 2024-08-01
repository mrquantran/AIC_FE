// src/store/reducers/search.reducer.ts
import * as actions from "../actions/search.actions";
import update from "immutability-helper";
import { ActionType, getType } from "typesafe-actions";
import { TModelSearch } from "@/types/apis/search";

export type TSearch = {
  tabKey: number;
  model: TModelSearch;
  value: string;
};

export type TSearchState = {
  search: TSearch[];
};

const initialSearchState: TSearchState = {
  search: [
    {
      tabKey: 1,
      model: "Text",
      value:
        "The video shows three Samsung phones at the product launch. Initially, each phone appears one by one and then all three phones appear together.",
    },
  ],
};

export type TSearchActionType = ActionType<typeof actions>;

export default (
  state: TSearchState = initialSearchState,
  action: TSearchActionType
): TSearchState => {
  switch (action.type) {
    case getType(actions.setSearchTerm): {
      const index = state.search.findIndex(
        (s) => s.tabKey === action.payload.tabKey
      );
      if (index === -1) {
        // If the search item doesn't exist, create a new one
        return update(state, {
          search: {
            $push: [
              {
                tabKey: action.payload.tabKey,
                model: "Text",
                value: action.payload.value,
              },
            ],
          },
        });
      } else {
        // If the search item exists, update its value
        return update(state, {
          search: {
            [index]: {
              value: { $set: action.payload.value },
            },
          },
        });
      }
    }
    case getType(actions.submitSearchQuery):
      return initialSearchState;
    default:
      return state;
  }
};
