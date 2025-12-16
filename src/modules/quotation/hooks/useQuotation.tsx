// hooks/useQuotationPage.ts
import { Badge, Checkbox } from '@shared/components';
import Column from '@shared/components/Column';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { EQuotationStatus, IQuotation } from '../index.types';

interface UseQuotationPageProps {
  onViewDetails?: (quotation: IQuotation) => void;
}

function getQuotationVariant(status: EQuotationStatus) {
  switch (status) {
    case EQuotationStatus.REJECTED:
      return 'destructive';
    case EQuotationStatus.ACCEPTED:
      return 'success';
    case EQuotationStatus.SENT:
      return 'primary';
    case EQuotationStatus.DRAFT:
      return 'warning';
    default:
      return 'neutral';
  }
}

export const useQuotationPage = ({ onViewDetails }: UseQuotationPageProps = {}) => {
  const columns: ColumnDef<IQuotation>[] = [
    {
      id: '_id',
      size: 1,
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
      cell: ({ row }) => (
        <Badge
          id={row.original._id}
          shape="ellipse"
          size="small"
          label={row.original.status}
          tagType="chip"
          variant={getQuotationVariant(row.original.status)}
        />
      ),
    },
    {
      accessorKey: 'validFrom',
      header: ({ header }) => <Column header={header} title="Valid From" />,
      cell: ({ row }) => {
        const d = row.original.validFrom ? new Date(row.original.validFrom) : null;
        return <span>{d ? d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</span>;
      },
    },
    {
      accessorKey: 'validTo',
      header: ({ header }) => <Column header={header} title="Valid To" />,
      cell: ({ row }) => {
        const d = row.original.validTo ? new Date(row.original.validTo) : null;
        return <span>{d ? d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</span>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Eye
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails?.(row.original);
          }}
          size={18}
        />
      ),
    },
  ];

  return { columns };
};

export default useQuotationPage;
