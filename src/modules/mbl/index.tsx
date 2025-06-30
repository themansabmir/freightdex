import FormActions from '@blocks/form-actions';
import MBLForm from '@generator/form';
import { Button } from '@shared/components';
import PageLoader from '@shared/components/Loader/PageLoader';
import { useFormValidation } from '@shared/hooks/useFormValidation';
import { hydratePayload, joinCompositeFields, splitCompositeFields } from '@shared/utils';
import { useEffect, useMemo, useState } from 'react';
import useMbl from './hooks/useMbl';
import { useMblApi } from './hooks/useMblApi';
import { IMbl, MblSchema } from './index.types';
import cloneDeep from 'lodash/cloneDeep';

const fields = ['shipper', 'agent', 'notify', 'consignee', 'second_notify'] as const;

const MBLFormPage = ({ id, tradeType }: { id: string; tradeType: string }) => {
  const [isView, setIsView] = useState(false);

  const { mbl_payload, mbl_form_schema, export_rail_container_fields, export_rail_fields, export_road_container_fields } = useMbl();
  const [formData, setFormData] = useState<IMbl>({ ...mbl_payload });
  const { handleChange, errors } = useFormValidation(MblSchema, formData);

  const { saveMbl, useGetMblByShipmentId, isSaving } = useMblApi();
  const { data, isLoading } = useGetMblByShipmentId(id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const withShipmentFolderId = { ...formData, shipment_folder_id: id };
    const cleanPayload = hydratePayload(withShipmentFolderId);
    const submitPayload = splitCompositeFields(cleanPayload, fields);
    await saveMbl(submitPayload).then(() => setIsView(true));
  };

  const handleCancel = () => {};

  const visibleSchema = useMemo(() => {
    const schema = cloneDeep(mbl_form_schema);

    if (formData?.trade_type?.toUpperCase() !== 'IMPORT') {
      return schema;
    }
    if (formData?.trade_type?.toUpperCase() !== 'EXPORT') return schema;
    schema.push(...export_rail_fields); // root fields
    const extraByMove = {
      RAIL: export_rail_container_fields,
      ROAD: export_road_container_fields,
    } as const;

    const container = schema.find((f) => f.name === 'containers');
    const extras = extraByMove[formData?.movement_type?.toUpperCase() as keyof typeof extraByMove];
    if (container?.type === 'array' && container?.item?.fields && extras) {
      container.item.fields.push(...extras);
    }
    return schema;
  }, [formData]);

  useEffect(() => {
    const filterNullify = hydratePayload(data ?? {});
    const dataWithAddress = joinCompositeFields(filterNullify, fields);
    setFormData({ ...mbl_payload, ...dataWithAddress, trade_type: tradeType });
  }, [data]);

  return (
    <>
      <Button onClick={() => setIsView(!isView)}>{isView ? 'Edit' : 'Cancel'}</Button>
      <div className="shipment_info_card">Total Containers: {data?.containers?.length}</div>
      <div className="mb-4"></div>
      <PageLoader isLoading={isSaving || isLoading} />
      <MBLForm errors={errors} onChange={handleChange} data={formData} isViewMode={isView} setData={setFormData} schema={visibleSchema} />
      <FormActions isCreating={false} isViewMode={isView} isEdit={true} onCancel={handleCancel} onSubmit={handleSubmit} />
    </>
  );
};

export default MBLFormPage;
