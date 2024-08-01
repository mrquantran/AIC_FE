import Preact from "preact/compat";
import { Drawer } from "antd";

const StyleDrawer: Preact.FunctionComponent<{
  open: boolean;
  onClose: () => void;
  title: string;
  extra?: Preact.ReactNode;
  children: Preact.ReactNode;
}> = ({ open, onClose, title, extra, children }) => {
  return (
    <Drawer
      title={title}
      placement={"right"}
      width={500}
      onClose={onClose}
      open={open}
      extra={extra}
    >
      {children}
    </Drawer>
  );
};

export default StyleDrawer;
