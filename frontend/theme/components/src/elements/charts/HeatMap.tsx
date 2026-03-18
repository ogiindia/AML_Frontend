import React from 'react';
import { HeatMapGrid } from 'react-grid-heatmap';

// Example: 24 hours (columns) × 5 users (rows)
const xLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
const yLabels = ['UPI', 'ATM', 'CC', 'MB', 'IB'];

// Random data: [user][hour] = transaction count
const data = [
  [2, 3, 1, 0, 0, 1, 2, 3, 4, 5, 2, 1, 0, 0, 1, 2, 3, 4, 5, 2, 1, 0, 0, 1],
  [1, 0, 2, 3, 4, 5, 2, 1, 0, 0, 1, 2, 3, 4, 5, 2, 1, 0, 0, 1, 2, 3, 4, 5],
  [0, 1, 2, 3, 4, 5, 2, 1, 0, 0, 1, 2, 3, 4, 5, 2, 1, 0, 0, 1, 2, 3, 4, 5],
  [2, 1, 0, 0, 1, 2, 3, 4, 5, 2, 1, 0, 0, 1, 2, 3, 4, 5, 2, 1, 0, 0, 1, 2],
  [3, 4, 5, 2, 1, 0, 0, 1, 2, 3, 4, 5, 2, 1, 0, 0, 1, 2, 3, 4, 5, 2, 1, 0],
];

// const data = new Array(yLabels.length)
//   .fill(0)
//   .map(() =>
//     new Array(xLabels.length)
//       .fill(0)
//       .map(() => Math.floor(Math.random() * 5 + 5)),
//   );

// const xLabels = new Array(24).fill(0).map((_, i) => `${i}`);
// const yLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
// const data = new Array(yLabels.length)
//   .fill(0)
//   .map(() =>
//     new Array(xLabels.length)
//       .fill(0)
//       .map(() => Math.floor(Math.random() * 5 + 5)),
//   );

export function NGPHeatMap() {
  return (
    // <HeatMapGrid
    //   data={data}
    //   xLabels={xLabels}
    //   yLabels={yLabels}
    //   // Reder cell with tooltip
    //   cellRender={(x, y, value) => (
    //     <div title={`Pos(${x}, ${y}) = ${value}`}>{value}</div>
    //   )}
    //   xLabelsStyle={(index) => ({
    //     color: index % 2 ? 'transparent' : '#777',
    //     fontSize: '.65rem',
    //   })}
    //   yLabelsStyle={() => ({
    //     fontSize: '.65rem',
    //     textTransform: 'uppercase',
    //     color: '#777',
    //   })}
    //   cellStyle={(_x, _y, ratio) => ({
    //     background: `rgb(12, 160, 44, ${ratio})`,
    //     fontSize: '.7rem',
    //     color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`,
    //   })}
    //   cellHeight="1.5rem"
    //   xLabelsPos="bottom"
    // />

    <HeatMapGrid
      data={data}
      xLabels={xLabels}
      yLabels={yLabels}
      // Reder cell with tooltip
      cellRender={(x, y, value) => (
        <div title={`${yLabels[x]} | ${xLabels[y]} = ${value}`}>{value}</div>
      )}
      xLabelsStyle={(index) => ({
        color: index % 2 ? 'transparent' : '#777',
        fontSize: '.65rem',
      })}
      yLabelsStyle={() => ({
        fontSize: '.65rem',
        textTransform: 'uppercase',
        color: '#777',
      })}
      cellStyle={(_x, _y, ratio) => ({
        background: `rgb(12, 160, 44, ${ratio})`,
        fontSize: '.7rem',
        color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`,
      })}
      cellHeight="1.5rem"
      xLabelsPos="bottom"
      onClick={(x, y) => alert(`Clicked (${x}, ${y})`)}
    />
  );
}
