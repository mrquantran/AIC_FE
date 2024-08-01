import * as actions from '@store/actions/app.actions'
import update from 'immutability-helper'
import { ActionType, getType } from 'typesafe-actions'

export type TAppState = {
  apiError: string;
};

const initialAppState: TAppState = {
  apiError: '',
}

export type TAppActionType = ActionType<typeof actions>

export default (
  state: TAppState = initialAppState,
  action: TAppActionType
): TAppState => {
  switch (action.type) {
    case getType(actions.setAppError):
      return update(state, {
        apiError: { $set: action.payload },
      })

    default:
      return state
  }
}
