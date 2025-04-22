import { ColumnDef, OnChangeFn, PaginationState, RowSelectionState, SortingState, Table } from "@tanstack/react-table";

export type ColumnsProps<TData> = {
  table: Table<TData>;
};


export interface PaginationObj {
    pageIndex: number;
    pageSize: number;
}
export interface PaginationProps<TData> {
  pagination: PaginationObj;
  setPagination: OnChangeFn<PaginationState>; // ✅ Corrected Type
  table: Table<TData>;
}


export interface UseTableLogicProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  sortColumnArr: SortingState;
  sortingHandler: OnChangeFn<SortingState>;
  selectedRowsArr: RowSelectionState;
  selectRowsHandler: OnChangeFn<RowSelectionState>;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  rowCount: number;
  getRowId?: (row: TData, index: number) => string;
  enableManualSorting?: boolean;
  enableRowsSelection?: boolean;
}
