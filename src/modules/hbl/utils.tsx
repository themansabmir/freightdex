import { FieldSchema } from '@generator/form/index.types';
import { cloneDeep } from 'lodash';

interface GetVisibleSchemaParams {
  formData: Record<string, any>;
  conditionalFieldsMap: Record<string, FieldSchema[]>;
  mbl_form_schema: FieldSchema[];
  mergeDescription?: boolean;
}

export function getVisibleSchema({
  formData,
  conditionalFieldsMap,
  mbl_form_schema,
  mergeDescription = false,
}: GetVisibleSchemaParams): FieldSchema[] {
  let schema = cloneDeep(mbl_form_schema);
  schema = schema.map((item) => {
    if (item.name === 'mbl_number') {
      return {
        ...item,
        name: 'hbl_number',
        label: 'HBL Number',
        placeholder: 'HBL Number',
      };
    } else if (item.name === 'mbl_date') {
      return {
        ...item,
        name: 'hbl_date',
        label: 'HBL Date',
      };
    }
    return item;
  });

  // Step 1: Remove MBL-only fields
  schema = schema.filter(
    (f) => !['shipment_mode', 'movement_type', 'trade_type', 'booking_number', 'shipping_line', 'shipment_type', 'mbl_type'].includes(f.name)
  );

  // Step 2: Optional description field at HBL level
  if (mergeDescription) {
    schema.push({
      type: 'textarea',
      name: 'description_of_goods',
      label: 'Description',
      colSpan: 3,
    });

    const containerField = schema.find((f) => f.type === 'array' && f.name === 'containers');
    if (containerField?.type === 'array' && containerField?.item?.fields) {
      containerField.item.fields = containerField.item.fields.filter((f) => f.name !== 'description');
    }
  }

  // Step 3: Add conditional fields based on trade/movement type
  const trade = formData?.trade_type?.toUpperCase();
  const move = formData?.movement_type?.toUpperCase();

  if (trade === 'IMPORT' && move === 'RAIL') {
    const { IMPORT_RAIL = [], IMPORT_RAIL_CONTAINER = [] } = conditionalFieldsMap;
    schema.push(...IMPORT_RAIL);
    const container = schema.find((f) => f.name === 'containers');
    if (container?.type === 'array' && container?.item?.fields) container?.item?.fields?.push(...IMPORT_RAIL_CONTAINER);
  }

  if (trade === 'EXPORT') {
    if (move === 'RAIL') {
      const { EXPORT_RAIL = [], EXPORT_RAIL_CONTAINER = [] } = conditionalFieldsMap;
      schema.push(...EXPORT_RAIL);
      const container = schema.find((f) => f.name === 'containers');
      if (container?.type === 'array' && container?.item?.fields) container?.item?.fields?.push(...EXPORT_RAIL_CONTAINER);
    } else if (move === 'ROAD') {
      const { EXPORT_ROAD = [], EXPORT_ROAD_CONTAINER = [] } = conditionalFieldsMap;
      schema.push(...EXPORT_ROAD);
      const container = schema.find((f) => f.name === 'containers');
      if (container?.type === 'array' && container?.item?.fields) container?.item?.fields?.push(...EXPORT_ROAD_CONTAINER);
    }
  }

  return schema;
}
interface IMessage {
  label: string;
  value: string
}
export function getMessage(shippingBillArr?: IMessage[], billOfEntryArr?: IMessage[]) {
  if (shippingBillArr &&shippingBillArr?.length > 0) return 'Shipping Bill';
  if (billOfEntryArr &&billOfEntryArr.length > 0) return 'Bill Of Entry';
  return null;
}
