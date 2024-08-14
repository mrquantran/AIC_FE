import { createAction } from 'typesafe-actions'
import { TAppState } from '../reducers/app.reducers'

export const setAppError = createAction(
  '@api/SET_APP_FAILURE',
  (error: string) => error
)()

export const setAppSettings = createAction(
  '@api/SET_ONE_FIELD_APP_SETTINGS',
  (field: keyof TAppState['settings'], value: TAppState['settings'][keyof TAppState['settings']]) => ({ field, value })
)()

export const setObjectNames = createAction(
  '@api/SET_OBJECT_NAMES',
  (objectNames: string[]) => objectNames
)()