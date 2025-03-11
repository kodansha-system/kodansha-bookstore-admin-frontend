import { ReactNode } from "react";

interface IHeaderProps {
  children: string;
  element?: ReactNode;
}
const Header = (props: IHeaderProps) => {
  const { children, element } = props;
  return (
    <div className="flex justify-between items-center w-full">
      <div className="text-[20px] font-bold py-5">{children}</div>
      <div>{element}</div>
    </div>
  );
};

export default Header;
