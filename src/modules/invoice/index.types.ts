import { ColumnDef } from "@tanstack/react-table";

export interface CellProps {
  row: any;
  updateRow: (index: number, data: any) => void;
}

export interface EditableCellProps extends CellProps {
  columnId: string;
}


export interface InvoiceTableProps {
  rows: any[];
  updateRow: (index: number, data: any) => void;
  removeRow: (index: number) => void;
  items: any[];
  columns: ColumnDef<any>[];
}
