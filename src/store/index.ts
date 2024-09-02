// @ts-nocheck
import createSagaMiddleware, { END, SagaMiddleware } from "redux-saga";
import logger from "redux-logger";
import rootReducers from "./reducers";
import rootSagas from "./sagas";
import storage from "redux-persist/lib/storage";
import { Store, applyMiddleware, compose, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { PersistConfig } from "redux-persist/es/types";
import { createTransform } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: [""],
  // temporalSearch in black list
  blacklist: [],
};

export type TAppRootReducer = ReturnType<typeof rootReducers>;

let store: Store<TAppRootReducer> = null;

const createEnhancer = (sagaMiddleware: SagaMiddleware) => {
  const middleWares =
    process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test"
      ? applyMiddleware(sagaMiddleware)
      : applyMiddleware(sagaMiddleware, logger);
  const composeEnhancers =
    process.env.NODE_ENV !== "production" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
      : compose;
  return composeEnhancers(middleWares);
};

export const createRedux = (preloadedState = {}) => {
  const sagaMiddleware: SagaMiddleware = createSagaMiddleware();

  const enhancer = createEnhancer(sagaMiddleware);

  const persistedReducer = persistReducer(persistConfig, rootReducers);

  store = createStore(persistedReducer, preloadedState, enhancer);

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSagas);

  store.runSaga = sagaMiddleware.run;

  store.close = () => store.dispatch(END);

  return { persistor, store };
};

export { store };

export default createRedux();
