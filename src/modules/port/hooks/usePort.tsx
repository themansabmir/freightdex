import { FieldSchema } from '@generator/form/index.types';
import { Checkbox } from '@shared/components';
import Column from '@shared/components/Column';
import { ColumnDef } from '@tanstack/react-table';
import { EPort, IPort } from '../index.types';

export const usePortPage = () => {
  const payload: IPort = {
    port_name: '',
    _id: '',
    port_code: '',
  };

  const formSchema: FieldSchema[] = [
    {
      name: EPort.port_name,
      label: 'Port Name',
      type: 'text',
      required: true,
    },
    {
      name: EPort.port_code,
      label: 'Port Code',
      type: 'text',
      required: true,
    },
  ];

  const columns: ColumnDef<IPort>[] = [
    {
      id: '_id',
      size: 4,
      header: ({ table }) => {
        return <Checkbox checked={Boolean(table.getIsAllRowsSelected())} onChange={table.getToggleAllRowsSelectedHandler()} />;
      },

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
      accessorKey: EPort.port_name,
      header: ({ header }) => <Column header={header} title={'Port Name'} />,
    },
    {
      accessorKey: EPort.port_code,
      header: ({ header }) => <Column header={header} title={'Port Code'} />,
    },
  ];

  return { formSchema, columns, payload };
};

export default usePortPage;
