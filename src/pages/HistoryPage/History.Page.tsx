import { useSearchKeyframesByRange } from "@/api/hooks/search";
import ImageGallery from "@/components/ImageGallery";
import Toast from "@/components/Toast";
import { TAppRootReducer } from "@/store";
import { IImage, THistory, TQuestion } from "@/types";
import { TSearchKeyframesByRangePayload } from "@/types/apis/search";
import { Button, Card, Flex, Input, Modal, Select, Table, Tag } from "antd";
import { useState } from "preact/hooks";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  DownloadOutlined,
  HistoryOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

export const HistoryPage: React.FC = (): JSX.Element => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [selectedEditQuestion, setSelectedEditQuestion] = useState<TQuestion>();
  const questions = useSelector(
    (state: TAppRootReducer) => state.appState.history.questions
  );
  const currentSelectedQuestion = useSelector(
    (state: TAppRootReducer) => state.appState.history.selectedQuestion
  );
  const { data, mutate, isSuccess } = useSearchKeyframesByRange();
  const [images, setImages] = useState<IImage[]>([]);

  useEffect(() => {
    if (isSuccess && data) {
      setImages(data?.data);
      Toast(data?.message, "success", 'bottom-right');
    }
  }, [isSuccess, data]);

  const formatFileName = (videoId: number, groupId: number) => {
    // convert groupId from 0 to 00, or 1 to 01, 10 to 10
    const groupIdStr = groupId.toString().padStart(2, "0");

    // convert video from 0 to 000, or 1 to 001, 10 to 010, 99 to 099, 100 to 100
    const videoIdStr = videoId.toString().padStart(3, "0");

    return `L${groupIdStr}_V${videoIdStr}`;
  };

  const handleDownload = (currentQuestion: TQuestion) => {
    let csvContent = "";
    const history =
      questions.find(
        (question) => question.fileName === currentQuestion.fileName
      )?.history || [];
    const queryType = currentQuestion?.type;
    const fileName = currentQuestion?.fileName;

    history?.forEach((item: THistory) => {
      const { groupId, videoId, range } = item;
      const videoFileName = formatFileName(videoId, groupId);

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
    link.download = fileName.replace(".txt", ".csv");
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatHistoryPayload = (
    keyframes: THistory[]
  ): TSearchKeyframesByRangePayload[] => {
    return keyframes?.map((keyframe: THistory) => {
      return {
        video_id: keyframe.videoId,
        group_id: keyframe.groupId,
        start: keyframe.range[0],
        end: keyframe.range[1],
      };
    });
  };

  useEffect(() => {
    if (currentSelectedQuestion) {
      const current = getFullQuestions(currentSelectedQuestion);

      if (current) {
        const history = current.history;
        const formattedHistory = formatHistoryPayload(history);
        mutate(formattedHistory);
      }

      return;
    }

    return () => {
      setImages([]);
    };
  }, [currentSelectedQuestion]);

  useEffect(() => {
    if (currentSelectedQuestion) {
      setSelectedEditQuestion(currentSelectedQuestion);
    }
  }, [currentSelectedQuestion]);

  const renderExtraCard = () => {
    return (
      <Flex align="center" gap={10}>
        <Button
          icon={<EditOutlined />}
          onClick={() => setIsEditModalVisible(true)}
        >
          Edit Questions
        </Button>
        <Button
          type="dashed"
          icon={<HistoryOutlined />}
          onClick={() => setIsPreviewModalVisible(true)}
        >
          Preview History
        </Button>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={() =>
            currentSelectedQuestion && handleDownload(currentSelectedQuestion)
          }
        >
          Download CSV
        </Button>
      </Flex>
    );
  };

  const getFullQuestions = (currentQuestion: TQuestion) => {
    return questions?.find((q) => q.fileName === currentQuestion.fileName);
  };

  const columnsTable = [
    {
      key: "fileName",
      title: "File Name",
      // @ts-ignore
      render: (_, record: THistory) =>
        formatFileName(record.videoId, record.groupId),
    },
    {
      key: "start",
      title: "Start",
      // @ts-ignore
      render: (_, record: THistory) => record.range[0],
      width: 150,
    },
    {
      key: "end",
      title: "End",
      // @ts-ignore
      render: (_, record: THistory) => record.range[1],
      width: 150,
    },
    {
      key: "answer",
      title: "Answer",
      // @ts-ignore
      render: (_, record: THistory) =>
        record.answer ? record.answer : <Tag color="red">No Answer</Tag>,
    },
  ];

  return (
    <>
      <Modal
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        title="Question Edited"
        width={"100vh"}
      >
        <Select
          value={selectedEditQuestion?.fileName}
          placeholder="Select a question"
          style={{ width: "100%" }}
          onChange={(value: string) => {
            const question = questions.find(
              (question) => question.fileName === value
            );
            setSelectedEditQuestion(question);
          }}
        >
          {questions.map((question) => (
            <Select.Option key={question.fileName} value={question.fileName}>
              {question.fileName}
            </Select.Option>
          ))}
        </Select>
        <TextArea
          style={{ marginTop: "2rem" }}
          rows={6}
          readOnly
          value={selectedEditQuestion?.content}
        />
      </Modal>
      <Modal
        open={isPreviewModalVisible}
        onCancel={() => setIsPreviewModalVisible(false)}
        title="Preview History"
        width={"100vh"}
      >
        <Table
          dataSource={
            currentSelectedQuestion
              ? getFullQuestions(currentSelectedQuestion)?.history
              : []
          }
          columns={columnsTable}
        />
      </Modal>
      <Card title="History" extra={renderExtraCard()}>
        <ImageGallery group="video" images={images} />
      </Card>
    </>
  );
};
