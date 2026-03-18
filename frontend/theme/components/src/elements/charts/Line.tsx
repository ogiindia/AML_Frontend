import * as React from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { chartColors } from './ChartColors';

// const ld = [
//   { date: 'Jan', deposit: 10, withdraw: 5 },
//   { date: 'Feb', deposit: 25, withdraw: 15 },
//   { date: 'Mar', deposit: 40, withdraw: 20 },
//   { date: 'Apr', deposit: 301, withdraw: 150 },
//   { date: 'Jun', deposit: 130, withdraw: 60 },
//   { date: 'Jul', deposit: 245, withdraw: 120 },
//   { date: 'Aug', deposit: 470, withdraw: 230 },
//   { date: 'Sep', deposit: 360, withdraw: 180 },
//   { date: 'Oct', deposit: 150, withdraw: 70 },
//   { date: 'Nov', deposit: 245, withdraw: 125 },
//   { date: 'Dec', deposit: 430, withdraw: 210 },
// ];

const ld = [
  { date: 'Jan', count: 10 },
  { date: 'Feb', count: 25 },
  { date: 'Mar', count: 40 },
  { date: 'Apr', count: 301 },
  { date: 'Jun', count: 130 },
  { date: 'Jul', count: 245 },
  { date: 'Aug', count: 470 },
  { date: 'Sep', count: 360 },
  { date: 'Oct', count: 150 },
  { date: 'Nov', count: 245 },
  { date: 'Dec', count: 430 },
];

// ...existing code...
export function NGPLine({
  children,
  size,
  show,
  lineData = ld,
  dataKey,
  dataValue,
  height = 200,
}: any) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={lineData}>
        <XAxis dataKey={dataKey || 'date'} />
        <YAxis />
        <Tooltip />
        {Array.isArray(dataValue) ? (
          dataValue.map((val, index) => (
            <Line
              key={val}
              type="monotone"
              dataKey={val}
              stroke={chartColors[index % chartColors.length]}
            />
          ))
        ) : (
          <Line
            type="monotone"
            dataKey={dataValue || 'count'}
            stroke={chartColors[0]}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );

}
