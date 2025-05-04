import { Button, ButtonProps } from "antd";
import styled from "styled-components";

const StyleButton = styled.div`
  .ant-btn-variant-outlined:not(:disabled):not(.ant-btn-disabled):hover {
    color: blue !important;
    border-color: blue;
  }
`;

const EditButton = (props: ButtonProps) => {
  return (
    <StyleButton>
      <Button
        {...props}
        className="font-medium text-blue-600 border border-blue-600 hover:text-blue-600"
      >
        Sửa
      </Button>
    </StyleButton>
  );
};

export default EditButton;
