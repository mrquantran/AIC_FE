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
  searchResult: {
    data: any;
    total: number;
  };
  search: TSearch[];
};

const trySearchState: TSearch[] = [
  {
    tabKey: 1,
    model: "Text",
    value:
      "The video shows three Samsung phones at the product launch. Initially, each phone appears one by one, and then all three phones appear together.",
  },
];

const defaultSearchState: TSearch[] = [
  {
    tabKey: 1,
    model: "Text",
    value: "",
  },
];

export const getInitialSearchState = (x: boolean) => {
  return {
    searchResult: {
      data: [],
      total: 0,
    },
    search: x ? trySearchState : defaultSearchState,
  };
};

export type TSearchActionType = ActionType<typeof actions>;

export default (
  state: TSearchState = getInitialSearchState(false),
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
    case getType(actions.clearSearchQuery):
      return getInitialSearchState(false);
    case getType(actions.setSearchResult):
      return update(state, {
        searchResult: {
          data: { $set: action.payload.data },
          total: { $set: action.payload.total },
        },
      });
    case getType(actions.trySearchQuery):
      return update(state, {
        search: {
          0: {
            value: { $set: trySearchState[0].value },
          },
        },
      });
    case getType(actions.setRemoveQuery):
      return update(state, {
        search: {
          $apply: (searchArray: TSearch[]) =>
            searchArray.filter((item) => item.tabKey !== action.payload),
        },
      });
    case getType(actions.setAddQuery):
      return update(state, {
        search: {
          $push: [
            {
              tabKey: action.payload,
              model: "Text",
              value: "",
            },
          ],
        },
      });
    default:
      return state;
  }
};
