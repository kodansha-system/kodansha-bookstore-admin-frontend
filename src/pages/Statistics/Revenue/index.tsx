import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  data: { ngay: string; doanhthu: number }[];
}

const RevenueLineChart: React.FC<Props> = ({ data }) => {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, bottom: 0, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ngay" />
          <YAxis
            width={90}
            tickFormatter={(value) => `${value.toLocaleString()} đ`}
          />
          <Tooltip
            formatter={(value: number) => `${value.toLocaleString()} đ`}
            labelFormatter={(label) => `Ngày ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="doanhthu"
            name="Doanh thu"
            stroke="#1890ff"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueLineChart;
