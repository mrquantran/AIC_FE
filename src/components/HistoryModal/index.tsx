import { Modal} from "antd";

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
  return (
    <Modal
      visible={isModalVisible}
      footer={null}
      width="50%"
      title={title}
      onCancel={handleModalClose}
    ></Modal>
  );
};

export default HistoryModal;
