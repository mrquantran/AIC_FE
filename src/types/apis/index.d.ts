import { Method } from "axios";

export type TApiConfig<K = any> = {
  uri: string;
  method: K extends Method ? K : Method;
};

export type TApiConfigs = Record<string, TApiConfig>;

export type TMutationOptions<P = any, R = any> = {
  queryConfig?: Omit<
    UseMutationOptions<R, TApiError, P>,
    "mutationKey" | "mutationFn"
  >;
};

export type TQueryOptions<R = any> = {
  queryConfig?: Omit<UseQueryOptions<R, TApiError>, "queryKey" | "queryFn">;
};


export interface TAPIResponse<T> {
  data: T;
  total: number;
  message: string;
  status_code: number;
}