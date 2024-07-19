import "preact";
import {
  Table,
  Button,
  Input,
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
import Card from "antd/es/card/Card";

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

const handleRemove = async (selectedRows: React.Key[]): Promise<boolean> => {
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
const dummyData = [
  {
    key: 1,
    name: 'Keyframe 1',
    desc: 'This is the first keyframe',
    callNo: 823,
    status: 0,
    updatedAt: '2024-07-19 10:00:00',
  },
  {
    key: 2,
    name: 'Keyframe 2',
    desc: 'Processing keyframe',
    callNo: 645,
    status: 1,
    updatedAt: '2024-07-18 15:30:00',
  },
  {
    key: 3,
    name: 'Keyframe 3',
    desc: 'Successful keyframe',
    callNo: 1254,
    status: 2,
    updatedAt: '2024-07-17 09:45:00',
  },
  {
    key: 4,
    name: 'Keyframe 4',
    desc: 'Error in keyframe',
    callNo: 327,
    status: 3,
    updatedAt: '2024-07-16 14:20:00',
  },
  {
    key: 5,
    name: 'Keyframe 5',
    desc: 'Another default keyframe',
    callNo: 756,
    status: 0,
    updatedAt: '2024-07-15 11:10:00',
  },
];

const CustomTable: FunctionComponent = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
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

  const hasSelected: boolean = selectedRowKeys.length > 0;


  const CardTitle: JSX.Element = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Title level={4} style={{ margin: 0 }}>
        Keyframe Query List
      </Title>
      <Space>
        <Button type="primary" onClick={() => handleAdd({})}>
          <PlusOutlined /> Add
        </Button>
        <Popconfirm
          title="Are you sure to delete these items?"
          onConfirm={() => handleRemove(selectedRowKeys)}
          okText="Yes"
          cancelText="No"
        >
          <Button disabled={!hasSelected}>Delete</Button>
        </Popconfirm>
      </Space>
    </div>
  );

  return (
    <Card
      title={CardTitle}
      extra={hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
    >
      <Table<TableListItem>
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        rowKey="key"
        loading={loading}
      />
    </Card>
  );
};

export default CustomTable;
