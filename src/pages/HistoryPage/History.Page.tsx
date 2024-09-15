import { useSearchKeyframesByRange } from "@/api/hooks/search";
import ImageGallery from "@/components/ImageGallery";
import Toast from "@/components/Toast";
import { TAppRootReducer } from "@/store";
import { IImage, THistory } from "@/types";
import { TSearchKeyframesByRangePayload } from "@/types/apis/search";
import { Button, Card, Flex } from "antd";
import { useState } from "preact/hooks";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { DownloadOutlined, HistoryOutlined } from "@ant-design/icons";

export const HistoryPage: React.FC = (): JSX.Element => {
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
      setImages(data.data);
      Toast(data.message, "success");
    }
  }, [isSuccess]);

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
      const current = questions?.find(
        (question) => question.fileName === currentSelectedQuestion.fileName
      );

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

  const renderExtraCard = () => {
    return (
      <Flex align="center" gap={10}>
        <Button type="dashed" icon={<HistoryOutlined />}>
          Preview History
        </Button>
        <Button type="primary" icon={<DownloadOutlined />}>
          Download CSV
        </Button>
      </Flex>
    );
  };

  return (
    <Card title="History" extra={renderExtraCard()}>
      <ImageGallery group="video" images={images} />
    </Card>
  );
};
