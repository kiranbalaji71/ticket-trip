"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";

import type {
  DataTableProps,
  SortDirection,
  TableAccessor,
  TableColumn,
} from "./types";

function getValue<T>(row: T, accessor?: TableAccessor<T>): unknown {
  if (!accessor) {
    return undefined;
  }

  if (typeof accessor === "function") {
    return accessor(row);
  }

  return row[accessor];
}

function compareValues(a: unknown, b: unknown): number {
  if (a === b) {
    return 0;
  }

  if (a == null) {
    return 1;
  }

  if (b == null) {
    return -1;
  }

  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }

  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function getAlignmentClass(align: TableColumn<unknown>["align"]): string {
  switch (align) {
    case "center":
      return "text-center";

    case "right":
      return "text-right";

    default:
      return "text-left";
  }
}

function SortIcon({ direction }: { direction?: SortDirection }) {
  if (!direction) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4 opacity-30"
      >
        <path
          fillRule="evenodd"
          d="M10 3a.75.75 0 0 1 .75.75v10.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3.75A.75.75 0 0 1 10 3Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  return direction === "asc" ? (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path
        fillRule="evenodd"
        d="M10 3a.75.75 0 0 1 .75.75v10.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3.75A.75.75 0 0 1 10 3Z"
        clipRule="evenodd"
      />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4 rotate-180"
    >
      <path
        fillRule="evenodd"
        d="M10 3a.75.75 0 0 1 .75.75v10.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3.75A.75.75 0 0 1 10 3Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Checkbox({
  checked,
  indeterminate = false,
  onChange,
  label,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  label: string;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      ref={(element) => {
        if (element) {
          element.indeterminate = indeterminate;
        }
      }}
      onChange={onChange}
      aria-label={label}
      className="
        h-4 w-4 rounded border-gray-300
        text-orange-600
        accent-orange-600
        focus:ring-2 focus:ring-orange-500 focus:ring-offset-1
        dark:border-gray-600
        dark:bg-gray-800
      "
    />
  );
}

