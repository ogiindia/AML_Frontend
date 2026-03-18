import { Line } from 'ChartJs';
import React, { useEffect, useState } from 'react';

function LineChart({
  label,
  data,
  xLabel,
  hoverBackgroundColor,
  backgroundColor,
}) {
  const [labels, setlabels] = useState([]);
  const [values, setvalues] = useState([]);

  const prepareData = (transactions) => {
    const groupedData = transactions.reduce((acc, { key, value }) => {
      if (!acc || !acc[key]) acc[key] = [];
      acc[key].push(value);
      return acc;
    }, {});

    const labels = Object.keys(groupedData);
    const avgValues = labels.map((type) => {
      return groupedData[type].reduce((sum, score) => sum + score, 0);
    });

    return { labels, avgValues };
  };

  useEffect(() => {
    if (data) {
      const { labels, avgValues } = prepareData(data);
      setlabels(labels);
      setvalues(avgValues);
    }
  }, [data]);

  return (
    <>
      <Line
        data={{
          labels: labels,
          datasets: [
            {
              label: label,
              data: values,
              fill: false,
              backgroundColor: ['#232454', '#4bcd3e'],
            },
          ],
        }}
      />
    </>
  );
}

export default LineChart;
