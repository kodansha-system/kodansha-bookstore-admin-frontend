"use client";

import { Table, Image, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

const { Paragraph } = Typography;

interface BookItem {
  book_id: {
    id: string;
    name: string;
    images?: string[];
  };
  image?: string;
  name?: string;
  price: number;
  quantity: number;
}

interface BookTableProps {
  books: BookItem[];
  onReviewProduct?: (bookId: string) => void;
  isOrderCompleted?: boolean;
  reviewedBookIds?: string[];
}

const BookTable = ({ books }: BookTableProps) => {
  const columns: ColumnsType<BookItem> = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (_, item) => (
        <Image
          src={item?.image || item?.book_id?.images?.[0]}
          alt="book"
          width={80}
          height={100}
          style={{
            objectFit: "cover",
            borderRadius: 8,
            border: "1px solid #f0f0f0",
            padding: 4,
          }}
          preview={false}
        />
      ),
    },
    {
      title: "Tên sách",
      dataIndex: "name",
      key: "name",
      render: (_, item) => (
        <Paragraph
          ellipsis={{ rows: 2 }}
          style={{
            marginBottom: 0,
            cursor: "pointer",
            color: "#1f1f1f",
            minWidth: 200,
            wordBreak: "break-word",
          }}
        >
          {item.name || item?.book_id?.name}
        </Paragraph>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <span style={{ color: "red" }}>{price.toLocaleString()}đ</span>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
    },
    {
      title: "Thành tiền",
      key: "total",
      width: 140,
      render: (_, item) => (
        <span style={{ color: "red" }}>
          {(item.price * item.quantity).toLocaleString()}đ
        </span>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={books}
      rowKey={(record) => record.book_id.id}
      pagination={false}
      className="w-full"
      bordered
    />
  );
};

export default BookTable;
