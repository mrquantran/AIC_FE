import { TApiError } from "api/errors";
import { IImage, TAPIResponse, TQueryOptions } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getNearestIndexFromKeyframe,
  getRecordByIndex,
  searchKeyframes,
  searchKeyframesByRange,
} from "../http-service";
import {
  TSearchKeyframePayload,
  TSearchKeyframesByRangePayload,
  TSearchNearestIndexFromKeyframePayload,
  TSearchParams,
} from "@/types/apis/search";

export function useSearch(request?: TQueryOptions) {
  return useQuery<any, TApiError>({
    queryKey: ["search", request],
    queryFn: () => getRecordByIndex(),
  });
}

export function useSearchKeyframes(queryParams?: TSearchParams) {
  return useMutation<void, TApiError, TSearchKeyframePayload[]>({
    mutationFn: (payload) => searchKeyframes(payload, queryParams),
  });
}

export function useSearchNearestIndexFromKeyframe() {
  return useMutation<any, TApiError, TSearchNearestIndexFromKeyframePayload>({
    mutationFn: (payload) => getNearestIndexFromKeyframe(payload),
  });
}

export function useSearchKeyframesByRange() {
  return useMutation<
    TAPIResponse<IImage[]>,
    TApiError,
    TSearchKeyframesByRangePayload[]
  >({
    mutationFn: (payload) => searchKeyframesByRange(payload),
  });
}
