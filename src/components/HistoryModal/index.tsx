// @ts-nocheck
import { THistory } from "@/store/reducers/app.reducers";
import { Modal } from "antd";
import { useEffect, useState } from "preact/hooks";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Card, Row, Col, Button } from "antd";
import { useSelector } from "react-redux";

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
  const hisory = useSelector((state) => state.appState.history);
  const [items, setItems] = useState(hisory);

  useEffect(() => {
    if (hisory.length > 0) {
      setItems(hisory);
    }
  }, [hisory]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return; // Exit if there's no destination

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same list
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
      key={`${item.groupId}-${item.videoId}-${index}`} // Ensure a unique key
      draggableId={`item-${item.groupId}-${item.videoId}-${index}`} // Ensure unique draggableId
      index={index}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card style={{ marginBottom: 16 }}>
            <p>
              Group {item.groupId} - Video: {item.videoId} - Range:{" "}
              {item.range[0]} - {item.range[1]}
            </p>
          </Card>
        </div>
      )}
    </Draggable>
  );

  const handleDownload = () => {
    // Format the data into CSV without the header
    let csvContent = "";

    items.forEach((item) => {
      const { groupId, videoId, range } = item;
      const videoFileName = `L${groupId}_V${videoId}.mp4`;

      // Generate CSV lines for each frame index within the range
      for (let i = range[0]; i <= range[1]; i++) {
        csvContent += `${videoFileName}, ${i}\n`;
      }
    });

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: "text/csv" });
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    // Create a link element
    const link = document.createElement("a");
    // Set the download attribute with a filename
    link.download = "submitted.csv";
    // Set the href to the Blob URL
    link.href = url;
    // Programmatically click the link to trigger the download
    link.click();
    // Clean up by revoking the Object URL
    URL.revokeObjectURL(url);
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
                    border: "1px dashed lightgray", // Ensure the area is visible
                    padding: 8,
                  }}
                >
                  {items.map((item, index) => renderItem(item, index))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Button
              type="primary"
              onClick={handleDownload}
              style={{ marginTop: 16 }}
            >
              Download CSV
            </Button>
          </Col>
        </Row>
      </DragDropContext>
    </Modal>
  );
};

export default HistoryModal;
