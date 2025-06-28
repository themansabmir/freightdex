import MBLForm from '@generator/form';
import { useEffect, useState } from 'react';
import useMbl from '../hooks/useMbl';
import { useFormValidation } from '@shared/hooks/useFormValidation';
import { IMbl, MblSchema } from '../index.types';
import FormActions from '@blocks/form-actions';
import { useMblApi } from '../hooks/useMblApi';
import PageLoader from '@shared/components/Loader/PageLoader';
import { Button } from '@shared/components';
import { hydratePayload, joinCompositeFields, splitCompositeFields } from '@shared/utils';

const fields = ['shipper', 'agent', 'notify', 'consignee'] as const;

const MBLFormPage = ({ id }: { id: string }) => {
  const [isView, setIsView] = useState(false);
  const { mbl_payload, mbl_form_schema } = useMbl();
  const { saveMbl, useGetMblByShipmentId, isSaving } = useMblApi();
  const [formData, setFormData] = useState<IMbl>({ ...mbl_payload });
  const { handleChange, errors } = useFormValidation(MblSchema, formData);

  const { data, isLoading } = useGetMblByShipmentId(id);

  useEffect(() => {
    if (!data) return;
    const filterNullify =hydratePayload(data);
    const dataWithAddress = joinCompositeFields(filterNullify, fields);

    console.log(dataWithAddress)

    setFormData({ ...mbl_payload, ...dataWithAddress });
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const withShipmentFolderId = { ...formData, shipment_folder_id: id };
    const cleanPayload = hydratePayload(withShipmentFolderId);
    const submitPayload = splitCompositeFields(cleanPayload, fields);

    console.log(submitPayload)
// return
    await saveMbl(submitPayload).then(() => setIsView(true));
  };

  const handleCancel = () => {};

  return (
    <>
      <Button onClick={() => setIsView(false)}>Start Editing</Button>
      <div className="shipment_info_card">Total Containers: {data?.containers?.length}</div>
      <div className="mb-4"></div>
      <PageLoader isLoading={isSaving || isLoading} />
      <MBLForm errors={errors} onChange={handleChange} data={formData} isViewMode={isView} setData={setFormData} schema={mbl_form_schema} />
      <FormActions isCreating={false} isViewMode={isView} isEdit={true} onCancel={handleCancel} onSubmit={handleSubmit} />
    </>
  );
};

export default MBLFormPage;
