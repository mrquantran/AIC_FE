import React, { useEffect, useMemo, useState } from "preact/compat";
import { Button, Layout, Select, Space, theme } from "antd";
import viteLogo from "/vite.svg";
import styled from "styled-components";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./MainLayout.scss";
import { useRoutes } from "@/hooks";
import { TQuestion, TSideBarItem } from "@/types";
import Sidebar from "@/components/Sidebar/Sidebar";
import { RootPaths } from "@/constants";
import BuidlingBar from "@/components/BuildingBar/BuildingBar";
import { StyledFlex } from "@/theme/styled";
import {
  SettingOutlined,
  BulbOutlined,
  ClearOutlined,
  UploadOutlined,
  ScanOutlined,
  SelectOutlined,
} from "@ant-design/icons";
import SettingDrawer from "@/components/SettingDrawer/SettingDrawer";
import { AppError } from "@/components/ErrorHandler";
import { useDispatch, useSelector } from "react-redux";
import { useSearchKeyframes } from "@/api/hooks/search";
import {
  clearHistory,
  clearSearchHistory,
  clearSearchQuery,
  setDisabledTabs,
  setEnabledTabs,
  setModeTab,
  setQuestions,
  setSearchResult,
  setSelectedQuestion,
  setTemporalSearchEnabled,
  setTemporalSearchResult,
  submitSearchQuery,
  trySearchQuery,
} from "@/store/actions";
import Toast from "@/components/Toast";
import { TAppRootReducer } from "@/store";
import SettingSearch from "@/container/Settings";
import Loading from "@/components/Loading";
import HistoryUploadModal from "@/components/HistoryUpload";
import Swal from "sweetalert2";
import { convertToSearchBodyTemporal } from "./MainLayout.utils";

