import DynamicForm from '@generator/form';
import { useFormValidation } from '@shared/hooks/useFormValidation';
import { useState } from 'react';
import useTeam from '../hooks/useTeam';
import { teamSchema } from '../index.types';
import FormActions from '@blocks/form-actions';

type FormActionsProps = {
  isViewMode?: boolean;
  isEdit?: boolean;
  isCreating?: boolean;
  onCancel: () => void;
  onSubmit: (e: React.MouseEvent) => void;
};
const TeamForm = (props: FormActionsProps) => {
  const { formSchema: teamForm, payload } = useTeam();
  const [data, setData] = useState({});
  const { handleChange, errors } = useFormValidation(teamSchema, payload);
  return (
    <div>
      <div className="my-4">
        <DynamicForm schema={teamForm} data={data} setData={setData} onChange={handleChange} isViewMode={false} errors={errors} />
      </div>
      <FormActions {...props} />
    </div>
  );
};

export default TeamForm;
