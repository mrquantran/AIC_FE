import { default as appState } from './app.reducers'
import { combineReducers } from 'redux'
import { default as searchState } from './search.reducers'
import storage from "redux-persist/lib/storage";
import persistReducer from 'redux-persist/es/persistReducer';

const appPersistSettingConfig = {
  key: "appState",
  storage: storage,
  whitelist: ["settings", "objectNames", "history"],
  blacklist: [],
};

const searchPersistSettingConfig = {
  key: "searchState",
  storage: storage,
  whitelist: ["searchParams", "searchResults"],
  blacklist: [],
};

export default combineReducers({
  appState: persistReducer(appPersistSettingConfig, appState),
  searchState: persistReducer(searchPersistSettingConfig, searchState),
})
