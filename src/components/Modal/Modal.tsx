import { JSX } from "preact";
import { Modal, ModalProps } from "antd";

interface ICustomModal extends ModalProps {
  visible: boolean;
  title: string;
  onCancel: () => void;
  width: number;
  footer?: JSX.Element;
  bodyStyle?: React.CSSProperties;
  className?: string;
}

export const CustomModal = ({
  title,
  visible,
  footer,
  width,
  onCancel,
  className,
  ...props
}: ICustomModal) => {
  return (
    <Modal
      centered
      closable={false}
      open={visible}
      title={title}
      width={width}
      footer={footer}
      onCancel={onCancel}
      className={className}
      {...props}
    >
      {props.children}
    </Modal>
  );
};
