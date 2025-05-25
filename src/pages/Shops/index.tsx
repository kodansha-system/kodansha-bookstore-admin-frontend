import { Button, Input, Popover } from "antd";
import Header from "@/components/Header";
import AddButton from "@/components/AddButton";
import { useState } from "react";
import { IShop } from "@/models";
import { useQueryClient } from "@tanstack/react-query";
import DeleteButton from "@/components/DeleteButton";
import EditButton from "@/components/EditButton";
import TableCommon from "@/components/TableCommon";
import dayjs from "dayjs";
import { useShops, useUnActiveShop } from "@/hooks/shops";
import ShopController from "./components/ShopController";
import { Navigate, useNavigate } from "react-router-dom";

const Shops = () => {
  const [filter, setFilter] = useState({
    current: 1,
    pageSize: 10,
    keyword: "",
  });
  const { data, isSuccess, isLoading } = useShops(filter);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [id, setId] = useState<string>();
  const unActiveShop = useUnActiveShop();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const columnsShop: any = [
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: "10%",
      ellipsis: true,
      align: "left",
      render: (text: any) => {
        console.log(text);
        return <div>{dayjs(text)?.format("DD/MM/YYYY")}</div>;
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: "30%",
      ellipsis: true,
      align: "left",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: "12%",
    },
    {
      title: "Giờ mở cửa",
      dataIndex: "working_time",
      key: "working_time",
      width: "12%",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: 300,
      render: (_: unknown, data: IShop) => {
        return (
          <div className="flex gap-x-3 justify-center">
            <EditButton onClick={() => handleEditShop(data?.id)} />
            <Button
              onClick={() => {
                navigate(`/shops/${data?.id}`);
              }}
            >
              Quản lý số lượng sách
            </Button>
            <Popover
              placement="top"
              title={"Xác nhận"}
              content={
                <>
                  <div>Bạn muốn xóa shop này?</div>
                  <div className="text-right">
                    <button
                      onClick={() => handleHideShop(data?.id)}
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

  const handleAddNewShop = () => {
    setIsOpen(true);
  };

  const handleEditShop = (id: string) => {
    setIsOpenEdit(true);
    setId(id);
    queryClient.invalidateQueries({
      queryKey: ["subject", id],
    });
  };

  const handleHideShop = (id: string) => {
    unActiveShop.mutateAsync(id);
  };

  console.log(data?.data?.shops, "check ");

  return (
    <div>
      <Header
        element={<AddButton onClick={handleAddNewShop}>Thêm mới</AddButton>}
      >
        Quản lý cửa hàng
      </Header>

      <Input.Search
        placeholder="Nhập địa chỉ cửa hàng"
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
        columns={columnsShop}
        dataSource={isSuccess ? data?.data?.shops : []}
        loading={isLoading}
        pagination={{
          showSizeChanger: true,
          total: data?.data?.meta?.totalItems,
          current: filter.current,
          pageSize: filter.pageSize,
          onChange: (page, pageSize) => {
            setFilter({ ...filter, current: page, pageSize });
          },
        }}
      />

      <ShopController mode="add" isOpen={isOpen} setIsOpen={setIsOpen} />
      <ShopController
        mode="edit"
        id={id}
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
      />
    </div>
  );
};

export default Shops;
