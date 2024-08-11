import { Select, SelectProps, Typography } from "antd";

interface IObjectQuery {
  tabKey: number;
}

const options: SelectProps["options"] = [];

for (let i = 0; i < 100000; i++) {
  const value = `${i.toString(36)}${i}`;
  options.push({
    label: value,
    value,
    disabled: i === 10,
  });
}

const ObjectSelectQuery: preact.FunctionComponent<IObjectQuery> = () => {
  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
  };

  return (
    <>
      <Typography.Title level={5} style={{ marginBottom: "0.25rem" }}>
        {options.length} Items
      </Typography.Title>
      <Select
        mode="multiple"
        style={{ width: "100%" }}
        placeholder="Please select"
        onChange={handleChange}
        options={options}
      />
    </>
  );
};

export default ObjectSelectQuery;
