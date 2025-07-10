import HBLCreationForm from '@generator/form';
import { FieldSchema } from '@generator/form/index.types';
import useMbl from '@modules/mbl/hooks/useMbl';
import { useGetMblByShipmentId } from '@modules/mbl/hooks/useMblApi';
import { Button } from '@shared/components';
import { cloneDeep } from 'lodash';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HBL = ({ id }: { id: string }) => {

  const navigate   = useNavigate()
  const [promptData, setPromptData] = useState({});
  const [formData, setFormData] = useState({});
  const [mergeDescription, setMergeDescription] = useState(false);
  const { mbl_form_schema, mbl_payload, conditionalFieldsMap } = useMbl();

  const [hblList, setHblList] = useState([]);
  const { data, isLoading } = useGetMblByShipmentId(id);
  const containers = data?.containers ?? [];

  const hblPromptSchema: FieldSchema[] = [
    {
      type: 'multiselect',
      required: true,
      label: 'Select Containers for HBL',
      name: 'selected_containers',
      placeholder: 'Select Containers',
      options: containers.map((container) => ({ label: container.container_number, value: container.container_number })),
    },
  ];

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

  const handleSubmit = () => {
    const newHblForm = cloneDeep(formData);
    setHblList((prev) => [...prev, newHblForm]);
  };

  if (isLoading) return 'Loading ...';

  if (!data) return 'Please create MBL first to proceed with creating HBL';
  if (!data?.containers?.length) return 'Please add atleast one container in MBL to proceed with creating HBL';
  if (!data?.shipping_bill?.length && !data?.bill_of_entry?.length)
    return 'Cannot create HBL without having Bill of entry number/ Shipping Bill number';

  if (id !== 'new')
    return (
      <div>
        <HBLCreationForm
          schema={hblPromptSchema}
          data={promptData}
          setData={setPromptData}
          errors={{}}
          isViewMode={false}
          onChange={(e, val) => {
            console.log(e, val);
          }}
        />

        <Button onClick={handleSubmit}> Submit</Button>
        {hblList.map((hblForm, i) => {
          return (
            <div>
              <h1>HBL FORM {i + 1} </h1> <Button onClick={() => navigate(`hbl/${'edit'}`)}>Edit</Button>
              <HBLCreationForm
                schema={visibleSchema.filter(
                  (f) =>
                    !['shipment_mode', 'movement_type', 'trade_type', 'booking_number', 'shipping_line', 'shipment_type', 'mbl_type'].includes(f.name)
                )}
                data={formData}
                setData={setFormData}
                errors={{}}
                isViewMode={false}
                onChange={(e, val) => {
                  console.log(e, val);
                }}
              />
            </div>
          );
        })}
      </div>
    );
};

export default HBL;

