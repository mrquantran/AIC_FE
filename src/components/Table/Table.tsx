import { FunctionComponent, Key } from "preact";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { useState } from "preact/hooks";


interface TableListItem {
  key: number;
  value: string;
  confidence: number;
}

interface CustomTableProps {
  data: TableListItem[];
}

const CustomTable: FunctionComponent<CustomTableProps> = ({ data }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [loading, _] = useState<boolean>(false);

  const columns: TableColumnsType<TableListItem> = [
    {
      title: "Keyframe",
      dataIndex: "key",
    },
    {
      title: "Path",
      dataIndex: "value",
    },
    {
      title: "Score",
      dataIndex: "confidence",
      render: (val: number) => `${val}%`,
    },
  ];

  const onSelectChange = (newSelectedRowKeys: Key[]): void => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Table<TableListItem>
      rowSelection={rowSelection}
      columns={columns}
      pagination={{ position: ["bottomCenter"] }}
      dataSource={data}
      rowKey="key"
      loading={loading}
    />
  );
};

export default CustomTable;
