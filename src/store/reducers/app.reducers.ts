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
};

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
};

export type TAppActionType = ActionType<typeof actions>;

export default (
  state: TAppState = initialAppState,
  action: TAppActionType
): TAppState => {
  switch (action.type) {
    case getType(actions.setTemporalSearchEnabled):
      return update(state, {
        temporalSearchEnabled: {
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
