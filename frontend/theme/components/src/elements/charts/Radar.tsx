import * as React from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { chartColors } from './ChartColors';

export function NGPRadar({
  children,
  size,
  show,
  radarData,
  dataKey,
  dataValue,
}: any) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="channel" />
        <PolarRadiusAxis />
        <Radar
          name="Transactions"
          dataKey="transactions"
          stroke={chartColors[3].toString()}
          fill={chartColors[3]}
          fillOpacity={0.6}
        />

        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
}
