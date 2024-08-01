import { Input, Space } from "antd";
import Preact, { useState } from "preact/compat";
import { useSearchKeyframes } from "@/api/hooks/search";

const TextQuery: Preact.FunctionComponent = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { mutate: searchKeyframes, isPending: isMutating } =
    useSearchKeyframes();

    const handleKeyframeSubmit = () => {
      // Trigger mutation with the payload
      searchKeyframes([
        {
          model: "Text",
          value:  searchTerm
        }
      ]);
    };
  
  return (
    <div>
      {/* <span>Categories: </span>
      <Space>
        <Checkbox>Checkbox</Checkbox>
        <Checkbox>Checkbox</Checkbox>
        <Checkbox>Checkbox</Checkbox>
      </Space> */}
      <Space direction="vertical">
        <Input
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="input search text"
          allowClear
          value={searchTerm}
          style={{ width: 200 }}
        />
      </Space>
    </div>
  );
};

export default TextQuery;
