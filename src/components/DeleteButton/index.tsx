import { Button, ButtonProps } from "antd";
import styled from "styled-components";

const StyleButton = styled.div`
  .ant-btn-variant-outlined:not(:disabled):not(.ant-btn-disabled):hover {
    color: rgba(220, 38, 38, 1) !important;
    border-color: rgba(220, 38, 38, 1);
  }
`;

const DeleteButton = (props: ButtonProps) => {
  return (
    <StyleButton>
      <Button
        {...props}
        className="font-medium text-red-600 border border-red-600 hover:text-red-600"
      >
        Xóa
      </Button>
    </StyleButton>
  );
};

export default DeleteButton;
