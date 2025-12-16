import { useState, useMemo } from 'react';
import { DataGrid } from 'react-data-grid';
import type { Column, RenderEditCellProps } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import styles from './EditableSpreadsheet.module.scss';
import { IDisplayRow } from '@modules/rate_master/index.types';

interface EditableSpreadsheetProps {
  data: IDisplayRow[];
  onDataChange?: (updatedData: IDisplayRow[]) => void;
}

// Custom editor for text cells
function TextEditor({ row, column, onRowChange, onClose }: RenderEditCellProps<IDisplayRow>) {
  return (
    <input
      className={styles.cellEditor}
      autoFocus
      value={row[column.key as keyof IDisplayRow] as string}
      onChange={(e) => onRowChange({ ...row, [column.key]: e.target.value })}
      onBlur={() => onClose(true)}
    />
  );
}

// Custom editor for number cells
function NumberEditor({ row, column, onRowChange, onClose }: RenderEditCellProps<IDisplayRow>) {
  return (
    <input
      className={styles.cellEditor}
      type="number"
      autoFocus
      value={row[column.key as keyof IDisplayRow] as number}
      onChange={(e) => onRowChange({ ...row, [column.key]: parseFloat(e.target.value) || 0 })}
      onBlur={() => onClose(true)}
    />
  );
}

// Custom formatter for price
function PriceFormatter({ row }: { row: IDisplayRow }) {
  return (
    <div className={styles.priceCell}>
      {new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(row.PRICE)}
    </div>
  );
}

export default function EditableSpreadsheet({ data, onDataChange }: EditableSpreadsheetProps) {
  const [rows, setRows] = useState<IDisplayRow[]>(data);

  // Update rows when data prop changes
  useMemo(() => {
    setRows(data);
  }, [data]);

  const columns: Column<IDisplayRow>[] = useMemo(
    () => [
      {
        key: 'SHIPPING_LINE',
        name: 'Shipping Line',
        width: 180,
        resizable: true,
        sortable: true,
        renderEditCell: TextEditor,
      },
      {
        key: 'CONTAINER_TYPE',
        name: 'Container Type',
        width: 140,
        resizable: true,
        sortable: true,
        renderEditCell: TextEditor,
      },
      {
        key: 'CONTAINER_SIZE',
        name: 'Size',
        width: 100,
        resizable: true,
        sortable: true,
        renderEditCell: TextEditor,
      },
      {
        key: 'START_PORT',
        name: 'Start Port',
        width: 150,
        resizable: true,
        sortable: true,
        renderEditCell: TextEditor,
      },
      {
        key: 'END_PORT',
        name: 'End Port',
        width: 150,
        resizable: true,
        sortable: true,
        renderEditCell: TextEditor,
      },
      {
        key: 'CHARGE_NAME',
        name: 'Charge Name',
        width: 200,
        resizable: true,
        sortable: true,
        renderEditCell: TextEditor,
      },
      {
        key: 'HSN_CODE',
        name: 'HSN Code',
        width: 140,
        resizable: true,
        sortable: true,
        renderEditCell: TextEditor,
      },
      {
        key: 'PRICE',
        name: 'Price',
        width: 150,
        resizable: true,
        sortable: true,
        renderEditCell: NumberEditor,
        renderCell: PriceFormatter,
      },
      {
        key: 'EFFECTIVE_FROM',
        name: 'Effective From',
        width: 150,
        resizable: true,
        sortable: true,
        renderEditCell: TextEditor,
      },
      {
        key: 'EFFECTIVE_TO',
        name: 'Effective To',
        width: 150,
        resizable: true,
        sortable: true,
        renderEditCell: TextEditor,
      },
      {
        key: 'TRADE_TYPE',
        name: 'Trade Type',
        width: 120,
        resizable: true,
        sortable: true,
        renderEditCell: TextEditor,
      },
    ],
    []
  );

  const handleRowsChange = (updatedRows: IDisplayRow[]) => {
    setRows(updatedRows);
    onDataChange?.(updatedRows);
  };

  return (
    <div className={styles.spreadsheetContainer}>
      <div className={styles.toolbar}>
        <div className={styles.info}>
          <span className={styles.recordCount}>
            {rows.length} {rows.length === 1 ? 'record' : 'records'}
          </span>
        </div>
      </div>
      <DataGrid
        className={styles.dataGrid}
        columns={columns}
        rows={rows}
        onRowsChange={handleRowsChange}
        rowKeyGetter={(row: IDisplayRow) => `${row.SHIPPING_LINE}-${row.START_PORT}-${row.END_PORT}-${row.CHARGE_NAME}`}
        defaultColumnOptions={{
          sortable: true,
          resizable: true,
        }}
        style={{ height: 'calc(100vh - 350px)' }}
      />
    </div>
  );
}
