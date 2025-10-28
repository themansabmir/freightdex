import React, { useCallback, useMemo } from 'react';
import { EditableCellProps, CellProps } from './index.types';
import './invoicestyle.scss';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import { InvoiceTableProps } from './index.types';
import Select from 'react-select';


const EditableCell = React.memo(({ row, columnId, updateRow }: EditableCellProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateRow(row.index, { [columnId]: Number(e.target.value) });
    },
    [row.index, columnId, updateRow]
  );

  return <input type="text" inputMode="numeric" value={row.original[columnId] || ''} onChange={handleChange} />;
});

const QuantityCell = React.memo(({ row, updateRow }: CellProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateRow(row.index, { quantity: Number(e.target.value) });
    },
    [row.index, updateRow]
  );

  return <input type="text" inputMode="numeric" value={row.original.quantity || ''} onChange={handleChange} />;
});

const DiscountCell = React.memo(({ row, updateRow }: CellProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateRow(row.index, { discount: Number(e.target.value) });
    },
    [row.index, updateRow]
  );

  return <input type="text" inputMode="numeric" value={row.original.discount || ''} onChange={handleChange} />;
});

const CurrencyCell = React.memo(({ row, updateRow }: CellProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateRow(row.index, { currency: e.target.value });
    },
    [row.index, updateRow]
  );

  return (
    <select value={row.original.currency || 'INR'} onChange={handleChange}>
      <option>INR</option>
      <option>USD</option>
      <option>EUR</option>
    </select>
  );
});

function InvoiceTable({ rows, columns }: InvoiceTableProps) {
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="invoice-table">
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((h) => (
              <th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((r, index) => (
          <tr key={r.original._id || `row-${index}`}>
            {r.getVisibleCells().map((cell) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const getColumns  =(items:any[], updateRow:any, removeRow:any) :ColumnDef<any>[]=>{
  return [
      {
        header: 'Service Item',
        accessorKey: 'serviceItem',
        cell: ({ row }) => {
          const r = row.original;
          const selected = useMemo(() => items.find((opt) => opt._id === r.itemId) || null, [r.itemId, items]);
          return (
            <Select
              value={selected}
              options={items}
              getOptionLabel={(option) => option.fieldName}
              getOptionValue={(option) => option.itemId}
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
                  itemId: opt.itemId,
                  serviceItem: opt.fieldName,
                  hsn_code: opt.hsn_code,
                  unit: opt.unit,
                  gstPercent: opt.gst,
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
        accessorKey: 'hsn_code',
        minSize: 300,

        cell: ({ row }) => {
          return<span style={{color:'black'}}>{row.original.hsn_code}</span>}
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
        accessorKey: 'gstPercent',
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
    ]
  
}

export const selectedBillingPartyDetails = (selectedDocument: any) => {
  console.log("DOC",selectedDocument)
  const { vendor_name, locations } = selectedDocument?.billing_party;
  const location = locations?.filter((i: any) => i._id === selectedDocument?.billing_party_address)[0];
  const { address, city, state, pin_code, gst_number, mobile_number, pan_number, country } = location;
  return {
    city,
    address,
    state,
    country,
    pin_code,
    mobile_number,
    gst_number,
    pan_number,
    vendor_name,
  };
};

  const renderSelectedDocument = ({vendor_name, mobile_number, address, city, state, pin_code, gst_number, pan_number}: any) => {
    return (
      <>
        <div className="billing-info mt-6">
          <h3>Bill To:</h3>
          <div className="customer-details">
            <strong>{vendor_name || 'Customer Name'}</strong>
            <p>Mobile: {mobile_number}</p>
            <p>
              Address: {address}, {city}, {state} - {pin_code}
              <br />
              {state} - {pin_code}
              <br />
              <strong>PAN: {pan_number}</strong>
              <strong>GST: {gst_number}</strong>
            </p>
          </div>
        </div>
      </>
    );
  };

export { EditableCell, QuantityCell, DiscountCell, CurrencyCell, InvoiceTable , getColumns, renderSelectedDocument};
