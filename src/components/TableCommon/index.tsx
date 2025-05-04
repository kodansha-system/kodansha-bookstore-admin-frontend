import { Table, TableProps } from "antd";
import styled from "styled-components";

const StyledTable = styled.div`
  .ant-table-wrapper .ant-table-thead > tr > th,
  .ant-table-cell {
    font-size: 15px;
  }
  .ant-table-cell {
    font-size: 14px;
  }
`;

const TableCommon = (props: TableProps) => {
  return (
    <StyledTable>
      <Table
        {...props}
        bordered
        className="w-full"
        scroll={{ x: 800, y: 450 }}
      />
    </StyledTable>
  );
};

export default TableCommon;
