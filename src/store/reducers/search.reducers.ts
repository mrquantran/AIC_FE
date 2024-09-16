// src/store/reducers/search.reducer.ts
import * as actions from "../actions/search.actions";
import update from "immutability-helper";
import { ActionType, getType } from "typesafe-actions";
import { TModelSearch } from "@/types/apis/search";

export type TSearch = {
  tabKey: number;
  model: TModelSearch;
  value: string | string[];
};

export type TSearchState = {
  searchResult: {
    data: any;
    total: number;
  };
  temporalSearchResult: {
    data: any;
    total: number;
  };
  temporalSearch: string[];
  search: TSearch[];
  disabledTabs: number[];
  filterIndexes: number[];
};

const defaultSearchState: TSearch[] = [
  {
    tabKey: 1,
    model: "Text",
    value: "",
  },
];

export const getInitialSearchState = () => {
  return {
    temporalSearch: [],
    temporalSearchResult: {
      data: [],
      total: 0,
    },
    searchResult: {
      data: [],
      total: 0,
    },
    search: defaultSearchState,
    disabledTabs: [],
    history: {
      saved: [],
      selectedQuestion: null,
      questions: [],
    },
    filterIndexes: [],
  };
};

export type TSearchActionType = ActionType<typeof actions>;

export default (
  state: TSearchState = getInitialSearchState(),
  action: TSearchActionType
): TSearchState => {
  switch (action.type) {
    case getType(actions.clearFilterIndexes):
      return update(state, {
        filterIndexes: {
          $set: [],
        },
      });
    case getType(actions.setFilterIndexes):
      // set unique filter indexes
      const uniqueFilterIndexes = Array.from(new Set(action.payload));
      return update(state, {
        filterIndexes: {
          $set: uniqueFilterIndexes,
        },
      });
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
                model: action.payload.model,
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
              model: { $set: action.payload.model },
              value: { $set: action.payload.value },
            },
          },
        });
      }
    }
    case getType(actions.setDisabledTabs):
      const uniqueDisabledTabs = Array.from(new Set(action.payload));
      return update(state, {
        disabledTabs: {
          $set: uniqueDisabledTabs,
        },
      });
    case getType(actions.setEnabledTabs):
      // payload is array number
      const uniqueEnabledTabs = Array.from(new Set(action.payload));
      return update(state, {
        disabledTabs: {
          $set: state.disabledTabs.filter(
            (item) => !uniqueEnabledTabs.includes(item)
          ),
        },
      });
    case getType(actions.setTemporalSearchResult):
      return update(state, {
        temporalSearchResult: {
          data: { $set: action.payload.data },
          total: { $set: action.payload.total },
        },
      });
    case getType(actions.setClearTemporalSearch):
      return update(state, {
        temporalSearch: {
          $set: [],
        },
      });
    case getType(actions.setSelectedTemporalQuery):
      const prevTemporalSearch = state.temporalSearch;
      if (prevTemporalSearch.includes(action.payload)) {
        return update(state, {
          temporalSearch: {
            $set: prevTemporalSearch.filter((item) => item !== action.payload),
          },
        });
      } else {
        return update(state, {
          temporalSearch: {
            $push: [action.payload],
          },
        });
      }
    case getType(actions.clearSearchQuery):
      return getInitialSearchState();
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
            value: { $set: action.payload },
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
    case getType(actions.setRemoveQueryValue):
      return update(state, {
        search: {
          $apply: (searchArray: TSearch[]) =>
            searchArray.map((item) => {
              if (item.tabKey === action.payload) {
                return { ...item, value: "" };
              } else {
                return item;
              }
            }),
        },
      });
    default:
      return state;
  }
};
