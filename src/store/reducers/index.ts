import { default as appState } from './app.reducers'
import { combineReducers } from 'redux'
import { default as searchState } from './search.reducers'

export default combineReducers({
  appState,
  searchState
})
