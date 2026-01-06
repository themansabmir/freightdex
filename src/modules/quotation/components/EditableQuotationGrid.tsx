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
  cgst?: number;
  sgst?: number;
  igst?: number;
  totalWithGst?: number;
}

interface EditableQuotationGridProps {
  data: EditableLineItem[];
  onDataChange?: (updatedData: EditableLineItem[]) => void;
  readOnly?: boolean;
  exchangeRate?: number;
  onExchangeRateChange?: (rate: number) => void;
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

export default function EditableQuotationGrid({
  data,
  onDataChange,
  readOnly = false,
  exchangeRate = 1,
  onExchangeRateChange,
}: EditableQuotationGridProps) {
  const [rows, setRows] = useState<EditableLineItem[]>(() => {
    // Calculate GST values for initial data
    return data.map((row) => {
      const total = (row.price || 0) * (row.quantity || 0);
      return {
        ...row,
        totalAmount: total,
        cgst: total * 0.09,
        sgst: total * 0.09,
        igst: total * 0.18,
        totalWithGst: total * 1.18,
      };
    });
  });
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<string>>(new Set());

  // Check if any row has INR currency
  const hasINR = useMemo(() => rows.some((row) => row.currency === 'INR'), [rows]);

  // Update rows when data prop changes
  useMemo(() => {
    const rowsWithGst = data.map((row) => {
      const total = (row.price || 0) * (row.quantity || 0);
      return {
        ...row,
        totalAmount: total,
        cgst: total * 0.09,
        sgst: total * 0.09,
        igst: total * 0.18,
        totalWithGst: total * 1.18,
      };
    });
    setRows(rowsWithGst);
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
      {
        key: 'cgst',
        name: 'CGST (9%)',
        width: 150,
        resizable: true,
        sortable: true,
        editable: false,
        renderCell: ({ row }) => {
          const total = (row.price || 0) * (row.quantity || 0);
          const cgst = total * 0.09;
          return (
            <div className={styles.gstCell}>
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: row.currency || 'USD',
              }).format(cgst)}
            </div>
          );
        },
      },
      {
        key: 'sgst',
        name: 'SGST (9%)',
        width: 150,
        resizable: true,
        sortable: true,
        editable: false,
        renderCell: ({ row }) => {
          const total = (row.price || 0) * (row.quantity || 0);
          const sgst = total * 0.09;
          return (
            <div className={styles.gstCell}>
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: row.currency || 'USD',
              }).format(sgst)}
            </div>
          );
        },
      },
      {
        key: 'igst',
        name: 'IGST (18%)',
        width: 150,
        resizable: true,
        sortable: true,
        editable: false,
        renderCell: ({ row }) => {
          const total = (row.price || 0) * (row.quantity || 0);
          const igst = total * 0.18;
          return (
            <div className={styles.gstCell}>
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: row.currency || 'USD',
              }).format(igst)}
            </div>
          );
        },
      },
      {
        key: 'totalWithGst',
        name: 'Total with GST',
        width: 180,
        resizable: true,
        sortable: true,
        editable: false,
        renderCell: ({ row }) => {
          const total = (row.price || 0) * (row.quantity || 0);
          const totalWithGst = total * 1.18; // Total + 18% GST
          return (
            <div className={styles.totalWithGstCell}>
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: row.currency || 'USD',
              }).format(totalWithGst)}
            </div>
          );
        },
      },
    ],
    [readOnly]
  );

  const handleRowsChange = useCallback(
    (updatedRows: EditableLineItem[]) => {
      // Calculate total amount and GST for changed rows
      const rowsWithTotal = updatedRows.map((row) => {
        const total = (row.price || 0) * (row.quantity || 0);
        return {
          ...row,
          totalAmount: total,
          cgst: total * 0.09,
          sgst: total * 0.09,
          igst: total * 0.18,
          totalWithGst: total * 1.18,
        };
      });

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
      cgst: 0,
      sgst: 0,
      igst: 0,
      totalWithGst: 0,
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

  // Calculate grand total in INR if any item is in INR
  const grandTotal = useMemo(() => {
    let totalInINR = 0;
    let totalInUSD = 0;
    let hasINRItems = false;

    rows.forEach((row) => {
      const totalWithGst = row.totalWithGst || 0;
      if (row.currency === 'INR') {
        totalInINR += totalWithGst;
        hasINRItems = true;
      } else {
        totalInUSD += totalWithGst;
      }
    });

    // If any item is in INR, convert USD to INR and show grand total in INR
    if (hasINRItems) {
      const convertedUSD = totalInUSD * exchangeRate;
      return {
        amount: totalInINR + convertedUSD,
        currency: 'INR',
        needsExchangeRate: totalInUSD > 0,
      };
    }

    // Otherwise show in USD
    return {
      amount: totalInUSD,
      currency: 'USD',
      needsExchangeRate: false,
    };
  }, [rows, exchangeRate]);

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
            {hasINR && grandTotal.needsExchangeRate && (
              <div className={styles.exchangeRateInput}>
                <label htmlFor="exchangeRate">USD to INR Rate:</label>
                <input
                  id="exchangeRate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={exchangeRate}
                  onChange={(e) => onExchangeRateChange?.(parseFloat(e.target.value) || 1)}
                  placeholder="Enter rate"
                  className={styles.rateInput}
                />
              </div>
            )}
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
      <div className={styles.dataGridWrapper}>
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
          renderers={{
            noRowsFallback: <div style={{ textAlign: 'center', padding: '20px' }}>No line items</div>,
          }}
        />
      </div>

      {/* Grand Total Section */}
      {rows.length > 0 && (
        <div className={styles.grandTotalSection}>
          <div className={styles.grandTotalLabel}>Grand Total (with GST):</div>
          <div className={styles.grandTotalAmount}>
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: grandTotal.currency,
            }).format(grandTotal.amount)}
          </div>
          {hasINR && grandTotal.needsExchangeRate && exchangeRate === 1 && (
            <div className={styles.exchangeRateWarning}>⚠️ Please provide USD to INR exchange rate</div>
          )}
        </div>
      )}
    </div>
  );
}
