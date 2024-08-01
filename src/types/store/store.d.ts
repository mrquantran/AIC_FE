import { selectSearchState } from '@/store/selectors/search.selectors';
import { Action } from 'redux'
import { TAppState } from './portal.type'
import { TAuthState } from './auth.type'

declare namespace StoreTypes {
  export type TAction<T> = {
    type: string
    payload: T
  }
}

export interface IAppAction<T = any, P = any> extends Action {
  type: T
  payload: P
}

export type TRootState = {
  appState: TAppState
  searchState: TSearchState
}
