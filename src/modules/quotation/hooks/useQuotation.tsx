// hooks/useQuotationPage.ts
import { ColumnDef } from '@tanstack/react-table';
import Column from '@shared/components/Column';
import { Checkbox, Typography } from '@shared/components';
import { IQuotation } from '../index.types';

export const useQuotationPage = () => {
  const columns: ColumnDef<IQuotation>[] = [
    {
      id: '_id',
      size: 4,
      header: ({ table }) => <Checkbox checked={table.getIsAllRowsSelected()} onChange={table.getToggleAllRowsSelectedHandler()} />,
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onChange={() => row.toggleSelected()} />,
    },
    {
      accessorKey: 'quotationNumber',
      header: ({ header }) => <Column header={header} title="Quotation No." />,
    },
    {
      accessorKey: 'customerName',
      header: ({ header }) => <Column header={header} title="Customer Name" />,
    },
    {
      accessorKey: 'tradeType',
      header: ({ header }) => <Column header={header} title="Trade Type" />,
    },
    {
      accessorKey: 'containerSize',
      header: ({ header }) => <Column header={header} title="Size" />,
    },
    {
      accessorKey: 'containerType',
      header: ({ header }) => <Column header={header} title="Type" />,
    },
    {
      accessorKey: 'status',
      header: ({ header }) => <Column header={header} title="Status" />,
      cell: ({ row }) => <Typography variant="sm">{row.original.status}</Typography>,
    },
    {
      accessorKey: 'validFrom',
      header: ({ header }) => <Column header={header} title="Valid From" />,
      cell: ({ row }) => {
        const d = row.original.validFrom ? new Date(row.original.validFrom) : null;
        return <span>{d ? d.toISOString().slice(0, 10) : ''}</span>;
      },
    },
    {
      accessorKey: 'validTo',
      header: ({ header }) => <Column header={header} title="Valid To" />,
      cell: ({ row }) => {
        const d = row.original.validTo ? new Date(row.original.validTo) : null;
        return <span>{d ? d.toISOString().slice(0, 10) : ''}</span>;
      },
    },
  ];

  return { columns };
};

export default useQuotationPage;
