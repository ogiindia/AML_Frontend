import { Doughnut } from 'ChartJs';
import React, { useState } from 'react';

function GaugeChart({
    label,
    value,
    maxValue,
}) {

    const [currentColor, setcurrentColor] = useState('rgb(140, 214, 16)');







    const index = (perc) => {
        return perc < 70 ? 0 : perc < 90 ? 1 : 2;
    }

    // useEffect(() => {
    //     if (data) {
    //         const { labels, avgValues } = prepareData(data);
    //         setlabels(labels);
    //         setvalues(avgValues);
    //     }
    // }, [data]);

    const COLORS = ['rgb(140, 214, 16)', 'rgb(239, 198, 0)', 'rgb(231, 24, 49)'];

    const ddata = {
        datasets: [{
            data: [value, maxValue - value],
            backgroundColor(ctx) {
                if (ctx.type !== 'data') {
                    return;
                }
                if (ctx.index === 1) {
                    return 'rgb(234, 234, 234)';
                }

                setcurrentColor(COLORS[index(ctx.raw)]);

                return currentColor;
            }
        }],
    };



    return (
        <>
            <div className={`canvas-center`} style={{
                //    maxWidth: "300px"
                maxHeight: "300px"
            }}>

                <Doughnut
                    // plugins={plugins}
                    options={{
                        // Provide any additional configuration options supported by the plugin.
                        cutout: '80%',
                        rotation: 270,
                        circumference: 180,
                        layout: {
                            padding: 0
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            tooltip: {
                                enabled: false,
                            },
                            legend: {
                                display: true,
                            },
                        },
                    }}
                    //config={config}
                    data={ddata}
                // annotation={annotation}

                />
                <div style={{
                    position: 'absolute',
                    bottom: '0%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '22px',
                    color: currentColor,
                    fontStyle: "inherit",
                    pointerEvents: 'none' // avoid overlapping chart interactivity
                }}>
                    {value} {label}
                </div>
            </div>
        </>
    );
}

export default GaugeChart;
