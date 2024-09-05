import * as actions from "@store/actions/app.actions";
import update from "immutability-helper";
import { ActionType, getType } from "typesafe-actions";

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
};

export interface THistory {
  range: [number, number];
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
};

export type TAppActionType = ActionType<typeof actions>;

export default (
  state: TAppState = initialAppState,
  action: TAppActionType
): TAppState => {
  switch (action.type) {
    // add new item to history
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
          $set: action.payload
        }
      });
    case getType(actions.setModeTab):
      return update(state, {
        modeTab: {
          $set: action.payload
        }
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
