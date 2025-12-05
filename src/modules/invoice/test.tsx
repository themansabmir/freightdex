import { useEffect, useState, useCallback } from 'react';
import { InvoiceTable } from './index.components'; // adjust path
import { blankRow } from './utils';
import { useMemo } from 'react';
import Select from 'react-select';
import { ColumnDef } from '@tanstack/react-table';
import { EditableCell, QuantityCell, DiscountCell, CurrencyCell } from './index.components';

export default function App() {
  const [rows, setRows] = useState<any[]>([]);

  const [items] = useState<any[]>([
    // dummy master items
    { _id: '1', name: 'Clothes with clothes clothes Clothes with clothes clothes ', hsn: '1001', unit: 'container', gstPercent: 18 },
    { _id: '2', name: 'Food B', hsn: '2002', unit: 'w/m', gstPercent: 12 },
  ]);

  // ensure at least 2 rows exist initially
  useEffect(() => {
    if (rows.length < 2) {
      setRows((prev) => [...prev, blankRow()]);
    }
  }, [rows]);

  const updateRow = useCallback((idx: number, patch: Partial<any>) => {
    setRows((rs) => {
      const copy = [...rs];
      const updatedRow = { ...copy[idx], ...patch };

      // Perform calculations based on updated values
      const rate = updatedRow.rate || 0;
      const exchangeRate = updatedRow.exchangeRate || 1;
      const quantity = updatedRow.quantity || 0;
      const discount = updatedRow.discount || 0;
      const gstPercent = updatedRow.gstPercent || 0;

      // Calculate Price/Unit = rate * exchange_rate
      updatedRow.pricePerUnit = rate * exchangeRate;

      // Calculate Total Price = rate * exchange_rate * quantity
      const totalPrice = rate * exchangeRate * quantity;

      // Calculate Taxable Amount = Total Price - discount
      updatedRow.taxableAmount = totalPrice - discount;

      // Calculate GST Amount = taxable * (gst% / 100)
      updatedRow.gstAmount = updatedRow.taxableAmount * (gstPercent / 100);

      // Calculate Total with GST = taxable + gst amount
      updatedRow.totalWithGst = updatedRow.taxableAmount + updatedRow.gstAmount;

      copy[idx] = updatedRow;

      // Add new row if this is the last row
      if (idx === copy.length - 1) {
        copy.push({
          id: Date.now() + Math.random(),
          serviceItem: '',
          hsn: '',
          rate: 0,
          currency: 'INR',
          unit: '',
          exchangeRate: 1,
          quantity: 1,
          pricePerUnit: 0,
          discount: 0,
          taxableAmount: 0,
          gstPercent: 0,
          gstAmount: 0,
          totalWithGst: 0,
        });
      }
      return copy;
    });
  }, []);

  const removeRow = useCallback((idx: number) => {
    setRows((rs) => rs.filter((_, i) => i !== idx));
  }, []);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: 'Service Item',
        accessorKey: 'serviceItem',
        cell: ({ row }) => {
          const r = row.original;
          const options = items.map((it: any) => ({
            value: it._id,
            label: it.name,
            hsn: it.hsn,
            unit: it.unit,
            gstPercent: it.gstPercent,
          }));

          const selected = options.find((opt) => opt.value === r.itemId) || null;

          return (
            <Select
              value={selected}
              options={options}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: '32px',
                  height: '100%',
                  width: '100%',
                  minWidth: '350px',
                  border: 'none',
                  boxShadow: 'none',
                  backgroundColor: 'transparent',
                  padding: '0',
                }),
                valueContainer: (base) => ({
                  ...base,
                  padding: '6px 8px', // Match cell padding
                }),
                indicatorsContainer: () => ({ display: 'none' }),
                dropdownIndicator: () => ({ display: 'none' }),
                menu: (base) => ({ ...base, zIndex: 50 }),
              }}
              onChange={(opt: any) => {
                if (!opt) return;
                updateRow(row.index, {
                  itemId: opt.value,
                  serviceItem: opt.label,
                  hsn: opt.hsn,
                  unit: opt.unit,
                  gstPercent: opt.gstPercent,
                });
              }}
              placeholder=""
              classNamePrefix="react-select"
            />
          );
        },
      },
      {
        header: 'HSN',
        accessorKey: 'hsn',
        minSize: 300,

        cell: ({ row }) => <span>{row.original.hsn}</span>,
      },
      {
        header: 'Rate',
        accessorKey: 'rate',
        cell: ({ row }) => <EditableCell row={row} columnId="rate" updateRow={updateRow} />,
      },
      {
        header: 'Currency',
        accessorKey: 'currency',
        cell: ({ row }) => <CurrencyCell row={row} updateRow={updateRow} />,
      },
      {
        header: 'Ex Rate',
        accessorKey: 'exchangeRate',
        cell: ({ row }) => <EditableCell row={row} columnId="exchangeRate" updateRow={updateRow} />,
      },
      {
        header: 'Unit',
        accessorKey: 'unit',
        cell: ({ row }) => <span>{row.original.unit}</span>,
      },
      {
        header: 'Qty',
        accessorKey: 'quantity',
        cell: ({ row }) => <QuantityCell row={row} updateRow={updateRow} />,
      },
      {
        header: 'Price/Unit',
        accessorKey: 'pricePerUnit',
        cell: ({ row }) => <span>{(row.original.pricePerUnit || 0).toFixed(2)}</span>,
      },
      {
        header: 'Discount',
        accessorKey: 'discount',
        cell: ({ row }) => <DiscountCell row={row} updateRow={updateRow} />,
      },
      {
        header: 'Taxable',
        accessorKey: 'taxableAmount',
        cell: ({ row }) => <span>{(row.original.taxableAmount || 0).toFixed(2)}</span>,
      },
      {
        header: 'GST Amount',
        accessorKey: 'gstAmount',
        cell: ({ row }) => (
          <span>
            {(row.original.gstAmount || 0).toFixed(2)} ({row.original.gstPercent}%)
          </span>
        ),
      },
      {
        header: 'Total with GST',
        accessorKey: 'totalWithGst',
        cell: ({ row }) => <span>{(row.original.totalWithGst || 0).toFixed(2)}</span>,
      },
      {
        accessorKey: 'id',
        header: '',
        cell: ({ row }) => <button onClick={() => removeRow(row.index)}>X</button>,
      },
    ],
    [items, updateRow, removeRow]
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Invoice Builder</h1>

      <InvoiceTable rows={rows} updateRow={updateRow} removeRow={removeRow} items={items} columns={columns} />
    </div>
  );
}
