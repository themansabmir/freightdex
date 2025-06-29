import HBLForm from '@generator/form';
import useHbl from './hooks/useHbl';
import { useState } from 'react';
import { useFormValidation } from '@shared/hooks/useFormValidation';

const HBLFormPage = ({ id }) => {
  const { commonFields } = useHbl();
  const [formData, setFormData] = useState({});
  const { handleChange } = useFormValidation(null, null);

  return (
    <div>
      <HBLForm schema={[...commonFields]} data={formData} onChange={handleChange} errors={''} setData={setFormData} isViewMode={false} />
    </div>
  );
};

export default HBLFormPage;
