import { useState, useMemo, useCallback } from 'react';
import { DataGrid } from 'react-data-grid';
import type { Column, RenderEditCellProps } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import styles from './EditableQuotationGrid.module.scss';
import { Button } from '@shared/components/Button';
import { PlusIcon, TrashIcon } from 'lucide-react';

// Type for editable quotation line item
export interface EditableLineItem {
  id: string;
  chargeName: string;
  hsnCode: string;
  price: number;
  currency: string;
  quantity: number;
  totalAmount?: number;
}

interface EditableQuotationGridProps {
  data: EditableLineItem[];
  onDataChange?: (updatedData: EditableLineItem[]) => void;
  readOnly?: boolean;
}

// Custom text editor
function TextEditor({ row, column, onRowChange, onClose }: RenderEditCellProps<EditableLineItem>) {
  return (
    <input
      className={styles.cellInput}
      autoFocus
      value={row[column.key as keyof EditableLineItem] as string}
      onChange={(e) => onRowChange({ ...row, [column.key]: e.target.value })}
      onBlur={() => onClose(true, false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onClose(true, false);
        } else if (e.key === 'Escape') {
          onClose(false, false);
        }
      }}
    />
  );
}

// Custom number editor
function NumberEditor({ row, column, onRowChange, onClose }: RenderEditCellProps<EditableLineItem>) {
  return (
    <input
      className={styles.cellInput}
      type="number"
      autoFocus
      value={row[column.key as keyof EditableLineItem] as number}
      onChange={(e) => {
        const value = parseFloat(e.target.value) || 0;
        onRowChange({ ...row, [column.key]: value });
      }}
      onBlur={() => onClose(true, false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onClose(true, false);
        } else if (e.key === 'Escape') {
          onClose(false, false);
        }
      }}
    />
  );
}

// Custom currency editor
function CurrencyEditor({ row, onRowChange, onClose }: RenderEditCellProps<EditableLineItem>) {
  return (
    <select
      className={styles.cellSelect}
      autoFocus
      value={row.currency}
      onChange={(e) => {
        onRowChange({ ...row, currency: e.target.value });
      }}
      onBlur={() => onClose(true, false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onClose(true, false);
        } else if (e.key === 'Escape') {
          onClose(false, false);
        }
      }}
    >
      <option value="USD">USD</option>
      <option value="INR">INR</option>
      <option value="EUR">EUR</option>
      <option value="GBP">GBP</option>
    </select>
  );
}

export default function EditableQuotationGrid({ data, onDataChange, readOnly = false }: EditableQuotationGridProps) {
  const [rows, setRows] = useState<EditableLineItem[]>(data);
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<string>>(new Set());

  // Update rows when data prop changes
  useMemo(() => {
    setRows(data);
  }, [data]);

  const columns: Column<EditableLineItem>[] = useMemo(
    () => [
      {
        key: 'chargeName',
        name: 'Charge Name',
        width: 300,
        resizable: true,
        sortable: true,
        editable: !readOnly,
        renderEditCell: TextEditor,
      },
      {
        key: 'hsnCode',
        name: 'HSN Code',
        width: 200,
        resizable: true,
        sortable: true,
        editable: !readOnly,
        renderEditCell: TextEditor,
      },
      {
        key: 'price',
        name: 'Price',
        width: 200,
        resizable: true,
        sortable: true,
        editable: !readOnly,
        renderEditCell: NumberEditor,
        renderCell: ({ row }) => (
          <div className={styles.priceCell}>
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: row.currency || 'USD',
            }).format(row.price || 0)}
          </div>
        ),
      },
      {
        key: 'currency',
        name: 'Currency',
        width: 200,
        resizable: true,
        sortable: true,
        editable: !readOnly,
        renderEditCell: CurrencyEditor,
      },
      {
        key: 'quantity',
        name: 'Quantity',
        width: 120,
        resizable: true,
        sortable: true,
        editable: !readOnly,
        renderEditCell: NumberEditor,
      },
      {
        key: 'totalAmount',
        name: 'Total Amount',
        width: 180,
        resizable: true,
        sortable: true,
        editable: false,
        renderCell: ({ row }) => {
          const total = (row.price || 0) * (row.quantity || 0);
          return (
            <div className={styles.totalCell}>
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: row.currency || 'USD',
              }).format(total)}
            </div>
          );
        },
      },
    ],
    [readOnly]
  );

  const handleRowsChange = useCallback(
    (updatedRows: EditableLineItem[]) => {
      // Calculate total amount for changed rows
      const rowsWithTotal = updatedRows.map((row) => ({
        ...row,
        totalAmount: (row.price || 0) * (row.quantity || 0),
      }));

      setRows(rowsWithTotal);
      onDataChange?.(rowsWithTotal);
    },
    [onDataChange]
  );

  const handleAddRow = useCallback(() => {
    const newRow: EditableLineItem = {
      id: `new-${Date.now()}`,
      chargeName: '',
      hsnCode: '',
      price: 0,
      currency: 'USD',
      quantity: 1,
      totalAmount: 0,
    };
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
    onDataChange?.(updatedRows);
  }, [rows, onDataChange]);

  const handleDeleteSelected = useCallback(() => {
    const updatedRows = rows.filter((row) => !selectedRows.has(row.id));
    setRows(updatedRows);
    setSelectedRows(new Set());
    onDataChange?.(updatedRows);
  }, [rows, selectedRows, onDataChange]);

  const rowKeyGetter = useCallback((row: EditableLineItem) => row.id, []);

  return (
    <div className={styles.spreadsheetContainer}>
      <div className={styles.toolbar}>
        <div className={styles.info}>
          <span className={styles.recordCount}>
            {rows.length} {rows.length === 1 ? 'line item' : 'line items'}
          </span>
          {!readOnly && <span className={styles.hint}>💡 Double-click or press Enter on a cell to edit</span>}
        </div>
        {!readOnly && (
          <div className={styles.actions}>
            <Button onClick={handleAddRow}>
              <PlusIcon size={16} className="mr-1" />
              Add Line Item
            </Button>
            {selectedRows.size > 0 && (
              <Button onClick={handleDeleteSelected}>
                <TrashIcon size={16} className="mr-1" />
                Delete ({selectedRows.size})
              </Button>
            )}
          </div>
        )}
      </div>
      <DataGrid
        className={styles.dataGrid}
        columns={columns}
        rows={rows}
        onRowsChange={handleRowsChange}
        rowKeyGetter={rowKeyGetter}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        defaultColumnOptions={{
          sortable: true,
          resizable: true,
        }}
        style={{ height: rows.length > 0 ? `${rows.length * 35 + 40}px` : '200px' }}
        renderers={{
          noRowsFallback: <div style={{ textAlign: 'center', padding: '20px' }}>No line items</div>,
        }}
      />
    </div>
  );
}
