import * as React from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { chartColors } from './ChartColors';

const data = [
  {
    name: 'Branch 1',
    total: 100,
  },
  {
    name: 'Branch 2',
    total: 80,
  },
  {
    name: 'Branch 8',
    total: 85,
  },

  {
    name: 'Branch 3',
    total: 70,
  },
  {
    name: 'Branch 20',
    total: 50,
  },
  {
    name: 'Branch 22',
    total: 40,
  },

  {
    name: 'Branch 4',
    total: 40,
  },
  {
    name: 'Branch 5',
    total: 20,
  },
];

export function NGPBar({
  children,
  size,
  show,
  barData,
  dataKey,
  dataValue,
  colorIndex = 0
}: any) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={barData || data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey="total"
          fill={chartColors[colorIndex].toString()}
          radius={[4, 4, 0, 0]}
        />
        <Tooltip />
      </BarChart>
    </ResponsiveContainer>
  );
}
