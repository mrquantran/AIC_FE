import { TApiError } from "api/errors";
import { TQueryOptions } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRecordByIndex, searchKeyframes } from "../http-service";

export function useSearch(request?: TQueryOptions) {
  return useQuery<any, TApiError>({
    queryKey: ["search", request],
    queryFn: () => getRecordByIndex(),
  });
}

export function useSearchKeyframes(request?: TQueryOptions) {
  return useMutation<void, TApiError, TSearchKeyframeayload[]>({
    mutationFn: (payload) => searchKeyframes(payload),
  });
}
