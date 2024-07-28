import { TApiError } from "api/errors";
import { TQueryOptions } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getRecordByIndex } from "../http-service";

export function useSearch(request?: TQueryOptions) {
  return useQuery<any, TApiError>({
    queryKey: ["search", request],
    queryFn: () => getRecordByIndex(),
  });
}
