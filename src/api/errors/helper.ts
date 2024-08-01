import { ApiError, ApiErrorForm } from './errors'
import { put } from 'redux-saga/effects'
import { setAppError } from '@store/actions'

export function* HandleErrorSaga(
  error: ApiError | ApiErrorForm,
  typeError: string
) {
  if (error?.status === 401 || error?.status === 403) {
    // yield put(signOutRequest())
  } else {
    if (error.name === 'HandleApiError') {
      yield put(setAppError(error.message))
    } else if (error instanceof ApiErrorForm) {
      yield put({
        type: typeError,
        payload: error.errors,
      })
    }
  }
}
