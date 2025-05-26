import { Button } from '@shared/components';
import { Stack } from '@shared/components/Stack';
import { FC } from 'react';


type FormActionsProps = {
  isViewMode?: boolean;
  isEdit?: boolean;
  isCreating?: boolean;
  onCancel: () => void;
  onSubmit: (e: React.MouseEvent) => void;
};

const FormActions: FC<FormActionsProps> = ({ isViewMode = false, isEdit = false, isCreating = false, onCancel, onSubmit }) => {
  if (isViewMode) return null;

  return (
    <Stack gap="1em" direction="horizontal" justify="end" align="center">
      <Button type="outline" variant="destructive" onClick={onCancel} disabled={isCreating}>
        Cancel
      </Button>
      <Button onClick={onSubmit} disabled={isCreating || isViewMode}>
        {isEdit ? 'Update' : 'Submit'}
      </Button>
    </Stack>
  );
};

export default FormActions;