const StyledHeader = styled(Layout.Header)<{ background: string }>`
  background: ${(props) => props.background};
  display: flex;
  align-items: center;
  padding: 0 16px;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); 
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
  const temporalSearch = useSelector(
    (state: TAppRootReducer) => state.searchState.temporalSearch
  );
  const temporalSearchEnabled = useSelector(
    (state: TAppRootReducer) => state.appState.temporalSearchEnabled
  );
  const searchResult = useSelector(
    (state: TAppRootReducer) => state.searchState.searchResult
  );
  const disabledTabs = useSelector(
    (state: TAppRootReducer) => state.searchState.disabledTabs
  );
  const questions = useSelector(
    (state: TAppRootReducer) => state.appState.history.questions
  );
  const currentSelectedQuestion = useSelector(
    (state: TAppRootReducer) => state.appState.history.selectedQuestion
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

  // MainLayout.tsx:148 Warning: [Ant Design CSS-in-JS] You are registering a cleanup function after unmount, which will not have any effect.
  const handleSideBarClick = ({ key }: { key: string }) => {
    if (key) {
      navigate(key);
    }
  };

  const filterIndexes = useSelector(
    (state: TAppRootReducer) => state.searchState.filterIndexes
  );

  const { mutate, data, isSuccess, isPending } = useSearchKeyframes({
    vector_search: settings.vectorSearch,
    k_query: settings.kQuery,
    display: settings.display,
    filter_indexes: filterIndexes,
  });

  useEffect(() => {
    if (isSuccess) {
      Toast("Search success", "success");
      if (temporalSearchEnabled) {
        dispatch(setTemporalSearchResult(data));
        dispatch(setModeTab("temporal"));
      } else {
        dispatch(setSearchResult(data));
      }
    }
  }, [isSuccess]);

  const handleSearch = () => {
    const searchItemsFiltered = searchItems.filter(
      (item) => disabledTabs.indexOf(item.tabKey) === -1
    );

    const isAllEmpty = searchItemsFiltered.every(
      (item) => item.value !== "" || item.value.length !== 0
    );

    if (!isAllEmpty || searchItemsFiltered.length === 0) {
      Toast(`Please fill the input`, "error");
      return;
    }

    if (temporalSearchEnabled && temporalSearch.length === 0) {
      Toast(`Please choose the keyframe for temporal search`, "error");
      return;
    }

    dispatch(submitSearchQuery());

    const bodySearch = searchItemsFiltered.map((item) => ({
      model: item.model,
      value: item.value,
    }));

    const temporalSearchValue = convertToSearchBodyTemporal(temporalSearch);

    const payload =
      temporalSearchValue.value.length > 0
        ? bodySearch.concat(temporalSearchValue)
        : bodySearch;

    mutate(payload);
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
        dispatch(setTemporalSearchEnabled(false));
        dispatch(setModeTab("image"));
        dispatch(clearHistory());
        dispatch(clearSearchHistory());
        Toast("Search queries cleared", "success");
      }
    });
  };

  const handleClickTryButton = () => {
    Toast("Prepare new query", "success", "top-start");
    dispatch(trySearchQuery(currentSelectedQuestion?.content ?? ""));
  };

  const handleTemporalEnabled = () => {
    if (searchResult.data.length === 0) {
      Toast("Please search first", "error", "top");
      return;
    }
    Toast(
      `Temporal mode ${temporalSearchEnabled ? "disabled" : "enabled"}`,
      `${temporalSearchEnabled ? "info" : "warning"}`,
      "top"
    );
    const allSearchItems = searchItems.map((item) => item.tabKey);

    if (temporalSearchEnabled) {
      dispatch(setEnabledTabs(allSearchItems));
      dispatch(setModeTab("image"));
    }

    if (!temporalSearchEnabled) {
      dispatch(setDisabledTabs(allSearchItems));
    }

    dispatch(setTemporalSearchEnabled(!temporalSearchEnabled));
  };

  const handleSubmitQuestions = (data: TQuestion[]) => {
    dispatch(setQuestions(data));
    setHistoryVisible(false);
    Toast("History uploaded", "success");
  };

  return (
    <StyledLayout>
      <HistoryUploadModal
        title="History Search"
        handleModalClose={() => setHistoryVisible(false)}
        isModalVisible={historyVisible}
        handleSubmit={handleSubmitQuestions}
      />
      {isPending ? <Loading /> : null}
      <StyledHeader background={colorBgContainer}>
        <StyledFlex>
          <img src={viteLogo} alt="Vite logo" />
          <h2 className="title-header">AI Challenge 2024</h2>
        </StyledFlex>
        <StyledFlex>
          <Button
            onClick={handleTemporalEnabled}
            style={{ marginRight: "1rem" }}
            icon={<SelectOutlined />}
            type={temporalSearchEnabled ? "primary" : "default"}
          >
            Temporal {temporalSearchEnabled ? "Enabled" : "Disabled"}
          </Button>
          <Button
            type="default"
            style={{ marginRight: "1rem" }}
            icon={<UploadOutlined />}
            onClick={showModalHistory}
          >
            Upload Test
          </Button>
          <Select
            placeholder="Select a question"
            style={{ width: "100%", marginRight: "1rem" }}
            value={currentSelectedQuestion?.fileName}
            onChange={(value: string) => {
              const question = questions.find((q) => q.fileName === value);
              if (!question) {
                Toast("Question not found", "error");
                return;
              }
              dispatch(setSelectedQuestion(question));
            }}
          >
            {questions?.map((question) => (
              <Select.Option
                key={question.fileName}
                value={question.fileName}
                o
              >
                {question.fileName}
              </Select.Option>
            ))}
          </Select>
          <Button
            type="default"
            onClick={handleClickTryButton}
            style={{ marginRight: "1rem" }}
            icon={<BulbOutlined />}
          >
            Test it
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
            onClick={() => handleSearch()}
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
          {location.pathname === "/dashboard" ? <BuidlingBar /> : null}
          <StyledLayout padding={true} style={{ overflow: "auto" }}>
            <Layout.Content>
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
