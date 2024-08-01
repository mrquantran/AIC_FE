import { createAction } from 'typesafe-actions'

export const setAppError = createAction(
  '@api/SET_APP_FAILURE',
  (error: string) => error
)()
