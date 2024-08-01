import { TMessageError } from "@/types";
import { AxiosError } from "axios";
import { setAppError } from '@store/actions'
import { store } from "@store/index";

export class ApiError extends Error {
  message: string;
  status: number;
  errors: TMessageError[];

  constructor(message: string, status: number = 0) {
    super("");
    this.message = message;
    this.name = "ApiError";
    this.status = status;
    this.errors = [];
  }
}

export class ApiErrorForm extends Error {
  errors: TMessageError[];
  status: number;

  constructor(message: TMessageError[], status: number = 0) {
    super("");
    this.errors = message;
    this.name = "ApiErrorForm";
    this.status = status;
  }
}

export type TApiError = ApiError | ApiErrorForm;

export const HandleResponseError = (
  error: AxiosError<{ message: string | TMessageError[] }>
) => {
  if (error.response?.status === 401) {
    // store.dispatch(signOutRequest())
  }

  if (typeof error?.response?.data?.message === "object") {
    throw new ApiErrorForm(
      error.response.data.message as TMessageError[],
      error.response?.status
    );
  }

  if (typeof error?.response?.data?.message === "string") {
    // dispath app message error
    store.dispatch(setAppError(error.response.data.message))

    throw new ApiError(error.response.data.message, error.response?.status);
  }

  // dispath app message error
  store.dispatch(setAppError('Unknow'))

  throw new ApiError("Unknow", 400);
};

export const handleErrorApi = (error: ApiError | ApiErrorForm) => {
  if (error?.status === 401) {
    // store.dispatch(signOutRequest())
  } else {
    if (error.name === "ApiError") {
      store.dispatch(setAppError(error.message))
    }
  }
};
