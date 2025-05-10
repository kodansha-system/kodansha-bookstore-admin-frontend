import { Input, Popover, Tag } from "antd";
import Header from "@/components/Header";
import AddButton from "@/components/AddButton";
import { useState } from "react";
import { IFlashSale } from "@/models";
import DeleteButton from "@/components/DeleteButton";
import EditButton from "@/components/EditButton";
import TableCommon from "@/components/TableCommon";
import { useFlashSales, useUnActiveFlashSale } from "@/hooks/flashSales";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "@/enum/routes";

const FlashSales = () => {
  const [filter, setFilter] = useState({
    current: 1,
    pageSize: 10,
    keyword: "",
  });
  const { data: listFlashSale, isSuccess, isLoading } = useFlashSales(filter);
  const unActiveFlashSale = useUnActiveFlashSale();
  const navigate = useNavigate();

  const columnsFlashSale: any = [
    {
      title: "Tên flash sale",
      dataIndex: "name",
      key: "name",
      width: "50%",
      ellipsis: true,
      align: "left",
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 160,
      render: (_: any, record: any) => {
        const now = new Date();
        const start = new Date(record.start_time);
        const end = new Date(record.end_time);

        if (now < start) {
          return <Tag color="blue">Chưa diễn ra</Tag>;
        }
        if (now >= start && now <= end) {
          return <Tag color="green">Đang diễn ra</Tag>;
        }
        return <Tag color="red">Đã kết thúc</Tag>;
      },
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_time",
      key: "start_time",
      width: 200,
      ellipsis: true,
      align: "left",
      render: (data: any) => <div>{new Date(data).toLocaleString()}</div>,
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_time",
      key: "end_time",
      width: 200,
      render: (data: any) => <div>{new Date(data).toLocaleString()}</div>,
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: 200,
      render: (_: unknown, data: IFlashSale) => {
        return (
          <div className="flex gap-x-3 justify-center">
            <EditButton onClick={() => handleEditFlashSale(data?.id)} />
            <Popover
              placement="top"
              title={"Xác nhận"}
              content={
                <>
                  <div>Bạn muốn xóa flashsale này?</div>
                  <div className="text-right">
                    <button
                      onClick={() => handleHideFlashSale(data?.id)}
                      className="bg-blue-500 text-white py-1 px-2 mt-2 rounded-md"
                    >
                      OK
                    </button>
                  </div>
                </>
              }
            >
              <DeleteButton />
            </Popover>
          </div>
        );
      },
    },
  ];

  const handleAddNewFlashSale = () => {
    navigate(RoutePath.FLASH_SALES + "/create");
  };

  const handleEditFlashSale = (id: string) => {
    navigate(`${RoutePath.FLASH_SALES}/edit/${id}`);
  };

  const handleHideFlashSale = (id: string) => {
    unActiveFlashSale.mutateAsync(id);
  };

  return (
    <div>
      <Header
        element={
          <AddButton onClick={handleAddNewFlashSale}>Thêm mới</AddButton>
        }
      >
        Quản lý flash sales
      </Header>

      <Input.Search
        placeholder="Tìm kiếm flash sale"
        allowClear
        onSearch={(value) => {
          setFilter((prev) => ({
            ...prev,
            keyword: value,
            current: 1,
          }));
        }}
        style={{ width: 300 }}
        className="mb-3"
      />

      <TableCommon
        columns={columnsFlashSale}
        dataSource={isSuccess ? listFlashSale?.data : []}
        loading={isLoading}
        pagination={{
          showSizeChanger: true,
          total: listFlashSale?.data?.meta?.totalItems,
          current: filter.current,
          pageSize: filter.pageSize,
          onChange: (page, pageSize) => {
            setFilter({ ...filter, current: page, pageSize });
          },
        }}
      />
    </div>
  );
};

export default FlashSales;
