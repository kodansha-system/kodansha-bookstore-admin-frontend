import { useState } from "react";
import { Card, DatePicker, Row, Col, Statistic, Button } from "antd";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import instance from "@/services/apiRequest";
import RevenueLineChart from "./Revenue";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTopBooks, useTopCustomers } from "@/hooks/statistics";

const { RangePicker } = DatePicker;

const fetchOverview = async (from: string, to: string) => {
  const { data } = await instance.get("/statistics/overview", {
    params: { from, to },
  });
  return data;
};

export default function StatisticsOverview() {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["overview", dateRange],
    queryFn: () =>
      fetchOverview(
        dateRange[0].startOf("day").toISOString(),
        dateRange[1].endOf("day").toISOString()
      ),
  });

  const { data: dataTopBook } = useTopBooks(
    dateRange[0].startOf("day").toISOString(),
    dateRange[1].endOf("day").toISOString()
  );

  const { data: dataTopCustomers } = useTopCustomers(
    dateRange[0].startOf("day").toISOString(),
    dateRange[1].endOf("day").toISOString()
  );

  return (
    <div className="p-4">
      <Row gutter={16} align="middle" className="mb-4">
        <Col>
          <RangePicker
            value={dateRange}
            onChange={(range) => range && setDateRange(range)}
          />
        </Col>
        <Col>
          <Button type="primary" onClick={() => refetch()}>
            Lọc thống kê
          </Button>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={data?.totalOrders || 0}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng doanh thu (₫)"
              value={data?.totalRevenue || 0}
              loading={isLoading}
              precision={0}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Lượt khách mới"
              value={data?.newCustomerCount || 0}
              loading={isLoading}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Doanh thu theo ngày"
        className="mt-6"
        style={{ height: 600 }}
      >
        <RevenueLineChart data={data?.revenueByDate} />
      </Card>

      <Card title="📚 Sách bán chạy nhất" loading={isLoading} className="my-5">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={dataTopBook}>
            <XAxis
              dataKey="bookName"
              interval={0}
              tick={({ x, y, payload }) => {
                const value = payload.value as string;
                const shortText =
                  value.length > 10 ? value.slice(0, 10) + "…" : value;
                return (
                  <text
                    x={x}
                    y={y + 10}
                    textAnchor="middle"
                    fill="#666"
                    fontSize={12}
                  >
                    {shortText}
                    <title>{value}</title>
                  </text>
                );
              }}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalSold" fill="#1890ff" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="👑 Khách hàng chi tiêu nhiều nhất" loading={isLoading}>
        {!dataTopCustomers ? (
          <div style={{ textAlign: "center", padding: "1rem" }}>
            Không có dữ liệu
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350} className="ml-3">
            <LineChart data={dataTopCustomers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="customerName" />
              <YAxis
                width={90}
                tickFormatter={(value) => `${value.toLocaleString()} đ`}
              />
              <Tooltip
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const { customerName, totalSpent } = payload[0].payload;
                    return (
                      <div className="custom-tooltip">
                        <p>{`Khách hàng: ${customerName}`}</p>
                        <p>{`Chi tiêu: ${totalSpent.toLocaleString()} đ`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="totalSpent"
                stroke="#1890ff"
                dot={<CustomDot />}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  return (
    <g>
      <image
        href={payload.avatar}
        x={cx - 12}
        y={cy - 12}
        width={40}
        height={40}
        style={{ borderRadius: "100%", objectFit: "cover" }}
      />
    </g>
  );
};
