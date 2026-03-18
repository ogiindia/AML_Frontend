import { Bar } from 'ChartJs';
import React, { useEffect, useState } from 'react';

function Histogram({
  label,
  data,
  xLabel,
  hoverBackgroundColor,
  backgroundColor,
}) {
  const [labels, setlabels] = useState([]);
  const [values, setvalues] = useState([]);

  const prepareRiskScoreData = (transactions) => {
    console.log(transactions);
    const groupedData = transactions.reduce((acc, { key, value }) => {
      console.log(key);
      if (!acc || !acc[key]) acc[key] = [];

      acc[key].push(value);
      return acc;
    }, {});

    const labels = Object.keys(groupedData);
    const avgValues = labels.map((type) => {
      return groupedData[type].reduce((sum, score) => sum + score, 0);
    });

    console.log(labels);
    console.log(avgValues);

    return { labels, avgValues };
  };

  useEffect(() => {
    if (data) {
      const { labels, avgValues } = prepareRiskScoreData(data);
      setlabels(labels);
      setvalues(avgValues);
    }
  }, [data]);

  const options = {
    responsive: true,
    pan: {
      enabled: true,
      mode: 'xy',
    },
    zoom: {
      enabled: true,
      drag: false,
      mode: 'xy',
    },
    scales: {
      x: {
        //   type: "linear",
        offset: false,
        gridLines: {
          offsetGridLines: false,
        },
        title: {
          display: true,
          //   text: "Arrivals per minute"
        },
      },
    },
  };

  return (
    <>
      <Bar
        options={options}
        data={{
          labels: labels,
          datasets: [
            {
              label: label,
              data: values,
              borderWidth: 0.2,
              barPercentage: 1,
              categoryPercentage: 1,
              hoverBackgroundColor: 'darkgray',
              barThickness: 'flex',
              borderColor: 'blac',
              lineTension: 0,
              fill: false,
              borderJoinStyle: 'round',
              backgroundColor: ['#232454', '#4bcd3e'],
            },
          ],
        }}
      />
    </>
  );
}

export default Histogram;
