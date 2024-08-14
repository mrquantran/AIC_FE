import { TApiError } from "api/errors";
import { useQuery } from "@tanstack/react-query";
import { getObjectNames } from "../http-service/objects";

export function useGetObjectNames() {
  return useQuery<
    {
      data: string[];
    },
    TApiError
  >({
    queryKey: ["objects"],
    queryFn: () => getObjectNames(),
  });
}
