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
import {
  SettingOutlined,
  BulbOutlined,
  ClearOutlined,
  HistoryOutlined,
  ScanOutlined,
  SelectOutlined,
} from "@ant-design/icons";
import SettingDrawer from "@/components/SettingDrawer/SettingDrawer";
import { AppError } from "@/components/ErrorHandler";
import { useDispatch, useSelector } from "react-redux";
import { useSearchKeyframes } from "@/api/hooks/search";
import {
  clearSearchQuery,
  setAppSettings,
  setSearchResult,
  submitSearchQuery,
  trySearchQuery,
} from "@/store/actions";
import Toast from "@/components/Toast";
import { TAppRootReducer } from "@/store";
import SettingSearch from "@/container/Settings";
import Loading from "@/components/Loading";
import HistoryModal from "@/components/HistoryModal";
import Swal from "sweetalert2";

const StyledHeader = styled(Layout.Header)<{ background: string }>`
  background: ${(props) => props.background};
  display: flex;
  align-items: center;
  padding: 0 16px;
  justify-content: space-between;
`;

const StyledLayout = styled(Layout)`
  height: 100%;

  padding: ${(props: { padding?: boolean }) =>
    props.padding ? "2rem 2rem 0" : 0};
`;

const MainLayout: React.FC = () => {
  const { authorizedRoutes } = useRoutes();
  const location = useLocation();
  const dispatch = useDispatch();
  const searchItems = useSelector(
    (state: TAppRootReducer) => state.searchState.search
  );
  const settings = useSelector(
    (state: TAppRootReducer) => state.appState.settings
  );
  const [open, setOpen] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);

  const showModalHistory = () => {
    setHistoryVisible(true);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

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

  const { mutate, data, isSuccess, isPending } = useSearchKeyframes({
    vector_search: settings.vectorSearch,
    k_query: settings.kQuery,
    display: settings.display,
  });

  useEffect(() => {
    if (isSuccess) {
      Toast("Search success", "success");
      dispatch(setSearchResult(data));
    }
  }, [isSuccess]);

  const handleSearch = () => {
    const isAllEmpty = searchItems.every(
      (item) => item.value !== "" || item.value.length !== 0
    );
    if (!isAllEmpty) {
      Toast(`Please fill the input`, "error");
      return;
    }
    dispatch(submitSearchQuery());
    mutate(
      searchItems.map((item) => ({
        model: item.model,
        value: item.value,
      }))
    );
  };

  const handleClickClearButton = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to clear all search queries? (this action cannot be undone and remove all history)",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(clearSearchQuery());
        Toast("Search queries cleared", "success");
      }
    });
  };

  const handleClickTryButton = () => {
    Toast("Prepare new query", "success", "top-start");
    dispatch(trySearchQuery());
  };



  const handleTemporalEnabled = () => {
    Toast(
      `Temporal mode ${settings.temporalSearch ? "disabled" : "enabled"}`,
      `${settings.temporalSearch ? "info" : "warning"}`,
      "top"
    );

    dispatch(setAppSettings("temporalSearch", !settings.temporalSearch));
  };

  return (
    <StyledLayout>
      <HistoryModal
        title="History Search"
        handleModalClose={() => setHistoryVisible(false)}
        isModalVisible={historyVisible}
      />
      {isPending ? <Loading /> : null}
      <StyledHeader background={colorBgContainer}>
        <StyledFlex>
          <img src={viteLogo} alt="Vite logo" />
          <h2 className="title-header">AI Challenge 2024</h2>
        </StyledFlex>
        <StyledFlex>
          <Button
            type="default"
            onClick={handleClickTryButton}
            style={{ marginRight: "1rem" }}
            icon={<BulbOutlined />}
          >
            Test it
          </Button>
          <Button
            onClick={handleTemporalEnabled}
            style={{ marginRight: "1rem" }}
            icon={<SelectOutlined />}
            type={settings.temporalSearch ? "primary" : "default"}
          >
            Temporal {settings.temporalSearch ? "Enabled" : "Disabled"}
          </Button>
          <Button
            type="default"
            style={{ marginRight: "1rem" }}
            icon={<HistoryOutlined />}
            onClick={showModalHistory}
          >
            History
          </Button>
          <Button
            type="dashed"
            onClick={handleClickClearButton}
            style={{ marginRight: "1rem" }}
            icon={<ClearOutlined />}
          >
            Clear
          </Button>
          <Button
            type="primary"
            onClick={handleSearch}
            style={{ marginRight: "1rem" }}
            icon={<ScanOutlined />}
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
          </Space>
        }
        open={open}
        onClose={closeDrawer}
      >
        <SettingSearch />
      </SettingDrawer>
      <AppError />
    </StyledLayout>
  );
};

export default MainLayout;
