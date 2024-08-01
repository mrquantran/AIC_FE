// TextQuery.tsx
import { Input, Space } from "antd";
import Preact from "preact/compat";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "@/store/actions";
import { TAppRootReducer } from "@/store";

const { TextArea } = Input;

interface ITextQuery {
  tabKey: number;
}

const TextQuery: Preact.FunctionComponent<ITextQuery> = ({ tabKey }) => {
  const dispatch = useDispatch();
  const searchTab = useSelector((state: TAppRootReducer) =>
    state?.searchState?.search.find((s) => s.tabKey === tabKey)
  );

  const handleSearchTermChange = (e: any) => {
    dispatch(setSearchTerm("Text", e.target.value, tabKey));
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <TextArea
        rows={5}
        key={tabKey}
        style={{ width: "100%" }}
        onChange={handleSearchTermChange}
        placeholder="input search text"
        allowClear
        value={searchTab?.value}
      />
    </Space>
  );
};

export default TextQuery;
