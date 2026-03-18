import { Pie } from 'ChartJs';
import React, { useEffect, useState } from 'react';

function PieChart({
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

  const plugins = {
    legend: {
      align: 'center',
      position: 'right',
    },
  };

  const options = {
    plugins: {
      legend: {
        position: 'right',
        align: 'center'
      }
    }
  }

  useEffect(() => {
    if (data) {
      const { labels, avgValues } = prepareData(data);
      setlabels(labels);
      setvalues(avgValues);
    }
  }, [data]);

  return (
    <>
      <div className={`canvas-center`}>

        <Pie
          plugins={plugins}
          options={options}
          data={{
            label: label,
            labels: labels,
            datasets: [
              {
                data: values,
                backgroundColor: ['#232454', '#4bcd3e'],
              },
            ],
          }}
        />
      </div>
    </>
  );
}

export default PieChart;
