export declare type TSideBarItem = {
  path: string;
  hide?: boolean;
  icon?: IconType;
  label?: string;
  children?: TSideBarItem[];
  parent?: TSideBarItem;
  subMenuTitle?: string;
};

export declare type TSideBarProps = {
  className?: string;
  classes?: Partial<typeof classes>;
  logoSrc?: string;
  items?: TSideBarItem[];
  rootPath?: string;
  path?: string;
  onPathChange?: ({ key }: { key: string }) => void;
  subMenuFullHeight?: boolean;
  showSubmenuTitle?: boolean;
};
