// hooks/useShipmentPage.tsx
import { Checkbox, Typography } from '@shared/components';
import Column from '@shared/components/Column';
import { ColumnDef } from '@tanstack/react-table';
import { IShipment } from '../index.types';

export const useShipmentPage = () => {
  const columns: ColumnDef<IShipment>[] = [
    {
      id: '_id',
      size: 4,
      header: ({ table }) => <Checkbox checked={table.getIsAllRowsSelected()} onChange={table.getToggleAllRowsSelectedHandler()} />,
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onChange={() => row.toggleSelected()} />,
    },
    {
      accessorKey: 'shipment_name',
      header: ({ header }) => <Column header={header} title="Shipment Name" />,
    },
    {
      accessorKey: 'shipment_type',
      header: ({ header }) => <Column header={header} title="Type" />,
      cell: ({ row }) => <Typography variant="sm">{row.original.shipment_type}</Typography>,
    },
    {
      accessorKey: 'shipment_mode',
      header: ({ header }) => <Column header={header} title="Mode" />,
      cell: ({ row }) => <Typography variant="sm">{row.original.shipment_mode || '-'}</Typography>,
    },
    {
      accessorKey: 'trade_type',
      header: ({ header }) => <Column header={header} title="Trade Type" />,
      cell: ({ row }) => <Typography variant="sm">{row.original.trade_type || '-'}</Typography>,
    },
    {
      accessorKey: 'mbl_number',
      header: ({ header }) => <Column header={header} title="MBL Number" />,
      cell: ({ row }) => <span>{row.original.mbl_number || '-'}</span>,
    },
    {
      accessorKey: 'booking_number',
      header: ({ header }) => <Column header={header} title="Booking Number" />,
      cell: ({ row }) => <span>{row.original.booking_number || '-'}</span>,
    },
    {
      accessorKey: 'shipping_line',
      header: ({ header }) => <Column header={header} title="Shipping Line" />,
      cell: ({ row }) => <span>{row.original.shipping_line || '-'}</span>,
    },
    {
      accessorKey: 'port_of_loading',
      header: ({ header }) => <Column header={header} title="POL" />,
      cell: ({ row }) => <span>{row.original.port_of_loading || '-'}</span>,
    },
    {
      accessorKey: 'port_of_discharge',
      header: ({ header }) => <Column header={header} title="POD" />,
      cell: ({ row }) => <span>{row.original.port_of_discharge || '-'}</span>,
    },
    {
      accessorKey: 'eta_pod',
      header: ({ header }) => <Column header={header} title="ETA POD" />,
      cell: ({ row }) => {
        const d = row.original.eta_pod ? new Date(row.original.eta_pod) : null;
        return <span>{d ? d.toISOString().slice(0, 10) : '-'}</span>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ header }) => <Column header={header} title="Created At" />,
      cell: ({ row }) => {
        const d = row.original.createdAt ? new Date(row.original.createdAt) : null;
        return <span>{d ? d.toISOString().slice(0, 10) : '-'}</span>;
      },
    },
  ];

  return { columns };
};

export default useShipmentPage;
