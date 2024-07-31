import "preact";
import {
  Table,
  Button,
  message,
  Typography,
  Space,
  Popconfirm,
  Tag,
} from "antd";
import type { TableColumnsType } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "preact/hooks";
import { FunctionComponent, JSX, Key } from "preact";

const { Title } = Typography;

interface TableListItem {
  key: number;
  name: string;
  desc: string;
  callNo: number;
  status: number;
  updatedAt: string;
}

const handleAdd = async (fields: Partial<TableListItem>): Promise<boolean> => {
  const hide = message.loading("Adding...");

  try {
    // await addRule({ ...fields });
    hide();
    message.success("Added successfully");
    return true;
  } catch (error) {
    hide();
    message.error("Add failed, please try again!");
    return false;
  }
};

const handleRemove = async (selectedRows: Key[]): Promise<boolean> => {
  const hide = message.loading("Deleting...");
  if (!selectedRows) return true;

  try {
    // await removeRule({
    //   key: selectedRows.map((row) => row.key),
    // });
    hide();
    message.success("Deleted successfully, refreshing...");
    return true;
  } catch (error) {
    hide();
    message.error("Delete failed, please try again");
    return false;
  }
};

// Dummy data
// Dummy data
const dummyData = new Array(16).fill(null).map((_, index) => ({
    key: index,
    name: "Keyframe 1",
    desc: "This is the first keyframe",
    callNo: 823,
    status: 0,
    updatedAt: "2024-07-19 10:00:00",
  }
))
const CustomTable: FunctionComponent = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [data, setData] = useState<TableListItem[]>(dummyData);
  const [loading, setLoading] = useState<boolean>(false);

  const columns: TableColumnsType<TableListItem> = [
    {
      title: "Keyframe",
      dataIndex: "name",
      render: (text: string, record: TableListItem) => (
        <a onClick={() => handleRowClick(record)}>{text}</a>
      ),
    },
    {
      title: "Description",
      dataIndex: "desc",
    },
    {
      title: "Call No",
      dataIndex: "callNo",
      sorter: (a: TableListItem, b: TableListItem) => a.callNo - b.callNo,
      render: (val: number) => `${val}万`,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: number) => {
        let color: string = "default";
        let text: string = "Default";
        switch (status) {
          case 1:
            color = "processing";
            text = "Processing";
            break;
          case 2:
            color = "success";
            text = "Success";
            break;
          case 3:
            color = "error";
            text = "Error";
            break;
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      sorter: true,
    },
    {
      title: "Option",
      key: "option",
      render: (_: any, record: TableListItem) => (
        <Space size="middle">
          <a href="#">Preview</a>
        </Space>
      ),
    },
  ];

  const handleRowClick = (record: TableListItem): void => {
    // Handle row click
  };

  const handleUpdate = (record: TableListItem): void => {
    // Handle update
  };

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
