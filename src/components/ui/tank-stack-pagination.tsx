/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table } from '@tanstack/react-table';
import React from 'react'
import { Button } from './button';
import Icon from './icon';

type TableProps<TData> = {
  table: Table<TData>;
};

const TankStackPagination = ( { table } : TableProps<any>) => {
  return (
    <div className="z-20 flex items-center gap-1 bg-white">
      <Button
        className="h-fit rounded border bg-button p-1"
        onClick={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <Icon remixIconClass="ri-skip-left-line" size="sm" color="white" />
      </Button>

      <Button
        className="h-fit rounded border bg-gray-500 p-1"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <Icon remixIconClass="ri-arrow-left-s-line" size="sm" color="white" />
      </Button>
      <Button
        className="h-fit rounded border bg-gray-500 p-1"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <Icon remixIconClass="ri-arrow-right-s-line" size="sm" color="white" />
      </Button>
      <Button
        className="h-fit rounded border bg-button p-1"
        onClick={() => table.lastPage()}
        disabled={!table.getCanNextPage()}
      >
        <Icon remixIconClass="ri-skip-right-line" size="sm" color="white" />
      </Button>
      <span className="hidden items-center gap-1 lg:flex">
        <p className="text-xs text-gray-600">Page</p>
        <p className="text-xs text-gray-600">
          {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount().toLocaleString()}
        </p>
      </span>
      <span className="flex items-center gap-1">
        <p className="hidden items-center gap-1 text-xs text-gray-600 lg:flex">
          | Ir a la página:
        </p>
        <input
          type="number"
          min="1"
          max={table.getPageCount()}
          defaultValue={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
          }}
          className="h-fit w-10 rounded border p-1"
        />
      </span>
      <select
        className="h-fit rounded border p-1 text-xs text-gray-500"
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TankStackPagination