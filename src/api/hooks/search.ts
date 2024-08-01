import { TApiError } from "api/errors";
import { TQueryOptions } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRecordByIndex, searchKeyframes } from "../http-service";
import { TSearchKeyframePayload, TSearchParams } from "@/types/apis/search";

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