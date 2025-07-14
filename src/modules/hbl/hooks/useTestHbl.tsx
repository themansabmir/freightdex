import { fields } from '@modules/mbl';
import { IContainer } from '@modules/mbl/index.types';
import { joinCompositeFields } from '@shared/utils';
import { IBillOfEntry, IShippingBill } from '../index.types';

interface IFormInput {
  mblData: Record<string, any>;
  hbl?: Record<string, any> | null;
  prompt?: { containers?: string[]; bill_of_entry?: string[]; shipping_bill?: string[] };
  isNew: boolean;
}

const MBL_FIELDS_TO_COPY = [
  'trade_type',
  'movement_type',
  'place_carriage',
  'marks_numbers',
  'place_of_receipt',
  'vessel_number',
  'voyage_number',
  'port_of_loading',
  'port_of_discharge',
  'place_of_delivery',
  'transhipment_port',
  'incoterm',
  'freight_type',
  'exchange_rate',
  'sob_date',
  'eta_pod',
  'free_time_origin',
  'free_time_destination',
  'extra_free_time',
  'etd_pol',
  'shipping_bill_number',
  'shipping_bill_date',
  'etd_fpod',
  'ata_pod',
  'bill_of_entry',
  'bill_of_entry_date',
];

const HBL_FIELDS_TO_COPY = [
  'hbl_number',
  'consignee',
  'consignee_address',
  'notify',
  'notify_address',
  'agent_origin',
  'agent_origin_address',
  'agent_destination',
  'agent_destination_address',
  'second_notify',
  'second_notify_address',
  'shipper',
  'shipper_address',
];

export function buildHblFormData({ mblData, hbl, prompt, isNew }: IFormInput): Record<string, any> {
  const result: Record<string, any> = {};

  const hblData = joinCompositeFields(hbl, fields);

  // 1. Copy MBL fields
  for (const field of MBL_FIELDS_TO_COPY) {
    result[field] = mblData?.[field] ?? null;
  }

  // 2. Copy HBL fields
  if (!isNew && hblData) {
    for (const field of HBL_FIELDS_TO_COPY) {
      result[field] = hblData?.[field] ?? null;
    }
  } else {
    for (const field of HBL_FIELDS_TO_COPY) {
      result[field] = null;
    }
  }

  // 3. Containers logic (no picking, full container objects)
  const mblContainers: IContainer[] = mblData?.containers ?? [];
  const hblContainers:IContainer[] = !isNew && hblData?.containers ? hblData.containers : [];
  // const hblShippingBill = !isNew && hblData?.shipping_bill ? hblData?.shipping_bill : [];
  // const hblBillOfEntry = !isNew && hblData?.bill_of_entry ? hblData?.bill_of_entry : [];
  const selectedPromptIds = prompt?.containers ?? [];

  // From mblData, get only prompt-selected containers
  const promptContainers = mblContainers.filter((c) => selectedPromptIds.includes(c.container_number));
  // const promptShippingBill = mblData?.shipping_bill?.filter((c) => selected_shipping_bill.includes(c.shipping_bill_number));
  // const promptBillOfEntry = mblData?.bill_of_entry?.filter((c) => selected_bill_of_entry.includes(c.bill_of_entry_number));

  // Merge: hblContainers first, add promptContainers not already in hbl
  const existingIds = new Set(hblContainers.map((c) => c.container_number));
  const newContainers = promptContainers.filter((c) => !existingIds.has(c.container_number));

  result.containers = [...hblContainers, ...newContainers];

  // 4. Merge Shipping Bill
  const mblShippingBills:IShippingBill[] = mblData?.shipping_bill ?? [];
  const hblShippingBills:IShippingBill[] = !isNew && hblData?.shipping_bill ? hblData.shipping_bill : [];
  const selectedShippingIds = prompt?.shipping_bill ?? [];

  const promptShippingBills = mblShippingBills.filter((b) => selectedShippingIds.includes(b.shipping_bill_number));

  const sbSet = new Set(hblShippingBills.map((b) => b.shipping_bill_number));
  const newSB = promptShippingBills.filter((b) => !sbSet.has(b.shipping_bill_number));
  result.shipping_bill = [...hblShippingBills, ...newSB];

  // 5. Merge Bill of Entry
  const mblBoE:IBillOfEntry[] = mblData?.bill_of_entry ?? [];
  const hblBoE:IBillOfEntry[] = !isNew && hblData?.bill_of_entry ? hblData.bill_of_entry : [];
  const selectedBoEIds = prompt?.bill_of_entry ?? [];

  const promptBoE = mblBoE.filter((e) => selectedBoEIds.includes(e.bill_of_entry_number));

  const boeSet = new Set(hblBoE.map((e) => e.bill_of_entry_number));
  const newBoE = promptBoE.filter((e) => !boeSet.has(e.bill_of_entry_number));
  result.bill_of_entry = [...hblBoE, ...newBoE];

  return result;
}
