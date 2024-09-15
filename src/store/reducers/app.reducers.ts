import { TQuestion } from "@/types";
import * as actions from "@store/actions/app.actions";
import update from "immutability-helper";
import { ActionType, getType } from "typesafe-actions";
import { TSearch } from "./search.reducers";

export type TSave = {
  query: TSearch[];
  result: any;
};

export type TAppState = {
  apiError: string;
  settings: {
    vectorSearch: "faiss" | "usearch";
    maxQuery: number;
    kQuery: number;
    display: number;
  };
  temporalSearchEnabled: boolean;
  objectNames: string[];
  modeTab: "image" | "table" | "temporal";
  history: THistory[];
  searchHistory: {
    saved: TSave[];
    selectedQuestion: TQuestion | null;
    questions: TQuestion[];
  };
};

export interface THistory {
  range: [number, number];
  answer?: string;
  videoId: number;
  groupId: number;
}

const initialAppState: TAppState = {
  apiError: "",
  settings: {
    vectorSearch: "faiss",
    maxQuery: 5,
    kQuery: 400,
    display: 20,
  },
  temporalSearchEnabled: false,
  objectNames: [],
  modeTab: "image",
  history: [],
  searchHistory: {
    questions: [],
    selectedQuestion: null,
    saved: [],
  },
};

export type TAppActionType = ActionType<typeof actions>;

export default (
  state: TAppState = initialAppState,
  action: TAppActionType
): TAppState => {
  switch (action.type) {
    case getType(actions.setQuestions):
      return update(state, {
        searchHistory: {
          questions: { $set: action.payload },
        },
      });
    case getType(actions.clearSearchHistory):
      return update(state, {
        searchHistory: {
          saved: { $set: [] },
          selectedQuestion: { $set: null },
          questions: {
            $set: []
          }
        },
      });
    case getType(actions.setSelectedQuestion):
      return update(state, {
        searchHistory: {
          selectedQuestion: { $set: action.payload },
        },
      });
      
    case getType(actions.clearOneHistory):
      return update(state, {
        history: {
          $splice: [[action.payload, 1]],
        },
      });
    case getType(actions.clearHistory):
      return update(state, {
        history: {
          $set: [],
        },
      });
    case getType(actions.addHistory):
      return update(state, {
        history: {
          $unshift: [action.payload],
        },
      });
    case getType(actions.setTemporalSearchEnabled):
      return update(state, {
        temporalSearchEnabled: {
          $set: action.payload,
        },
      });
    case getType(actions.setModeTab):
      return update(state, {
        modeTab: {
          $set: action.payload,
        },
      });
    case getType(actions.setAppError):
      return update(state, {
        apiError: { $set: action.payload },
      });
    case getType(actions.setAppSettings):
      return update(state, {
        settings: {
          [action.payload.field]: { $set: action.payload.value },
        },
      });
    case getType(actions.setObjectNames):
      return update(state, {
        objectNames: { $set: action.payload },
      });
    default:
      return state;
  }
};
