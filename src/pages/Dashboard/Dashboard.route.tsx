import { Dashboard } from "./Dashboard";
import { TRoute } from "@/types";
import { RootPaths } from "@/constants";
import { HomeOutlined } from "@ant-design/icons";

export const DashboardRoutes: TRoute[] = [
  {
    path: RootPaths.HOME,
    component: Dashboard,
    page: "accessible",
    breadcrumb: () => <></>,
    redirectTo: RootPaths.DASHBOARD,
  },
  {
    path: RootPaths.DASHBOARD,
    component: Dashboard,
    page: "accessible",
    showInMenu: true,
    menuIcon: <HomeOutlined />,
    menuLabel: "Dashboard",
    breadcrumb: "Dashboard",
  },
];
