import {
    Col,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@ais/components';
import React from 'react';

/**
 *
 * props:
 * - data : Array<Object> -> Json data
 * - columns : Object mapping key -> {label?: string, render?: (row,index) => jsx}
 */

function SpaciousTable({
    data = [],
    columns = {},
    emptyMessage = 'No Data Available',
    maxNestedLength = 100,
}) {
    if (!data || data.length === 0) {
        return <></>; //Yet to optimize
    }

    const hasData = Array.isArray(data) && data.length > 0;

    const dataKeys = hasData ? Object.keys(data[0]) : [];

    const derivedColumns = Array.from(
        new Set([...dataKeys, ...Object.keys(columns)]),
    );

    const visibleKeys = derivedColumns.filter((key) => {
        const col = columns[key];
        if (col?.hidden === true) return false;
        if (col?.show === false) return false;
        return true;
    });

    const renderCellValue = (value) => {
        if (value == null || value === undefined)
            return <span className="text-muted-background">-</span>;
        else if (React.isValidElement(value)) {
            return value;
        } else {
            return <span>{value}</span>;
        }
    };

    return (
        <>
            <>
                <Col span={'auto'} padding={false}>
                    <div className="overflow-auto rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {visibleKeys.map((col, __index) => (
                                        <TableHead key={__index} className={'capitalize p-3'}>
                                            {columns[col]?.label || col}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((row, rowIndex) => (
                                    <TableRow key={rowIndex} className={`p-3 bg-white`}>
                                        {visibleKeys.map((col) => {
                                            const colConfig = columns[col];
                                            const value = row[col];

                                            if (colConfig?.render) {
                                                return (
                                                    <TableCell className={``} key={col}>
                                                        {colConfig.render(row, rowIndex)}
                                                        {/* dynamic implementation */}
                                                    </TableCell>
                                                );
                                            } else {
                                                return (
                                                    <TableCell key={col} className={``}>
                                                        {renderCellValue(row[col])}
                                                    </TableCell>
                                                );
                                            }
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Col>
            </>
        </>
    );
}

export default SpaciousTable;
