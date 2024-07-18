import { RootPaths } from "@/constants";
import { TSideBarItem, TSideBarProps } from "@/types";
import { Layout, Menu, theme } from "antd";
import Preact, { useEffect } from "preact/compat";
import { useNavigate } from "react-router-dom";

const Sidebar: Preact.FunctionComponent<TSideBarProps> = ({
  items,
  onPathChange,
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();

  const defaultPath = items?.[0]?.path ?? RootPaths.DASHBOARD;

  useEffect(() => {
    if (!location.pathname) {
      navigate(defaultPath);
    }
  }, []);

  const sidebarItems =
    items?.map((item: TSideBarItem) => ({
      icon: item.icon,
      key: item.path,
      label: item.label,
    })) || [];

  return (
    <Layout.Sider
      background={colorBgContainer}
      collapsed={true}
      theme="light"
    >
      <Menu
        items={sidebarItems}
        onClick={onPathChange}
        defaultClic
        defaultSelectedKeys={[items?.[0]?.path]}
      />
    </Layout.Sider>
  );
};

export default Sidebar;
