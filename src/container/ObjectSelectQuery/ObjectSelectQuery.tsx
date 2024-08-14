import { TAppRootReducer } from "@/store";
import { Select, Typography } from "antd";
import { useState } from "preact/hooks";
import { useSelector } from "react-redux";

interface IObjectQuery {
  tabKey: number;
}

const ObjectSelectQuery: preact.FunctionComponent<IObjectQuery> = ({}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const objectNames = useSelector(
    (state: TAppRootReducer) => state.appState.objectNames
  );

  const handleChange = (value: string[]) => {
    setSelected(value);
  };

  return (
    <>
      <Typography.Title level={5} style={{ marginBottom: "0.25rem" }}>
        {selected.length} / {objectNames?.length} Items
      </Typography.Title>
      <Select
        mode="multiple"
        style={{ width: "100%" }}
        placeholder="Please select"
        onChange={handleChange}
        options={objectNames.map((name) => ({ label: name, value: name }))}
      />
    </>
  );
};

export default ObjectSelectQuery;
