import { SidebarWrapper } from "@/components/sidebar/sidebar";

type Props = React.PropsWithChildren<{}>;

const layout = ({ children }: Props) => {
  return <SidebarWrapper>{children}</SidebarWrapper>;
};

export default layout;
