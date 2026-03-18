import * as React from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Rectangle,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { chartColors } from './ChartColors';

const data = [
    {
        name: 'Customer 1',
        i4c: 100,
        fri: 70,
        mnrl: 30,
        amt: 0
    },
    {
        name: 'Customer 2',
        i4c: 80,
        fri: 80,
        mnrl: 20,
        amt: 0
    },
    {
        name: 'Cusomer 3',
        i4c: 50,
        fri: 100,
        mnrl: 40,
        amt: 0
    },
    {
        name: 'Customer 4',
        i4c: 20,
        fri: 10,
        mnrl: 150,
        amt: 0
    },
    {
        name: 'Customer 5',
        i4c: 40,
        fri: 10,
        mnrl: 130,
        amt: 0
    },
    {
        name: 'Customer 6',
        i4c: 60,
        fri: 80,
        mnrl: 30,
        amt: 0
    },
    {
        name: 'Customer 7',
        i4c: 90,
        fri: 10,
        mnrl: 70,
        amt: 0
    },
    {
        name: 'Customer 8',
        i4c: 50,
        fri: 50,
        mnrl: 50,
        amt: 0
    }, {
        name: 'Customer 9',
        fri: 60,
        i4c: 60,
        mnrl: 20,
        amt: 0
    },
    {
        name: 'Customer 10',
        fri: 150,
        i4c: 0,
        mnrl: 0,
        amt: 0
    },
];

export function NGPMultiBar({
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
            <BarChart
                // style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
                responsive
                data={data}
                margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis width="auto" />
                <Tooltip />
                <Legend />
                <Bar dataKey="i4c" fill={chartColors[3].toString()} activeBar={<Rectangle fill={chartColors[3].toString()} />} />
                <Bar dataKey="fri" fill={chartColors[4].toString()} activeBar={<Rectangle fill={chartColors[4].toString()} stroke="purple" />} />
                <Bar dataKey="mnrl" fill={chartColors[5].toString()} activeBar={<Rectangle fill={chartColors[5].toString()} stroke="purple" />} />

            </BarChart>
        </ResponsiveContainer>
    );
}
