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
  const defaultPath = RootPaths.DASHBOARD;
  const selectedKey =
    items?.find((item) => location.pathname.includes(item.path))
      ?.path || defaultPath;
  console.log(selectedKey);
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
    <Layout.Sider background={colorBgContainer} collapsed={true} theme="light">
      <Menu
        items={sidebarItems}
        onClick={onPathChange}
        // defaultSelectedKeys={[items?.[0]?.path]}
        selectedKeys={[selectedKey]}
      />
    </Layout.Sider>
  );
};

export default Sidebar;
