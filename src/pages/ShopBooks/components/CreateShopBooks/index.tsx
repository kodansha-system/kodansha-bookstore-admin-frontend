import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Table,
  DatePicker,
  Select,
  InputNumber,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useBooks } from "@/hooks/books";
import TableCommon from "@/components/TableCommon";
import { useCategories } from "@/hooks/categories";
import { useCreateFlashSale } from "@/hooks/flashSales";
import { disabledDate, disabledRangeTime } from "@/utils/common";
import { useNavigate } from "react-router-dom";

interface Book {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface FlashSaleItem {
  key: string;
  book: Book;
  price: number;
  quantity: number;
}

const CreateNewShopBooksPage: React.FC = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState<FlashSaleItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [discountOption, setDiscountOption] = useState<"percent" | "fixed">(
    "percent"
  );
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [filter, setFilter] = useState<any>({
    page: 1,
    limit: 10,
    keyword: "",
  });
  const { data, isFetching } = useBooks(filter);
  const { data: allBooks } = useBooks({ get_all: true });
  const { data: listCategories } = useCategories({ get_all: true });
  const navigate = useNavigate();

  const bookColumns: any = [
    { title: "Tên sách", dataIndex: "name" },
    {
      title: "Giá gốc",
      dataIndex: "origin_price",
      render: (data: any) => <div>{data ? data.toLocaleString() : ""}</div>,
    },
    {
      title: "Giá ngày thường",
      dataIndex: "price",
      align: "center",
      render: (data: any, item: any) => (
        <div className="flex gap-x-2 justify-center">
          <div>{data ? data.toLocaleString() : ""}</div>
          <div className="text-gray-400">
            (giảm {((1 - item?.price / item?.origin_price) * 100).toFixed(0)}%)
          </div>
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      render: (data: any) => <div>{data?.name}</div>,
    },
  ];

  const itemColumns: ColumnsType<FlashSaleItem> = [
    { title: "STT", render: (_, __, index) => index + 1 },
    { title: "Tên sách", render: (_, record) => record.book.name },
    {
      title: "Giá Flash Sale",
      dataIndex: "price",
      render: (_, record, index) => (
        <InputNumber
          value={record.price}
          onChange={(value) => {
            const newItems = [...items];
            newItems[index].price = value || 0;
            setItems(newItems);
          }}
          min={0}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => parseFloat(value?.replace(/,/g, "") || "0")}
        />
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (_, record, index) => (
        <InputNumber
          value={record.quantity}
          onChange={(value) => {
            const newItems = [...items];
            newItems[index].quantity = value || 0;
            setItems(newItems);
          }}
          min={1}
        />
      ),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => {
            setItems((prev) => prev.filter((i) => i.key !== record.key));
            setSelectedRowKeys((prevKeys) =>
              prevKeys.filter((k) => k !== record.key)
            );
          }}
        />
      ),
    },
  ];

  const handleAddBooks = () => {
    const listBook = allBooks?.data;
    const uniqueSelectedRowKeys = [...new Set(selectedRowKeys)];

    console.log(listBook, uniqueSelectedRowKeys);

    const newItems = listBook
      .filter((book: any) => {
        return (
          uniqueSelectedRowKeys.includes(book.id) &&
          !items.some((p: any) => p.key === `${book.id}`)
        );
      })
      .map((book: any) => ({
        key: `${book.id}`,
        book,
        price:
          discountOption === "percent"
            ? Math.floor(book.origin_price * (1 - discountValue / 100))
            : discountValue,
        quantity: 1,
      }));

    setItems((prev) => [...prev, ...newItems]);

    setModalVisible(false);

    setSelectedRowKeys((prev) => [
      ...prev,
      ...newItems.map((book: any) => book.book.id),
    ]);
  };

  const createFlashSale = useCreateFlashSale();
  const handleCreateFlashSale = async () => {
    try {
      const values = await form.validateFields();
      const payload: any = {
        name: values.name,
        start_time: values.duration?.[0]?.toISOString(),
        end_time: values.duration?.[1]?.toISOString(),
        books: items.map((item) => ({
          book_id: item.book.id,
          price: item.price,
          quantity: item.quantity,
        })),
      };
      createFlashSale.mutate(payload);
    } catch (error) {
      message.error("Vui lòng nhập đầy đủ thông tin");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Thêm Flash Sale</h1>
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Tên Flash Sale"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên flash sale" }]}
          className="w-[400px]"
        >
          <Input
            placeholder="Nhập tên flash sale"
            maxLength={300}
            className="w-[400px]"
          />
        </Form.Item>
        <Form.Item
          label="Thời gian diễn ra"
          name="duration"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập thời gian diễn ra flash sale",
            },
          ]}
        >
          <DatePicker.RangePicker
            showTime
            className="max-w-[400px]"
            disabledDate={disabledDate}
            disabledTime={disabledRangeTime}
          />
        </Form.Item>
      </Form>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Danh sách sách trong Flash Sale</h2>
        <Button
          icon={<PlusOutlined />}
          onClick={() => {
            setModalVisible(true);
            setSelectedRowKeys(items?.map((item) => item?.book?.id));
          }}
        >
          Thêm sách
        </Button>
      </div>

      <Table
        dataSource={items}
        columns={itemColumns}
        rowKey="id"
        pagination={false}
        bordered
      />

      <div className="text-right">
        <Button
          className="mr-3 h-[34px]"
          onClick={() => navigate("/flash_sales")}
        >
          Quay lại
        </Button>
        <Button type="primary" onClick={handleCreateFlashSale}>
          Tạo mới flash sale
        </Button>
      </div>

      <Modal
        open={modalVisible}
        title="Chọn sách để thêm"
        onCancel={() => setModalVisible(false)}
        onOk={handleAddBooks}
        okText="Thêm"
        width={1000}
        cancelText="Hủy"
      >
        <div className="mb-4 flex gap-4">
          <Input.Search
            placeholder="Tìm kiếm sách"
            onSearch={(e: any) => setFilter({ ...filter, keyword: e })}
            className="w-[300px]"
          />
          <Select
            allowClear
            placeholder="Chọn danh mục"
            className="w-48"
            onChange={(value) => setFilter({ ...filter, categoryId: value })}
            options={listCategories?.data?.categories?.map((item: any) => ({
              label: item?.name,
              value: item?.id,
            }))}
          />
        </div>
        <TableCommon
          loading={isFetching}
          rowKey="_id"
          rowSelection={{
            selectedRowKeys,
            preserveSelectedRowKeys: true,
            onChange: (newSelectedRowKeys: React.Key[]) => {
              console.log(newSelectedRowKeys, "check selected");
              setSelectedRowKeys(newSelectedRowKeys);
            },
          }}
          dataSource={data?.data?.books || []}
          columns={bookColumns}
          pagination={{
            showSizeChanger: true,
            total: data?.data?.pagination?.totalItems,
            current: filter.page,
            pageSize: filter.limit,
            onChange: (page, pageSize) => {
              setFilter({ ...filter, page, limit: pageSize });
            },
          }}
          scroll={{ x: 800, y: 300 }}
        />
      </Modal>
    </div>
  );
};

export default CreateNewShopBooksPage;
