import { Route, Routes } from "react-router";
import MainLayout from "./layout/MainLayout";
import { TRoute } from "./types";
import { flatten } from "./utils";
import { CustomNavigate } from "./components";
import { withCustomErrorBoundary } from "./HOC";
import { DashboardRoutes } from "@pages/Dashboard";
import { HistoryPageRoutes } from "./pages/HistoryPage/HistoryPage.route";

export const MainLayoutRoutes: TRoute = {
  component: MainLayout,
  path: "/",
  page: "accessible",
  children: [...DashboardRoutes, ...HistoryPageRoutes],
};

export const routes: TRoute[] = [MainLayoutRoutes];

export const flattenRoutes = flatten(routes);

const renderRoute = (routes: TRoute[]): React.ReactNode[] =>
  routes?.map(
    ({
      redirectTo,
      children,
      component: Component,
      path,
      // page,
      // permission,
    }) => {
      //   const AuthComponent = () => (
      //     <AuthWrapper
      //       page={page}
      //       permission={permission}
      //       fallback={<Unauthorized />}
      //     >
      //       <Component />
      //     </AuthWrapper>
      //   );

      //   Will implement auth component later
      const CustomComponent = withCustomErrorBoundary(
        // path !== "*" ? Component : Component
        Component
      );

      if (children && children.length > 0) {
        return (
          <Route key={path} path={path} element={<CustomComponent />}>
            {redirectTo && (
              <Route
                index
                element={<CustomNavigate to={redirectTo} replace />}
              />
            )}
            {renderRoute(children)}
          </Route>
        );
      }

      return (
        <Route
          key={path}
          path={path}
          element={
            redirectTo ? (
              <CustomNavigate to={redirectTo} replace />
            ) : (
              <CustomComponent />
            )
          }
        />
      );
    }
  );

export const AppRoutes = () => {
  return <Routes>{renderRoute(routes)}</Routes>;
};
