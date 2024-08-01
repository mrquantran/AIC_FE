import React, { useEffect, useMemo, useState } from "preact/compat";
import { Button, Layout, Space, theme } from "antd";
import viteLogo from "/vite.svg";
import styled from "styled-components";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./MainLayout.scss";
import { useRoutes } from "@/hooks";
import { TSideBarItem } from "@/types";
import Sidebar from "@/components/Sidebar/Sidebar";
import { RootPaths } from "@/constants";
import BuidlingBar from "@/components/BuildingBar/BuildingBar";
import { StyledFlex } from "@/theme/styled";
import { SettingOutlined } from "@ant-design/icons";
import SettingDrawer from "@/components/SettingDrawer/SettingDrawer";
import { AppError } from "@/components/ErrorHandler";
import { useDispatch, useSelector } from "react-redux";
import { useSearchKeyframes } from "@/api/hooks/search";
import { setSearchResult, submitSearchQuery } from "@/store/actions";
import { TRootState } from "@/types/store";
import Toast from "@/components/Toast";
import { TAppRootReducer } from "@/store";

const StyledHeader = styled(Layout.Header)<{ background: string }>`
  background: ${(props) => props.background};
  display: flex;
  align-items: center;
  padding: 0 16px;
  justify-content: space-between;
`;

const StyledLayout = styled(Layout)`
  height: 100%;

  padding: ${(props: { padding?: boolean }) => (props.padding ? "2rem" : 0)};
`;

const MainLayout: React.FC = () => {
  const dispatch = useDispatch();
  const searchItems = useSelector(
    (state: TAppRootReducer) => state.searchState.search
  );
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

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

  const { mutate, data, isSuccess } = useSearchKeyframes();

  useEffect(() => {
    if (isSuccess) {
      Toast("Search success", "success");
      console.log("Search result", data);
      dispatch(setSearchResult(data));
    }
  }, [isSuccess]);

  const handleSearch = () => {
    dispatch(submitSearchQuery());
    mutate(
      searchItems.map((item) => ({
        model: item.model,
        value: item.value,
      }))
    );
  };

  return (
    <StyledLayout>
      <StyledHeader background={colorBgContainer}>
        <StyledFlex>
          <img src={viteLogo} alt="Vite logo" />
          <h2 className="title-header">AI Challenge 2024</h2>
        </StyledFlex>
        <StyledFlex>
          <Button
            type="primary"
            onClick={handleSearch}
            style={{ marginRight: "1rem" }}
          >
            Confirm
          </Button>
          <Button onClick={showDrawer}>
            <SettingOutlined style={{ fontSize: "24px" }} />
          </Button>
        </StyledFlex>
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
          <StyledLayout padding={true}>
            <Layout.Content style={{ overflow: "auto" }}>
              <Outlet />
            </Layout.Content>
          </StyledLayout>
        </Layout>
      </StyledLayout>
      <SettingDrawer
        title="Settings"
        extra={
          <Space>
            <Button onClick={closeDrawer}>Cancel</Button>
            <Button type="primary" onClick={closeDrawer}>
              OK
            </Button>
          </Space>
        }
        open={open}
        onClose={closeDrawer}
      >
        <div>Content</div>
      </SettingDrawer>
      <AppError />
    </StyledLayout>
  );
};

export default MainLayout;
