import PageHeader from '@blocks/page-header';
import DynamicForm from '@generator/form';
import { FieldSchema } from '@generator/form/index.types';
import { fields } from '@modules/mbl';
import useMbl from '@modules/mbl/hooks/useMbl';
import { useGetMblByShipmentId } from '@modules/mbl/hooks/useMblApi';
import { Button, Typography } from '@shared/components';
import PageLoader from '@shared/components/Loader/PageLoader';
import { hydratePayload, removeNulls, splitCompositeFields } from '@shared/utils';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetHblById, useGetHblsByShipmentId, useSaveHbl } from './hooks/useHblApi';
import { buildHblFormData } from './hooks/useTestHbl';
import { getMessage, getVisibleSchema } from './utils';
import { IHbl } from './index.types';

const HblForm = () => {
  const navigate = useNavigate();
  const { id, hblId } = useParams();
  const mergeDescription = false;
  const isNew = hblId === 'new';
  const { mbl_form_schema, conditionalFieldsMap } = useMbl();
  const [prompt, setPrompt] = useState({});
  const [formData, setFormData] = useState<any>({});

  const { data: mblData, isLoading: mblLoading } = useGetMblByShipmentId(String(id));
  const { data: rawHblData, isLoading: hblLoading } = useGetHblById(String(hblId));
  const { data: hblDataList, isLoading: hblListLoading } = useGetHblsByShipmentId(String(id));
  const { saveHbl } = useSaveHbl();

  const selectedShippingBill = hblDataList?.flatMap((hbl) => {
    return hbl?.shipping_bill?.flatMap((c) => c?.shipping_bill_number);
  });
  const selectedContainers = hblDataList?.flatMap((hbl) => hbl?.containers?.map((c) => c?.container_number));

  const selectedBillOfEntry = hblDataList?.flatMap((hbl) => {
    return hbl?.bill_of_entry?.flatMap((c) => c?.bill_of_entry_number);
  });

  const schema = useMemo(() => {
    const result = getVisibleSchema({
      formData: mblData ?? {},
      conditionalFieldsMap,
      mbl_form_schema,
      mergeDescription,
    });

    return result;
  }, [conditionalFieldsMap, mbl_form_schema, mergeDescription, mblData]);

  const containersOption = mblData?.containers?.map((con) => ({ label: con?.container_number, value: con?.container_number }));

  const shippingBillOptions = mblData?.shipping_bill?.map((bill) => ({ label: bill?.shipping_bill_number, value: bill?.shipping_bill_number }));

  const billOfEntryOptions = mblData?.bill_of_entry?.map((bill) => ({ label: bill?.bill_of_entry_number, value: bill?.bill_of_entry_number }));
  const promptSchema = useMemo(() => {
    if (!mblData) return [];

    const form: FieldSchema[] = [];
    if (containersOption && containersOption.length > 0) {
      form.push({
        type: 'multiselect',
        name: 'containers',
        label: 'Containers',
        options: containersOption.filter((i) => !selectedContainers?.includes(i?.value)),
      });
    }
    if (shippingBillOptions && shippingBillOptions.length > 0) {
      form.push({
        type: 'multiselect',
        name: 'shipping_bill',
        label: 'Shipping Bill',
        options: shippingBillOptions.filter((i) => !selectedShippingBill?.includes(i?.value)),
        selectedOptions: rawHblData?.shipping_bill?.map((bill) => bill?.shipping_bill_number),
      });
    } else if (billOfEntryOptions && billOfEntryOptions.length > 0) {
      form.push({
        type: 'multiselect',
        name: 'bill_of_entry',
        label: 'Bill of Entry',
        options: billOfEntryOptions?.filter((i) => !selectedBillOfEntry?.includes(i?.value)),
        selectedOptions: rawHblData?.bill_of_entry?.map((bill) => bill?.bill_of_entry_number),
      });
    }

    return form;
  }, [mblData, billOfEntryOptions, containersOption, shippingBillOptions, rawHblData, selectedBillOfEntry, selectedContainers, selectedShippingBill]);

  useEffect(() => {
    if (!mblData) return;

    if (isNew) {
      const merged = buildHblFormData({
        mblData,
        hbl: null,
        prompt,
        isNew: true,
      });

      setFormData((prev: IHbl) => ({
        ...merged,
        ...prev,
        containers: merged.containers,
        shipping_bill: merged?.shipping_bill,
        bill_of_entry: merged?.bill_of_entry,
      }));
    } else {
      if (!rawHblData) return;

      const merged = buildHblFormData({
        mblData,
        hbl: rawHblData,
        prompt,
        isNew: false,
      });

      setFormData((prev: IHbl) => ({
        ...merged,
        ...prev,
        containers: merged.containers,
        shipping_bill: merged?.shipping_bill,
        bill_of_entry: merged?.bill_of_entry,
      }));
    }
  }, [mblData, rawHblData, prompt, isNew]);

  const handleSaveHbl = async () => {
    const cleanPayload = removeNulls(hydratePayload(formData));
    const finalPayload = splitCompositeFields(cleanPayload, fields);
    finalPayload['shipment_folder_id'] = id;
    if (hblId === 'new') {
      finalPayload['hblId'] = hblId;
      await saveHbl(finalPayload);
    } else {
      finalPayload['hblId'] = hblId;
      await saveHbl(finalPayload);
    }

    navigate('/shipment/' + id);
  };

  if (!mblData) return <div>Loading...</div>;

  return (
    <div>
      <PageHeader
        pageName="HBL"
        pageDescription={`Here you can ${isNew ? 'Create New HBL' : 'Edit HBL'}`}
        isEdit={false}
        isViewMode={false}
        isForm={false}
        breadcrumnArray={[
          { label: 'Dashboard', href: '/' },
          { label: 'Shipment', href: '/shipment' },
          { label: id ?? '', href: `/shipment/${id}` },
        ]}
      />

      <PageLoader isLoading={mblLoading || hblLoading || hblListLoading} />
      <Typography variant="lg" weight="bold">
        Select Containers & {getMessage(shippingBillOptions, billOfEntryOptions)}
      </Typography>
      <DynamicForm errors={{}} data={prompt} schema={promptSchema} setData={setPrompt} isViewMode={false} onChange={() => {}} />
      <div className="mt-10">
        <Typography variant="lg" weight="bold">
          {isNew ? 'Create New HBL' : 'Edit HBL'}
        </Typography>
        <DynamicForm errors={{}} data={formData} schema={schema} setData={setFormData} isViewMode={false} onChange={setFormData} />
      </div>
      <Button onClick={handleSaveHbl}>Save</Button>
    </div>
  );
};

export default HblForm;
