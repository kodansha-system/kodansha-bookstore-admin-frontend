import React, { useEffect, useState } from "react";
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
  Image,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useBooks } from "@/hooks/books";
import TableCommon from "@/components/TableCommon";
import { useCategories } from "@/hooks/categories";
import { disabledDate, disabledRangeTime } from "@/utils/common";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useDetailShop } from "@/hooks/shops";
import {
  useDetailShopBooks,
  useEditShopBooks,
  useShopBooks,
} from "@/hooks/shopBooks";

interface Book {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface ShopBookItem {
  key: string;
  book: Book;
  price: number;
  quantity: number;
}

const EditShopBooksPage: React.FC = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState<any[]>([]);
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
  const { id } = useParams();

  const { data: dataBooksShop } = useShopBooks({ shop_id: String(id) });

  useEffect(() => {
    if (dataBooksShop?.data) {
      const initialItems = dataBooksShop.data.map((item: any) => ({
        key: `${item?.book_id?.id}`,
        book: {
          id: item.book_id?.id,
          name: item?.book_id?.name,
        },
        quantity: item.quantity,
        name: "hello",
      }));
      setItems(initialItems);
      console.log(initialItems);
      setSelectedRowKeys(initialItems.map((i) => i?.book?.id));
    }
  }, [dataBooksShop]);

  const updateShopBook = useEditShopBooks();

  const bookColumns: any = [
    { title: "Tên sách", dataIndex: "name" },
    {
      title: "Danh mục",
      dataIndex: "category",
      render: (data: any) => <div>{data?.name}</div>,
    },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      render: (image: any) => {
        return (
          <Image
            src={image?.[0]}
            width={60}
            height={80}
            className="object-cover"
          />
        );
      },
    },
  ];

  const itemColumns: ColumnsType<ShopBookItem> = [
    { title: "STT", render: (_, __, index) => index + 1 },
    { title: "Tên sách", render: (_, record) => record.book.name },
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
          min={0}
        />
      ),
    },
  ];

  const handleAddBooks = () => {
    const listBook = allBooks?.data;
    const uniqueSelectedRowKeys = [...new Set(selectedRowKeys)];

    const newItems = listBook
      .filter((book: any) => {
        return (
          uniqueSelectedRowKeys.includes(book.id) &&
          !items?.some((p: any) => p.key === `${book.id}`)
        );
      })
      .map((book: any) => ({
        key: `${book.id}`,
        book,
        price:
          discountOption === "percent"
            ? Math.floor(book.price * (1 - discountValue / 100))
            : discountValue,
        quantity: 1,
      }));

    setItems((prev = []) => [...prev, ...newItems]);

    setModalVisible(false);

    setSelectedRowKeys((prev) => [
      ...prev,
      ...newItems.map((book: any) => book.book.id),
    ]);
  };

  const handleCreateShopBook = async () => {
    try {
      const listBook = items?.map((item) => {
        return { book_id: item?.book?.id, quantity: item?.quantity };
      });
      updateShopBook.mutate({
        shop_id: id,
        books: listBook,
      });
    } catch (error) {
      message.error("Vui lòng nhập đầy đủ thông tin");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">
        Sửa số lượng sách có tại cửa hàng
      </h1>
      <div className="flex justify-between items-center">
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
        rowKey="key"
        pagination={false}
        bordered
      />

      <div className="text-right">
        <Button className="mr-3 h-[34px]" onClick={() => navigate("/shops")}>
          Quay lại
        </Button>
        <Button type="primary" onClick={handleCreateShopBook}>
          Xác nhận
        </Button>
      </div>

      <Modal
        open={modalVisible}
        title="Chọn sách để thêm"
        onCancel={() => setModalVisible(false)}
        onOk={handleAddBooks}
        okText="Thêm"
        width={1000}
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
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            preserveSelectedRowKeys: true,
            onChange: (newSelectedRowKeys: React.Key[]) => {
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

export default EditShopBooksPage;
