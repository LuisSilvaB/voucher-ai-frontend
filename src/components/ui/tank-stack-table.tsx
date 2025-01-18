'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  useReactTable,
  getPaginationRowModel,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  flexRender,
} from "@tanstack/react-table";
import Icon from '@/components/ui/icon';
import TankStackPagination from "./tank-stack-pagination";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type TableProps<TData> = {
  data: TData[];
  columns: any[];
  remixIconClass: string;
  onRefetch?: (
    limit: number,
    range: { initialRange: number; finalRange: number },
    orderBy: string,
    direction: "asc" | "desc",
  ) => void;
  countRow?: number;
  emptyMessage?: string;
};

export function TanStackTable<TData>({ data, columns, remixIconClass, emptyMessage }: TableProps<TData>) { 
  const isOpenSideBar = true
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([{
    id: "created_at",
    desc: true,
  }]);

  const table = useReactTable({
    data,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      pagination,
      sorting,
    }
  });

  return (
    <div className="relative flex w-full  flex-1 flex-col">
      <div className="mb-1">
        <TankStackPagination table={table} />
      </div>
      {/* <div className={`flex h-full max-h-[calc(100vh-165px)] w-full ${isOpenSideBar ? "lg:max-w-[calc(100vw-250px)]" : "lg:max-w-[calc(100vw-100px)]"} flex-col overflow-y-auto`}> */}
      <div className={`flex h-full max-h-[calc(100vh-165px)] w-full ${isOpenSideBar ? "lg:max-w-[calc(100vw)]" : "lg:max-w-[calc(100vw-100px)]"} flex-col overflow-y-auto`}>
        <table className="w-full border-collapse rounded-lg">
          <thead className="sticky top-0 z-10 bg-gray-100">
            {table.getHeaderGroups().map((headerGroups, index) => (
              <tr
                key={index}
                className="text-center text-sm uppercase text-gray-700"
              >
                {headerGroups.headers.map((header:any, index) => 
                {
                  return (
                    <th
                      key={index}
                      colSpan={header.colSpan}
                      onClick={() => {
                        if (
                          sorting[0].desc &&
                          header.id === sorting[0].id &&
                          header.column.columnDef.enableSorting
                        ) {
                          setSorting([
                            {
                              id: header.id,
                              desc: false,
                            },
                          ]);
                        } else if (
                          sorting[0].desc &&
                          header.id !== sorting[0].id
                        ) {
                          setSorting([
                            {
                              id: header.id,
                              desc: true,
                            },
                          ]);
                        } else if (
                          !sorting[0].desc &&
                          header.id === sorting[0].id
                        ) {
                          setSorting([
                            {
                              id: header.id,
                              desc: true,
                            },
                          ]);
                        } else if (
                          !sorting[0].desc &&
                          header.id !== sorting[0].id
                        ) {
                          setSorting([
                            {
                              id: header.id,
                              desc: false,
                            },
                          ]);
                        } else {
                          setSorting([
                            {
                              id: header.id,
                              desc: false,
                            },
                          ]);
                        }
                      }}
                      className="sticky top-0 cursor-pointer border-gray-200 bg-gray-100 px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {header.column.columnDef.enableSorting ? (
                        <span className="ml-2">
                          {sorting[0]?.desc && header.id === sorting[0].id
                            ? "↓"
                            : "↑"}
                        </span>
                      ) : null}
                    </th>
                  );

                }
                )}
              </tr>
            ))}
          </thead>
          {table.getRowModel().rows.length ? (
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="text-center text-xs font-medium text-gray-700"
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <td
                      key={index}
                      className="whitespace-nowrap border-b border-gray-200 px-6 py-1.5 text-gray-900"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>
      {/* <div>
        Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
        {table.getRowCount().toLocaleString()} Rows
      </div>
      <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre> */}
      {!table.getRowModel().rows.length ? (
        <div className="relative flex w-full flex-1 flex-col items-center justify-center gap-2 text-gray-500">
          <Icon remixIconClass={remixIconClass} size="5xl" color="gray" />
          <p className="max-w-36 text-center text-xs font-normal text-gray-500">
            {emptyMessage ?? "No hay datos registrados"}
          </p>
        </div>
      ) : null}
      </div>

    </div>
  );
}

export default TanStackTable