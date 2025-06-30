import { FieldSchema } from '@generator/form/index.types';
import { Checkbox } from '@shared/components';
import Column from '@shared/components/Column';
import { ColumnDef } from '@tanstack/react-table';
import { EAirport, IAirport } from '../index.types';

export const useAirportPage = () => {
  const payload: IAirport = {
    _id: '',
    airport_name: '',
    airport_code: '',
  };

  const formSchema: FieldSchema[] = [
    {
      name: EAirport.airport_name,
      label: 'Airport Name',
      type: 'text',
      required: true,
    },
    {
      name: EAirport.airport_code,
      label: 'Airport Code',
      type: 'text',
      required: true,
    },
  ];

  const columns: ColumnDef<IAirport>[] = [
    {
      id: '_id',
      size: 4,
      header: ({ table }) => (
        <Checkbox
          checked={Boolean(table.getIsAllRowsSelected())}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={Boolean(row.getIsSelected())}
          onChange={() => {
            row.getToggleSelectedHandler();
            row.toggleSelected();
          }}
        />
      ),
    },
    {
      accessorKey: EAirport.airport_name,
      header: ({ header }) => <Column header={header} title="Airport Name" />,
    },
    {
      accessorKey: EAirport.airport_code,
      header: ({ header }) => <Column header={header} title="Airport Code" />,
    },
  ];

  return { formSchema, columns, payload };
};

