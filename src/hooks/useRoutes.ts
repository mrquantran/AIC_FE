import { MainLayoutRoutes, flattenRoutes } from "app.route";
import { TRoute } from "types/common";
import { matchPath, useLocation } from "react-router";
import { useMemo } from "preact/hooks";

export default function useRoutes() {
  const location = useLocation();

  const route = useMemo(
    () => flattenRoutes.find((val) => matchPath(val.path, location.pathname)),
    [location]
  );

  const authorizedRoutes = useMemo(
    () =>
      MainLayoutRoutes.children?.reduce<TRoute[]>(function reduceFn(
        prev,
        curr
      ) {
        if (curr.children) {
          return [
            ...prev,
            {
              ...curr,
              children: curr.children.reduce<TRoute[]>(reduceFn, []),
            },
          ];
        }
        return [...prev, curr];
      },
      []) || [],
    []
  );

  return { route, authorizedRoutes };
}