export default function DataTable<T>({
  columns,
  data,
  getRowId = (_, index) => String(index),
  sortable = false,
  pagination = false,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50],
  loading = false,
  error = null,
  emptyMessage = "No data available.",
  loadingRows = 5,
  selectable = false,
  selectedRowIds = [],
  onSelectionChange,
  onRowClick,
  actions = [],
  caption,
  className = "",
  tableClassName = "",
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [data.length, currentPageSize, sortColumn, sortDirection]);

  const sortedData = useMemo(() => {
    if (!sortable || !sortColumn) {
      return data;
    }

    const column = columns.find((item) => item.id === sortColumn);

    if (!column?.sortable || !column.accessor) {
      return data;
    }

    return [...data].sort((a, b) => {
      const result = compareValues(
        getValue(a, column.accessor),
        getValue(b, column.accessor),
      );

      return sortDirection === "asc" ? result : -result;
    });
  }, [data, columns, sortable, sortColumn, sortDirection]);

  const totalPages = pagination
    ? Math.max(1, Math.ceil(sortedData.length / currentPageSize))
    : 1;

  const paginatedData = useMemo(() => {
    if (!pagination) {
      return sortedData;
    }

    const start = (currentPage - 1) * currentPageSize;

    return sortedData.slice(start, start + currentPageSize);
  }, [sortedData, pagination, currentPage, currentPageSize]);

  const visibleRowIds = paginatedData.map((row, index) => getRowId(row, index));

  const selectedVisibleCount = visibleRowIds.filter((id) =>
    selectedRowIds.includes(id),
  ).length;

  const allVisibleSelected =
    visibleRowIds.length > 0 && selectedVisibleCount === visibleRowIds.length;

  const someVisibleSelected = selectedVisibleCount > 0 && !allVisibleSelected;

  const handleSort = (column: TableColumn<T>) => {
    if (!sortable || !column.sortable || !column.accessor) {
      return;
    }

    if (sortColumn === column.id) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortColumn(column.id);
    setSortDirection("asc");
  };

  const handleRowSelection = (rowId: string) => {
    if (!onSelectionChange) {
      return;
    }

    const isSelected = selectedRowIds.includes(rowId);

    onSelectionChange(
      isSelected
        ? selectedRowIds.filter((id) => id !== rowId)
        : [...selectedRowIds, rowId],
    );
  };

  const handleSelectAll = () => {
    if (!onSelectionChange) {
      return;
    }

    if (allVisibleSelected) {
      onSelectionChange(
        selectedRowIds.filter((id) => !visibleRowIds.includes(id)),
      );
      return;
    }

    const nextSelected = new Set(selectedRowIds);

    visibleRowIds.forEach((id) => {
      nextSelected.add(id);
    });

    onSelectionChange([...nextSelected]);
  };

  const handlePageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrentPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const startItem =
    sortedData.length === 0 ? 0 : (currentPage - 1) * currentPageSize + 1;

  const endItem = Math.min(currentPage * currentPageSize, sortedData.length);

  const hasActions = actions.length > 0;

  return (
    <div
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 ${className}`}
    >
      <div className="overflow-x-auto">
        <table
          className={`min-w-full divide-y divide-gray-200 dark:divide-gray-800 ${tableClassName}`}
          aria-busy={loading}
          aria-describedby={caption ? undefined : undefined}
        >
          {caption && <caption className="sr-only">{caption}</caption>}

          <thead className="bg-gray-50 dark:bg-gray-900/80">
            <tr>
              {selectable && (
                <th scope="col" className="w-12 px-4 py-3">
                  <Checkbox
                    checked={allVisibleSelected}
                    indeterminate={someVisibleSelected}
                    onChange={handleSelectAll}
                    label="Select all rows"
                  />
                </th>
              )}

              {columns.map((column) => {
                const isSorted = sortColumn === column.id;

                const alignmentClass = getAlignmentClass(column.align);

                return (
                  <th
                    key={column.id}
                    scope="col"
                    aria-sort={
                      isSorted
                        ? sortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : undefined
                    }
                    className={`
                      px-4 py-3
                      text-xs font-semibold uppercase
                      tracking-wider text-gray-500
                      dark:text-gray-400
                      ${alignmentClass}
                      ${column.className ?? ""}
                    `}
                  >
                    {column.sortable && sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(column)}
                        className="
                          inline-flex items-center gap-1.5
                          rounded-md px-1 py-1
                          -mx-1
                          transition-colors
                          hover:bg-gray-100
                          hover:text-gray-900
                          focus:outline-none
                          focus:ring-2
                          focus:ring-orange-500
                          dark:hover:bg-gray-800
                          dark:hover:text-white
                        "
                      >
                        <span>{column.header}</span>

                        <SortIcon
                          direction={isSorted ? sortDirection : undefined}
                        />
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}

              {hasActions && (
                <th
                  scope="col"
                  className="w-28 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {/* Loading */}
            {loading &&
              Array.from({ length: loadingRows }).map((_, index) => (
                <tr key={`loading-${index}`}>
                  {selectable && (
                    <td className="px-4 py-4">
                      <div className="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    </td>
                  )}

                  {columns.map((column) => (
                    <td key={column.id} className="px-4 py-4">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    </td>
                  ))}

                  {hasActions && (
                    <td className="px-4 py-4">
                      <div className="ml-auto h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    </td>
                  )}
                </tr>
              ))}

            {/* Error */}
            {!loading && error && (
              <tr>
                <td
                  colSpan={
                    columns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0)
                  }
                  className="px-6 py-16 text-center"
                >
                  <div role="alert" className="flex flex-col items-center">
                    <div className="mb-3 rounded-full bg-red-50 p-3 dark:bg-red-950/40">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-5 w-5 text-red-600 dark:text-red-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m0 3.75h.008M10.29 3.86 2.82 17.25A1.5 1.5 0 0 0 4.13 19.5h15.74a1.5 1.5 0 0 0 1.31-2.25L13.71 3.86a1.5 1.5 0 0 0-2.62 0Z"
                        />
                      </svg>
                    </div>

                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Unable to load data
                    </p>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {error}
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {/* Empty */}
            {!loading && !error && paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={
                    columns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0)
                  }
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-900">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-6 w-6 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20.25 7.5v9a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25v-9A2.25 2.25 0 0 1 6 5.25h12a2.25 2.25 0 0 1 2.25 2.25ZM3.75 9h16.5"
                        />
                      </svg>
                    </div>

                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {emptyMessage}
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {/* Data */}
            {!loading &&
              !error &&
              paginatedData.map((row, rowIndex) => {
                const rowId = getRowId(row, rowIndex);
                const isSelected = selectedRowIds.includes(rowId);

                return (
                  <tr
                    key={rowId}
                    aria-selected={selectable ? isSelected : undefined}
                    onClick={() => onRowClick?.(row)}
                    className={`
                      group
                      transition-colors
                      hover:bg-gray-50
                      dark:hover:bg-gray-900/60
                      ${isSelected ? "bg-orange-50 dark:bg-orange-950/20" : ""}
                      ${onRowClick ? "cursor-pointer" : ""}
                    `}
                  >
                    {selectable && (
                      <td
                        className="px-4 py-4"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleRowSelection(rowId)}
                          label={`Select row ${rowId}`}
                        />
                      </td>
                    )}

                    {columns.map((column) => {
                      const value = getValue(row, column.accessor);

                      return (
                        <td
                          key={column.id}
                          className={`
                            whitespace-nowrap
                            px-4 py-4
                            text-sm text-gray-700
                            dark:text-gray-300
                            ${getAlignmentClass(column.align)}
                            ${column.className ?? ""}
                          `}
                        >
                          {column.cell
                            ? column.cell(row, rowIndex)
                            : value != null
                              ? String(value)
                              : "—"}
                        </td>
                      );
                    })}

                    {hasActions && (
                      <td
                        className="px-4 py-4"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <div className="flex justify-end gap-1">
                          {actions.map((action) => {
                            const disabled = action.disabled?.(row) ?? false;

                            return (
                              <button
                                key={action.label}
                                type="button"
                                title={action.title ?? action.label}
                                aria-label={action.label}
                                disabled={disabled}
                                onClick={() => action.onClick(row)}
                                className="
                                  inline-flex h-8 w-8
                                  items-center justify-center
                                  rounded-md
                                  text-gray-500
                                  transition-colors
                                  hover:bg-gray-100
                                  hover:text-gray-900
                                  focus:outline-none
                                  focus:ring-2
                                  focus:ring-orange-500
                                  disabled:cursor-not-allowed
                                  disabled:opacity-40
                                  dark:text-gray-400
                                  dark:hover:bg-gray-800
                                  dark:hover:text-white
                                "
                              >
                                {action.icon ?? action.label}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && !loading && !error && (
        <div className="flex flex-col gap-4 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span>
              {startItem}–{endItem} of {sortedData.length}
            </span>

            <label className="flex items-center gap-2">
              <span className="sr-only">Rows per page</span>

              <select
                value={currentPageSize}
                onChange={handlePageSizeChange}
                className="
                  rounded-md
                  border border-gray-300
                  bg-white
                  px-2 py-1.5
                  text-sm text-gray-700
                  outline-none
                  focus:border-orange-500
                  focus:ring-2
                  focus:ring-orange-500
                  dark:border-gray-700
                  dark:bg-gray-900
                  dark:text-gray-300
                "
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size} / page
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-center gap-1" aria-label="Pagination">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="
                rounded-md
                border border-gray-300
                px-3 py-1.5
                text-sm font-medium
                text-gray-700
                transition-colors
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-40
                focus:outline-none
                focus:ring-2
                focus:ring-orange-500
                dark:border-gray-700
                dark:text-gray-300
                dark:hover:bg-gray-800
              "
            >
              Previous
            </button>

            <span
              aria-current="page"
              className="
                min-w-20
                px-3
                py-1.5
                text-center
                text-sm
                text-gray-600
                dark:text-gray-400
              "
            >
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              className="
                rounded-md
                border border-gray-300
                px-3 py-1.5
                text-sm font-medium
                text-gray-700
                transition-colors
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-40
                focus:outline-none
                focus:ring-2
                focus:ring-orange-500
                dark:border-gray-700
                dark:text-gray-300
                dark:hover:bg-gray-800
              "
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
