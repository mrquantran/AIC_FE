import * as actions from "@store/actions/app.actions";
import update from "immutability-helper";
import { ActionType, getType } from "typesafe-actions";

export type TAppState = {
  apiError: string;
  settings: {
    vectorSearch: "faiss" | "usearch";
    maxQuery: number;
  };
};

const initialAppState: TAppState = {
  apiError: "",
  settings: {
    vectorSearch: "faiss",
    maxQuery: 5,
  },
};

export type TAppActionType = ActionType<typeof actions>;

export default (
  state: TAppState = initialAppState,
  action: TAppActionType
): TAppState => {
  switch (action.type) {
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
    default:
      return state;
  }
};
