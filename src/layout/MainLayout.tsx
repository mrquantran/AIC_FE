import React from "preact/compat";
import { Layout, Menu, theme, type MenuProps } from "antd";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import viteLogo from "/vite.svg";
import styled from "styled-components";

const items1: MenuProps["items"] = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const StyledHeader = styled(Layout.Header)<{ background: string }>`
  background: ${(props) => props.background};
  display: flex;
  align-items: center;
`;


const items2: MenuProps["items"] = [
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
].map((icon, index) => {
  const key = String(index + 1);

  return {
    key: `sub${key}`,
    icon: icon,
    label: `subnav ${key}`,

    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});

const MainLayout: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <StyledHeader background={colorBgContainer}>
        <img src={viteLogo} alt="Vite logo" />
      </StyledHeader>
      <Layout>
        <Layout.Sider style={{ background: colorBgContainer }}>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            items={items2}
          />
        </Layout.Sider>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
