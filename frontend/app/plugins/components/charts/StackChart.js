import { Bar } from 'ChartJs';
import React, { useEffect, useState } from 'react';


function StackChart({
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
        const labels = [];
        const groupedMap = {};



        transactions.forEach(({ key, category, value }) => {
            if (!labels.includes(key)) {
                labels.push(key);
            }

            if (!groupedMap[category]) {
                groupedMap[category] = [];
            }
            const tempIndex = labels.indexOf(key);
            groupedMap[category][tempIndex] = value;
        });


        Object.keys(groupedMap).forEach((category) => {
            groupedMap[category] = labels.map((_, index) => groupedMap[category][index] || 0);
        });


        const avgValues = Object.entries(groupedMap).map(([category, data]) => ({
            label: category,
            data,
        }));


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
                stacked: true,
            },
            y: {
                stacked: true,
            }
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

export default StackChart;