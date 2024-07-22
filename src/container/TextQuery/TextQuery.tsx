import { Checkbox, Input, Space } from "antd";
import Preact from "preact/compat";

const { Search } = Input;
import type { GetProps } from "antd";

type SearchProps = GetProps<typeof Input.Search>;

const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
  console.log(info?.source, value);

const TextQuery: Preact.FunctionComponent = () => {
  return (
    <div>
      <span>Categories: </span>
      <Space>
        <Checkbox>Checkbox</Checkbox>
        <Checkbox>Checkbox</Checkbox>
        <Checkbox>Checkbox</Checkbox>
      </Space>
      <Space direction="vertical">
        <Search
          placeholder="input search text"
          allowClear
          onSearch={onSearch}
          style={{ width: 200 }}
        />
      </Space>
    </div>
  );
};

export default TextQuery;
