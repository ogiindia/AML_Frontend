import * as React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { chartColors } from './ChartColors';

// @ts-nocheck
export function NGPPieRoundedCorner({ size, show, pieData, isAnimationActive = false }: any) {
  React.useEffect(() => {
    console.log(pieData);
  }, []);


  return (
    <>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name"
            // outerRadius={80} 
            innerRadius="80%"
            outerRadius="100%"
            paddingAngle={5}
            isAnimationActive={isAnimationActive}
            // Corner radius is the rounded edge of each pie slice
            cornerRadius="50%">
            {pieData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={chartColors[index % pieData.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
}
