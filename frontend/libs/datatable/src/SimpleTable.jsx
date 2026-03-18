import {
  Col,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  PaginationControlled,
} from '@ais/components';
import React from 'react';

/**
 *
 * props:
 * - data : Array<Object> -> Json data
 * - columns : Object mapping key -> {label?: string, render?: (row,index) => jsx}
 */

function SimpleTable({
  data = [],
  columns = {},
  emptyMessage = 'No Data Available',
  maxNestedLength = 100,
  pagination,
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
                    <TableHead key={__index} className={'capitalize p-2'}>
                      {columns[col]?.label || col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {visibleKeys.map((col) => {
                      const colConfig = columns[col];
                      const value = row[col];

                      if (colConfig?.render) {
                        return (
                          <TableCell key={col}>
                            {colConfig.render(row, rowIndex)}
                            {/* dynamic implementation */}
                          </TableCell>
                        );
                      } else {
                        return (
                          <TableCell key={col}>
                            {renderCellValue(row[col])}
                          </TableCell>
                        );
                      }
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {(() => {
              if (!pagination) return null;

              const total =
                typeof pagination.total === 'number'
                  ? pagination.total
                  : Array.isArray(data)
                    ? data.length
                    : 0;

              const pageSize =
                typeof pagination.pageSize === 'number' &&
                  pagination.pageSize > 0
                  ? pagination.pageSize
                  : total || 1;

              const totalPages = Math.max(1, Math.ceil(total / pageSize));

              if (!pagination.onPageChange || totalPages <= 1) return null;

              return (
                <div className="flex justify-end p-2">
                  <PaginationControlled
                    page={pagination.page || 1}
                    totalPages={totalPages}
                    onPageChange={pagination.onPageChange}
                  />
                </div>
              );
            })()}
          </div>
        </Col>
      </>
    </>
  );
}

export default SimpleTable;
