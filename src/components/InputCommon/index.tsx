import { Input } from "antd";
import styled from "styled-components";

const StyledInput = styled.div`
  .ant-form-item:not(.ant-form-item-horizontal) .ant-form-item-label > label {
    font-weight: 500;
  }
`;
const InputCommon = () => {
  return (
    <StyledInput>
      <Input />
    </StyledInput>
  );
};

export default InputCommon;
