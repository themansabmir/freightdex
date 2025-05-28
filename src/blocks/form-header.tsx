import { Button, ToggleButton } from '@shared/components';
import { Stack } from '@shared/components/Stack';

type FormActionBarProps = {
  isViewMode: boolean;
  isCreating?: boolean;
  keepCreating: boolean;
  onGoBack: () => void;
  onStartEditing: () => void;
  onToggleKeepCreating: (checked: boolean) => void;
  showToggle?: boolean;
};

export const FormActionHeader = ({
  isViewMode,
  isCreating = false,
  keepCreating,
  onGoBack,
  onStartEditing,
  onToggleKeepCreating,
  showToggle = true,
}: FormActionBarProps) => {
  return (
    <Stack direction="horizontal" justify="between">
      <Stack>
        <Button onClick={onGoBack} variant="destructive">
          Go Back
        </Button>
        {isViewMode && (
          <Button type="solid" variant="primary" onClick={onStartEditing} disabled={isCreating}>
            Start Editing
          </Button>
        )}
      </Stack>
      {showToggle && <ToggleButton defaultChecked={keepCreating} onChange={onToggleKeepCreating} label="Keep Creating" variant="primary" />}
    </Stack>
  );
};
