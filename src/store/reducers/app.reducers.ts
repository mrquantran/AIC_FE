import { TQuestion } from "@/types";
import * as actions from "@store/actions/app.actions";
import update from "immutability-helper";
import { ActionType, getType } from "typesafe-actions";

// extends type from TQuestion

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
  history: {
    selectedQuestion: TQuestion | null;
    questions: TQuestion[];
  };
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
  modeTab: "image",
  history: {
    questions: [],
    selectedQuestion: null,
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
        history: {
          questions: { $set: action.payload },
        },
      });
    case getType(actions.clearSearchHistory):
      return update(state, {
        history: {
          selectedQuestion: { $set: null },
          questions: {
            $set: [],
          },
        },
      });
    case getType(actions.setSelectedQuestion):
      return update(state, {
        history: {
          selectedQuestion: { $set: action.payload },
        },
      });
    // case getType(actions.clearOneHistory):
    //   return update(state, {
    //     history: {
    //       $splice: [[action.payload, 1]],
    //     },
    //   });
    // case getType(actions.clearHistory):
    //   return update(state, {
    //     history: {
    //       $set: [],
    //     },
    //   });
    case getType(actions.addHistory):
      // find questions with the same filename with action.payload.selectedQuestion
      // Unexpected lexical declaration in case block
      const found = state.history.questions.find(
        (q) => q.fileName === action.payload.selectedQuestion.fileName
      );
      console.log("found", found);
      if (found) {
        return update(state, {
          history: {
            questions: {
              [state.history.questions.indexOf(found)]: {
                history: {
                  $push: [action.payload.history],
                },
              },
            },
          },
        });
      }

      return state;

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
