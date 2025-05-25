import { Input, Popover } from "antd";
import Header from "@/components/Header";
import AddButton from "@/components/AddButton";
import { useState } from "react";
import { IVoucher } from "@/models";
import { useQueryClient } from "@tanstack/react-query";
import DeleteButton from "@/components/DeleteButton";
import EditButton from "@/components/EditButton";
import TableCommon from "@/components/TableCommon";
import VoucherController from "./components/VoucherController";
import { useUnActiveVoucher, useVouchers } from "@/hooks/vouchers";
import dayjs from "dayjs";

const Vouchers = () => {
  const [filter, setFilter] = useState({
    current: 1,
    pageSize: 10,
    keyword: "",
  });
  const { data, isSuccess, isLoading } = useVouchers(filter);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [id, setId] = useState<string>();
  const unActiveVoucher = useUnActiveVoucher();
  const queryClient = useQueryClient();

  console.log(data);

  const columnsVoucher: any = [
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
      title: "Tên mã giảm giá",
      dataIndex: "code",
      key: "code",
      width: "10%",
      ellipsis: true,
      align: "left",
    },
    {
      title: "Thời gian áp dụng",
      dataIndex: "time",
      key: "time",
      width: "20%",
      render: (_: any, data: any) => {
        return (
          <div>
            <div>{`${dayjs(data?.start_time)?.format(
              "DD/MM/YYYY HH:mm"
            )} đến ${dayjs(data?.end_time)?.format("DD/MM/YYYY HH:mm")}`}</div>
          </div>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: "20%",
      render: (_: unknown, data: IVoucher) => {
        return (
          <div className="flex gap-x-3 justify-center">
            <EditButton onClick={() => handleEditVoucher(data?.id)} />
            <Popover
              placement="top"
              title={"Xác nhận"}
              content={
                <>
                  <div>Bạn muốn xóa voucher này?</div>
                  <div className="text-right">
                    <button
                      onClick={() => handleHideVoucher(data?.id)}
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

  const handleAddNewVoucher = () => {
    setIsOpen(true);
  };

  const handleEditVoucher = (id: string) => {
    setIsOpenEdit(true);
    setId(id);
    queryClient.invalidateQueries({
      queryKey: ["subject", id],
    });
  };

  const handleHideVoucher = (id: string) => {
    unActiveVoucher.mutateAsync(id);
  };

  console.log(data?.data?.vouchers, "check ");

  return (
    <div>
      <Header
        element={<AddButton onClick={handleAddNewVoucher}>Thêm mới</AddButton>}
      >
        Quản lý mã giảm giá
      </Header>

      <Input.Search
        placeholder="Tìm kiếm voucher"
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
        columns={columnsVoucher}
        dataSource={isSuccess ? data?.data?.vouchers : []}
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

      <VoucherController mode="add" isOpen={isOpen} setIsOpen={setIsOpen} />
      <VoucherController
        mode="edit"
        id={id}
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
      />
    </div>
  );
};

export default Vouchers;
