import { TRoute } from "@/types";
import { RootPaths } from "@/constants";
import { HistoryOutlined } from "@ant-design/icons";
import { HistoryPage } from "./History.Page";

export const HistoryPageRoutes: TRoute[] = [
  {
    path: RootPaths.HISTORY,
    component: HistoryPage,
    page: "accessible",
    showInMenu: true,
    menuIcon: <HistoryOutlined />,
    menuLabel: "History",
    breadcrumb: "History",
  },
];
