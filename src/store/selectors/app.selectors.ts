import { createSelector } from 'reselect'
import { TAppState } from '../reducers/app.reducers'

const getError = (appState: TAppState) => appState?.apiError

export const selectorAppState = createSelector([getError], apiError => ({
  apiError,
}))
