import Preact, { JSX, ReactNode, useEffect } from "preact/compat";
import { Alert, Button, Card, Flex, Layout, Row, Switch, Tabs } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  FileTextOutlined,
  CodeSandboxOutlined,
  AudioOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import TextQuery from "@/container/TextQuery/TextQuery";
import { useDispatch, useSelector } from "react-redux";
import { TAppRootReducer } from "@/store";
import Toast from "../Toast";
import {
  setDisabledTabs,
  setObjectNames,
  setRemoveQuery,
  setRemoveQueryValue,
} from "@/store/actions";
import ObjectSelectQuery from "@/container/ObjectSelectQuery/ObjectSelectQuery";
import { useGetObjectNames } from "@/api/hooks/objects";

// Type definitions
interface Tab {
  key: string;
  tab: ReactNode;
  content: ReactNode;
  icon: JSX.Element;
}

interface QueryItem {
  key: number;
  tabs: Tab[];
  temporalSearchMode?: boolean;
}

type QueryState = QueryItem[];

// Styled components
const StyledContent = styled(Layout.Content)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  width: 100%;
  max-height: 96%;
  overflow-y: auto;
`;

const StyledCard = styled(Card)`
  width: 100%;
  margin-bottom: 1rem;

  .ant-card-body {
    padding: 18px;
  }
`;

const BuidlingBar: Preact.FunctionComponent = () => {
  const dispatch = useDispatch();
  const settings = useSelector(
    (state: TAppRootReducer) => state.appState.settings
  );
  const search = useSelector(
    (state: TAppRootReducer) => state.searchState.search
  );
  const disabledTabs = useSelector(
    (state: TAppRootReducer) => state.searchState.disabledTabs
  );
  const temporalSearchEnabled = useSelector(
    (state: TAppRootReducer) => state.appState.temporalSearchEnabled
  );

  const styleIcon = { marginRight: "0.5rem" };

  const { data, isSuccess } = useGetObjectNames();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setObjectNames(data.data));
    }
  }, [isSuccess]);

  const renderDefaultTab = (key: number): Tab[] => {
    return [
      {
        key: `tabText${key}`,
        tab: "Text",
        content: <TextQuery tabKey={key} type="Text" />,
        icon: <FileTextOutlined style={styleIcon} />,
      },
      {
        key: `tabObject${key}`,
        tab: "Object",
        content: <ObjectSelectQuery tabKey={key} />,
        icon: <CodeSandboxOutlined style={styleIcon} />,
      },
      {
        key: `tabAudio${key}`,
        tab: "Audio",
        content: <TextQuery tabKey={key} type="Audio" />,
        icon: <AudioOutlined style={styleIcon} />,
      },
      {
        key: `tabOCR${key}`,
        tab: "OCR",
        content: <TextQuery tabKey={key} type="OCR" />,
        icon: <FileTextOutlined style={styleIcon} />,
      },
    ];
  };

  const defaultItems = [
    {
      key: 1,
      tabs: renderDefaultTab(1),
    },
  ];

  const [items, setItems] = Preact.useState<QueryState>(defaultItems);

  useEffect(() => {
    if (search.length === 1) {
      setItems(defaultItems);
    }
  }, [search.length]);

  const handleRemoveQuery = (queryKey: number) => {
    if (items.length === 1) {
      Toast("You must have at least one query", "error");
      return;
    }

    if (
      temporalSearchEnabled &&
      search.filter(
        (item) => item.tabKey === queryKey && disabledTabs.includes(item.tabKey)
      ).length > 0
    ) {
      Toast("Cannot remove query because of Temporal Search", "error");
      return;
    }

    setItems((prevItems) => prevItems.filter((item) => item.key !== queryKey));
    dispatch(setRemoveQuery(queryKey));
  };

  const handleAddQuery = () => {
    if (items.length >= settings.maxQuery) {
      Toast(
        `You have reached the maximum ${settings.maxQuery} number of queries`,
        "error"
      );
      return;
    }

    const newKey = items.length + 1;
    const newItem: QueryItem = {
      key: newKey,
      tabs: renderDefaultTab(newKey),
      temporalSearchMode: temporalSearchEnabled,
    };

    setItems((prevItems) => [...prevItems, newItem]);
  };

  useEffect(() => {
    // remove all query have temporalSearchMode enable when temporalSearchEnabled is disable
    if (!temporalSearchEnabled) {
      setItems((prevItems) =>
        prevItems.filter((item) => !item.temporalSearchMode)
      );
    }
  }, [temporalSearchEnabled]);

  const handleChangeTab = (activeKey: string) => {
    const tabKey = activeKey[activeKey.length - 1];
    dispatch(setRemoveQueryValue(Number(tabKey)));
  };

  const handleChangeSwitch = (tabKey: number) => {
    if (temporalSearchEnabled) {
      Toast("Cannot enable because of Temporal Search", "error");
      return;
    }

    if (disabledTabs?.includes(tabKey)) {
      dispatch(setDisabledTabs(disabledTabs.filter((item) => item !== tabKey)));
    }

    if (!disabledTabs?.includes(tabKey)) {
      dispatch(setDisabledTabs([...disabledTabs, tabKey]));
    }
  };

  return (
    <Layout.Sider
      theme="light"
      width="25%"
      style={{
        borderRight: "1px solid rgba(0, 0, 0, 0.1)",
      }}
    >
      <Flex
        style={{ margin: "1rem 0.5rem 0rem" }}
        align="center"
        justify="center"
      >
        {temporalSearchEnabled && (
          <Alert
            message="Temporal Search enabled will be disabled previous queries"
            showIcon
          />
        )}
      </Flex>

      <StyledContent>
        <Row style={{ width: "100%" }}>
          {items.map((item) => (
            <StyledCard key={item.key}>
              <Tabs
                onChange={handleChangeTab}
                type="line"
                tabBarExtraContent={{
                  right: (
                    <Flex align="center">
                      <Switch
                        size="small"
                        value={!disabledTabs?.includes(item.key)}
                        onChange={() => handleChangeSwitch(item.key)}
                      />
                      <DeleteOutlined
                        onClick={() => handleRemoveQuery(item.key)}
                        style={{
                          marginLeft: "10px",
                          cursor: "pointer",
                          color: "red",
                        }}
                      />
                    </Flex>
                  ),
                }}
              >
                {item.tabs.map((tab) => (
                  <Tabs.TabPane
                    key={tab.key}
                    tab={
                      <>
                        {tab.icon}
                        {tab.tab}
                      </>
                    }
                  >
                    {tab.content}
                  </Tabs.TabPane>
                ))}
              </Tabs>
            </StyledCard>
          ))}
        </Row>
        <Button
          type="dashed"
          style={{ width: "100%", height: "3rem" }}
          icon={<PlusOutlined />}
          onClick={handleAddQuery}
        >
          More Query
        </Button>
      </StyledContent>
    </Layout.Sider>
  );
};

export default BuidlingBar;
