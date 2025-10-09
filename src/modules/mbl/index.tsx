import FormActions from '@blocks/form-actions';
import MBLForm from '@generator/form';
import { useShipmentApi } from '@modules/shipment/hooks/useShipmentApi';
import { Button, ToggleButton } from '@shared/components';
import PageLoader from '@shared/components/Loader/PageLoader';
import { useFormValidation } from '@shared/hooks/useFormValidation';
import { hydratePayload, joinCompositeFields, removeNulls, splitCompositeFields } from '@shared/utils';
import cloneDeep from 'lodash/cloneDeep';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useMbl from './hooks/useMbl';
import { useGetMblByShipmentId, useSaveMbl } from './hooks/useMblApi';
import { IMbl, MblSchema } from './index.types';

export const fields = ['shipper', 'agent', 'notify', 'consignee', 'second_notify', 'agent_origin', 'agent_destination', 'billing_party',] as const;

const MBLFormPage = ({ id }: { id: string }) => {
  const [isView, setIsView] = useState(false);
  const [mergeDescription, setMergeDescription] = useState(false);

  const { mbl_payload, mbl_form_schema, conditionalFieldsMap } = useMbl();
  const [formData, setFormData] = useState<IMbl>({ ...mbl_payload });
  const { handleChange, errors } = useFormValidation(MblSchema, formData as any);

  const { isSaving, saveMbl } = useSaveMbl();
  const { data, isLoading } = useGetMblByShipmentId(id);
  const { createShipmentFolder, isCreating } = useShipmentApi();

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.trade_type) return toast.error('Please select a trade type');
    if (id === 'new') {
      const shipmentFolder = await createShipmentFolder({ shipment_type: formData.trade_type === 'IMPORT' ? 'IMP' : 'EXP' });

      const withShipmentFolderId = { ...formData, shipment_folder_id: shipmentFolder._id };
      const cleanPayload = removeNulls(hydratePayload(withShipmentFolderId));
      const submitPayload = splitCompositeFields(cleanPayload, fields);
      await saveMbl(submitPayload).then(() => navigate(`/shipment/${shipmentFolder._id}`));
    } else {
      const withShipmentFolderId = { ...formData, shipment_folder_id: id };
      const cleanPayload = removeNulls(hydratePayload(withShipmentFolderId));

      const submitPayload = splitCompositeFields(cleanPayload, fields);
      if (!submitPayload.shipping_bill) {
        submitPayload.shipping_bill = [];
      }
      await saveMbl(submitPayload).then(() => setIsView(true));
    }
  };

  const handleCancel = () => {};

  const visibleSchema = useMemo(() => {
    const schema = cloneDeep(mbl_form_schema);

    if (mergeDescription) {
      schema.push({
        type: 'textarea',
        name: 'description_of_goods',
        label: 'Description',
        colSpan: 3,
      });
      schema.filter((f) => {
        if (f.type === 'array' && f.name === 'containers') {
          f.item.fields = f.item.fields.filter((f) => f.name !== 'description');
        }
      });
    }

    if (formData?.trade_type?.toUpperCase() === 'IMPORT') {
      if (formData.movement_type?.toUpperCase() === 'RAIL') {
        const { IMPORT_RAIL: import_rail_fields, IMPORT_RAIL_CONTAINER } = conditionalFieldsMap;
        schema.push(...import_rail_fields);
        const container = schema.find((f) => f.name === 'containers');
        if (container?.type === 'array' && container?.item?.fields) {
          container.item.fields.push(...IMPORT_RAIL_CONTAINER);
        }
      }
      return schema;
    } else if (formData?.trade_type?.toUpperCase() === 'EXPORT') {
      if (formData.movement_type?.toUpperCase() === 'RAIL') {
        const { EXPORT_RAIL, EXPORT_RAIL_CONTAINER } = conditionalFieldsMap;
        schema.push(...EXPORT_RAIL);
        const container = schema.find((f) => f.name === 'containers');
        if (container?.type === 'array' && container?.item?.fields) {
          container.item.fields.push(...EXPORT_RAIL_CONTAINER);
        }
      } else if (formData.movement_type?.toUpperCase() === 'ROAD') {
        const { EXPORT_ROAD, EXPORT_ROAD_CONTAINER } = conditionalFieldsMap;
        schema.push(...EXPORT_ROAD);
        const container = schema.find((f) => f.name === 'containers');
        if (container?.type === 'array' && container?.item?.fields) {
          container.item.fields.push(...EXPORT_ROAD_CONTAINER);
        }
      }
      return schema;
    } else {
      return schema;
    }
  }, [formData, conditionalFieldsMap, mbl_form_schema, mergeDescription]);

  useEffect(() => {
    const filterNullify = hydratePayload(data ?? {});
    const dataWithAddress = joinCompositeFields(filterNullify, fields);

    setFormData({ ...dataWithAddress });
  }, [data]);

  return (
    <>
      <PageLoader isLoading={isSaving || isLoading || isCreating} />
      <Button onClick={() => setIsView(!isView)}>{isView ? 'Edit' : 'Cancel'}</Button>
      <div className="pt-4"></div>
      <ToggleButton label="Merge Description" defaultChecked={mergeDescription} onChange={setMergeDescription} />
      <div className="shipment_info_card">Total Containers: {data?.containers?.length}</div>
      <MBLForm errors={errors} onChange={handleChange} data={formData} isViewMode={isView} setData={setFormData} schema={visibleSchema} />
      <FormActions isCreating={false} isViewMode={isView} isEdit={true} onCancel={handleCancel} onSubmit={handleSubmit} />
    </>
  );
};

export default MBLFormPage;
