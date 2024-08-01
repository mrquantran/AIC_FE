import { Input, Space } from "antd";
import Preact from "preact/compat";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "@/store/actions";

const { TextArea } = Input;

const TextQuery: Preact.FunctionComponent = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state?.search?.searchTerm);

  const handleSearchTermChange = (e: any) => {
    dispatch(setSearchTerm(e.target.value));
  };
  
  return (
    <>
      {/* <span>Categories: </span>
      <Space>
        <Checkbox>Checkbox</Checkbox>
        <Checkbox>Checkbox</Checkbox>
        <Checkbox>Checkbox</Checkbox>
      </Space> */}
      <Space direction="vertical" style={{ width: "100%" }}>
        <TextArea
          style={{ width: "100%" }}
          onChange={handleSearchTermChange}
          placeholder="input search text"
          allowClear
          value={searchTerm}
        />
      </Space>
    </>
  );
};

export default TextQuery;
