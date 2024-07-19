import React, { useMemo } from "preact/compat";
import { Layout, theme } from "antd";
import viteLogo from "/vite.svg";
import styled from "styled-components";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./MainLayout.scss";
import { useRoutes } from "@/hooks";
import { TSideBarItem } from "@/types";
import Sidebar from "@/components/Sidebar/Sidebar";
import { RootPaths } from "@/constants";
import BuidlingBar from "@/components/BuildingBar/BuildingBar";

const StyledHeader = styled(Layout.Header)<{ background: string }>`
  background: ${(props) => props.background};
  display: flex;
  align-items: center;
  padding: 0 16px;
`;

const StyledLayout = styled(Layout)`
  height: 100%;
`;

const MainLayout: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { authorizedRoutes } = useRoutes();
  const location = useLocation();

  const sideBarItems = useMemo<TSideBarItem[]>(
    () =>
      authorizedRoutes
        .map((route) => {
          const isShowSubMenu = route.children?.some(
            ({ showInMenu }) => showInMenu
          );
          const newChildren = isShowSubMenu
            ? route.children
                ?.map((child) =>
                  child.showInMenu
                    ? {
                        path: child.path,
                        icon: child.menuIcon,
                        label: child.menuLabel,
                      }
                    : null
                )
                .filter(Boolean)
            : [];

          return route.showInMenu
            ? {
                path: route.path,
                icon: route.menuIcon,
                label: route.menuLabel,
                children: newChildren,
              }
            : null;
        })
        .filter(Boolean) as TSideBarItem[],
    [authorizedRoutes]
  );

  const navigate = useNavigate();

  const handleSideBarClick = ({ key }: { key: string }) => {
    if (key) {
      navigate(key);
    }
  };

  return (
    <StyledLayout>
      <StyledHeader background={colorBgContainer}>
        <img src={viteLogo} alt="Vite logo" />
        <h2 className="title-header">AI Challenge 2024</h2>
      </StyledHeader>
      <StyledLayout>
        <Sidebar
          items={sideBarItems}
          rootPath={RootPaths.HOME}
          path={location.pathname}
          onPathChange={handleSideBarClick}
        />
        <Layout>
          <BuidlingBar />
          <StyledLayout>
            <Layout.Content>
              <Outlet />
            </Layout.Content>
          </StyledLayout>
        </Layout>
      </StyledLayout>
    </StyledLayout>
  );
};

export default MainLayout;
