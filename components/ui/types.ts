export interface CarouselProps {
  images: string[];
  alt?: string;
  className?: string;
  aspectRatio?: string;
}

import type { ReactNode } from "react";

export type TableAccessor<T> = keyof T | ((row: T) => unknown);

export type SortDirection = "asc" | "desc";

export interface TableSortState<T> {
  column: TableColumn<T>;
  direction: SortDirection;
}

export interface TableColumn<T> {
  /**
   * Unique identifier for the column.
   */
  id: string;

  /**
   * Text displayed in the table header.
   */
  header: ReactNode;

  /**
   * Property accessor or function used to retrieve the cell value.
   *
   * Required for sorting.
   */
  accessor?: TableAccessor<T>;

  /**
   * Custom cell renderer.
   */
  cell?: (row: T, index: number) => ReactNode;

  /**
   * Whether this column can be sorted.
   *
   * Defaults to false.
   */
  sortable?: boolean;

  /**
   * Optional column width classes.
   *
   * Example: "w-40"
   */
  className?: string;

  /**
   * Optional alignment.
   */
  align?: "left" | "center" | "right";
}

export interface TableAction<T> {
  /**
   * Button label for accessibility.
   */
  label: string;

  /**
   * Optional tooltip/title.
   */
  title?: string;

  /**
   * Custom action icon.
   */
  icon?: ReactNode;

  /**
   * Called when the action is triggered.
   */
  onClick: (row: T) => void;

  /**
   * Disable action for a specific row.
   */
  disabled?: (row: T) => boolean;
}

export interface DataTableProps<T> {
  /**
   * Table columns.
   */
  columns: TableColumn<T>[];

  /**
   * Table rows.
   */
  data: T[];

  /**
   * Unique row identifier.
   *
   * Defaults to the row index.
   */
  getRowId?: (row: T, index: number) => string;

  /**
   * Enable client-side sorting.
   */
  sortable?: boolean;

  /**
   * Enable pagination.
   */
  pagination?: boolean;

  /**
   * Number of rows per page.
   *
   * Defaults to 10.
   */
  pageSize?: number;

  /**
   * Rows per page options.
   */
  pageSizeOptions?: number[];

  /**
   * Loading state.
   */
  loading?: boolean;

  /**
   * Error message.
   */
  error?: string | null;

  /**
   * Empty-state message.
   */
  emptyMessage?: ReactNode;

  /**
   * Custom loading row count.
   */
  loadingRows?: number;

  /**
   * Enable row selection.
   */
  selectable?: boolean;

  /**
   * Selected row IDs.
   */
  selectedRowIds?: string[];

  /**
   * Called when selected rows change.
   */
  onSelectionChange?: (selectedIds: string[]) => void;

  /**
   * Row click handler.
   */
  onRowClick?: (row: T) => void;

  /**
   * Optional row actions.
   */
  actions?: TableAction<T>[];

  /**
   * Accessible table label.
   */
  caption?: string;

  /**
   * Additional class for the outer container.
   */
  className?: string;

  /**
   * Additional class for the table.
   */
  tableClassName?: string;
}
