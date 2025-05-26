import { FieldSchema } from '@generator/form/index.types';
import { ETeam } from '../index.types';

const useTeam = () => {
  const modules = ['Team', 'Shipment', 'Quotation', 'MasterData'];

  const permissions = ['View', 'Create', 'Update', 'Delete'];

  const options = modules.flatMap((module) =>
    permissions.map((action) => ({
      label: `${action} ${module}`,
      value: `${module.toLowerCase()}_${action.toLowerCase()}`,
    }))
  );

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

  return { formSchema };
};

export default useTeam;
