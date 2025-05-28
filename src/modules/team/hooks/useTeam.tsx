import { FieldSchema } from '@generator/form/index.types';
import { ETeam, ITeam } from '../index.types';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox, ToggleButton } from '@shared/components';
import Column from '@shared/components/Column';

const useTeam = () => {
  const modules = ['Team', 'Shipment', 'Quotation', 'MasterData'];

  const permissions = ['View', 'Create', 'Update', 'Delete'];
  const payload: ITeam = {
    _id: '',
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    role: '',
    permissions: [],
  };

  const options = modules.flatMap((module) =>
    permissions.map((action) => ({
      label: `${action} ${module}`,
      value: `${module.toLowerCase()}_${action.toLowerCase()}`,
    }))
  );
  /*
  Team Table Columns
*/

  const columns: ColumnDef<ITeam>[] = [
    {
      id: '_id',
      size: 4,
      header: ({ table }) => {
        return (
          <Checkbox
            checked={Boolean(table.getIsAllRowsSelected())}
            onChange={() => {
              table.getToggleAllRowsSelectedHandler();
            }}
          />
        );
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
      accessorKey: ETeam.EMAIL,
      header: ({ header }) => <Column header={header} title={'Email'} />,
      enableSorting:true 
    },
    {
      accessorKey: ETeam.ROLE,
      header: ({ header }) => <Column header={header} title={'Role'} />,
    },
    {
      accessorKey: ETeam.FIRST_NAME,
      header: ({ header }) => <Column header={header} title={'First Name'} />,
    },
    {
      accessorKey: ETeam.LAST_NAME,
      header: ({ header }) => <Column header={header} title={'Last Name'} />,
    },

    {
      accessorKey: ETeam.USERNAME,
      header: ({ header }) => <Column header={header} title={'Username'} />,
    },
    {
      accessorKey: ETeam.IS_ACTIVE,
      header: ({ header }) => <Column header={header} title={'Is Active'} />,
      cell: ({ row }) => (
        <span onClick={(e) => e.stopPropagation()}>
          {' '}
          <ToggleButton label="" defaultChecked={row.getValue(ETeam.IS_ACTIVE)} variant="primary" />
        </span>
      ),
    },
  ];
  /*
  Team Form Schema
  */
  const formSchema: FieldSchema[] = [
    { type: 'text', required: true, label: 'First Name', name: ETeam.FIRST_NAME, placeholder: 'First Name' },
    { type: 'text', required: true, label: 'Last Name', name: ETeam.LAST_NAME, placeholder: 'Last Name' },
    { type: 'text', required: true, label: 'Email', name: ETeam.EMAIL, placeholder: 'youremail@website.com' },
    { type: 'text', required: true, label: 'Username', name: ETeam.USERNAME, placeholder: 'Username' },
    {
      type: 'dropdown',
      placeholder: 'Role',
      required: true,
      label: 'User Role',
      name: ETeam.ROLE,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
    },
    {
      type: 'multiselect',
      label: 'Set Permissions',
      name: 'permissions',
      options,
    },
  ];

  return { columns, formSchema, payload };
};

export default useTeam;
