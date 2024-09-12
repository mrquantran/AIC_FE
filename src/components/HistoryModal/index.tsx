import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Card, Row, Col, Button, Input, Select, Flex } from "antd";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { TAppRootReducer } from "@/store";
import { THistory } from "@/store/reducers/app.reducers";
import { clearOneHistory } from "@/store/actions";
import { ClearOutlined } from "@ant-design/icons";
interface IVideoModalProps {
  isModalVisible: boolean;
  handleModalClose: () => void;
  title: string;
}

const HistoryModal = ({
  isModalVisible,
  handleModalClose,
  title,
}: IVideoModalProps) => {
  const history = useSelector(
    (state: TAppRootReducer) => state.appState.history
  );
  const [items, setItems] = useState(history);
  const [queryNumber, setQueryNumber] = useState(1);
  const [queryType, setQueryType] = useState("kis");
  const dispatch = useDispatch();

  useEffect(() => {
    if (history.length > 0) {
      setItems(history);
    }
  }, [history]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const reorder = (
        list: THistory[],
        startIndex: number,
        endIndex: number
      ): THistory[] => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
      };

      setItems(reorder(items, source.index, destination.index));
    }
  };

  const renderItem = (item: THistory, index: number) => (
    <Draggable
      key={`${item.groupId}-${item.videoId}-${index}`}
      draggableId={`item-${item.groupId}-${item.videoId}-${index}`}
      index={index}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card style={{ marginBottom: 16 }}>
            <Flex align="center" justify="space-between">
              <p>
                Group {item.groupId} - Video: {item.videoId} - Range:{" "}
                {item.range[0]} - {item.range[1]}
                {item.answer && (
                  <span style={{ marginLeft: 16 }}>
                    - Answer: {item.answer}
                  </span>
                )}
              </p>
              <Button
                type="primary"
                danger
                onClick={() => removeHistoryItem(index)}
                icon={<ClearOutlined />}
              >
                Remove
              </Button>
            </Flex>
          </Card>
        </div>
      )}
    </Draggable>
  );

  const handleDownload = () => {
    let csvContent = "";

    items.forEach((item) => {
      const { groupId, videoId, range } = item;
      // convert groupId from 0 to 00, or 1 to 01, 10 to 10
      const groupIdStr = groupId.toString().padStart(2, "0");

      // convert video from 0 to 000, or 1 to 001, 10 to 010, 99 to 099, 100 to 100
      const videoIdStr = videoId.toString().padStart(3, "0");

      const videoFileName = `L${groupIdStr}_V${videoIdStr}`;

      for (let i = range[0]; i <= range[1]; i++) {
        if (item.answer !== "" && queryType === "qa") {
          csvContent += `${videoFileName}, ${i}, ${item.answer}\n`;
        } else {
          csvContent += `${videoFileName}, ${i}\n`;
        }
      }
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `query-${queryNumber}-${queryType}.csv`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const removeHistoryItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    dispatch(clearOneHistory(index));
  };

  return (
    <Modal
      open={isModalVisible}
      footer={null}
      width="50%"
      title={title}
      onCancel={handleModalClose}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={16}>
          <Col span={24}>
            <Droppable droppableId="items">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    minHeight: 200,
                    border: "1px dashed lightgray",
                    padding: 8,
                    marginBottom: 16,
                  }}
                >
                  {items.map((item, index) => renderItem(item, index))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Row gutter={16} align="middle" style={{ width: " 100%" }}>
              <Col span={16}>
                <Input
                  type="number"
                  value={queryNumber}
                  onChange={(e) => setQueryNumber(Number(e.target.value))}
                  placeholder="Query Number"
                  style={{ width: "8vh", marginRight: 8 }}
                />
                <Select
                  value={queryType}
                  onChange={(value) => setQueryType(value)}
                  style={{ width: "10vh" }}
                >
                  <Select.Option value="kis">KIS</Select.Option>
                  <Select.Option value="qa">QA</Select.Option>
                </Select>
              </Col>
              <Col span={8} align="end">
                <Button type="primary" onClick={handleDownload}>
                  Download CSV
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </DragDropContext>
    </Modal>
  );
};

export default HistoryModal;
