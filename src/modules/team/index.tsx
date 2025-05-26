import PageHeader from '@blocks/page-header';
import TeamForm from '@generator/form';
import { Button, TextField } from '@shared/components';
import { Stack } from '@shared/components/Stack';
import { useFormValidation } from '@shared/hooks/useFormValidation';
import { useState } from 'react';
import useTeam from './hooks/useTeam';
import { teamSchema } from './index.types';

const Team = () => {
  const { formSchema: teamForm } = useTeam();
  const [data, setData] = useState({});
  const { handleChange, errors, validate, values } = useFormValidation(teamSchema, {});

  console.log(values, 'Values');

  const pageHeaderProps = {
    pageName: 'Team',
    pageDescription: 'You can manage your system team members here.',
    isViewMode: true,
    isForm: true,
    isEdit: true,
  };
  const breadcrumbArray = [{ label: 'Home', href: '/' }, { label: 'Team' }];
  return (
    <>
      <PageHeader {...pageHeaderProps} breadcrumnArray={breadcrumbArray} />
      <Stack direction="horizontal" align="end" justify="between">
        <TextField placeholder="Search Team Member" label="Search" />
        <Button>+Add New</Button>
      </Stack>

      <TeamForm schema={teamForm} data={data} setData={setData} onChange={handleChange} isViewMode={false} errors={errors} />
      <Stack></Stack>
    </>
  );
};

export default Team;
