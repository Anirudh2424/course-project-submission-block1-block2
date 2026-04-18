import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
}

export function GenericTable<T>({ data, columns, onRowClick, isLoading }: GenericTableProps<T>) {
  return (
    <div className="w-full overflow-auto rounded-lg border border-slate-200">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8 text-slate-500">
                Loading data...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8 text-slate-500">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, rowIndex) => (
              <TableRow 
                key={rowIndex} 
                onClick={() => onRowClick?.(item)}
                className={onRowClick ? "cursor-pointer hover:bg-slate-50 transition-colors" : ""}
              >
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} className={column.className}>
                    {typeof column.accessor === 'function' 
                      ? column.accessor(item) 
                      : (item[column.accessor] as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
