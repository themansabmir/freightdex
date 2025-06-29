import { z } from 'zod';

export enum TradeType {
  IMPORT = 'import',
  EXPORT = 'export',
}
export enum ShipmentMode {
  SEA = 'sea',
  AIR = 'air',
}
export enum ShipmentType {
  FCL = 'FCL',
  LCL = 'LCL',
}
export enum MBL_Type {
  OBL = 'OBL',
  TLX = 'TLX',
  SEAWAY = 'SEAWAY',
  SURRENDER = 'SURRENDER',
}

export enum INCOTERM {
  FOB = 'FOB',
  EXW = 'EXW',
  CIF = 'CIF',
  FCA = 'FCA',
}
export enum FREIGHT_TYPE {
  PRE = 'PRE',
  COLLECT = 'COLLECT',
}

export enum CONTAINER_TYPE {
  GENERAL = 'GENERAL',
  REEFER = 'REEFER',
  HAZARDOUS = 'HAZARDOUS',
}

export enum CONTAINER_SIZE {
  FORTY = '40',
  TWENTY = '20',
}

export interface IContainer {
  container_number: string;
  line_seal: string;
  shipper_seal: string;
  customer_seal: string;
  container_size: CONTAINER_SIZE;
  container_type: CONTAINER_TYPE;
  package_count: string;
  package_type: string;
  description: string;
  gross_weight: string;
  net_weight: string;
  volume: string;
}



export interface IMbl {
  [key: string]: unknown;

  movement_type: string;
  shipment_folder_id: string;
  shipment_mode: ShipmentMode | string;
  shipment_type: ShipmentType | string;
  trade_type: TradeType | string;
  booking_number: string;
  mbl_type: MBL_Type | string;

  shipper: string;
  shipper_address: string;
  consignee: string;
  consignee_address: string;
  notify: string;
  notify_address: string;
  agent: string;
  agent_address: string;
  shipping_line: string;
  mbl_number: string;
  mbl_date: string;

  place_of_receipt: string;
  place_of_delivery: string;
  port_of_loading: string;
  port_of_discharge: string;
  voyage_number: string;
  transhipment_port: string;
  incoterm: INCOTERM | string;
  freight_type: FREIGHT_TYPE | string;
  sob_date: string;
  eta_pod: string;
  shipping_bill_number: string;
  shipping_bill_date: string;
  bill_of_entry: string;
  bill_of_entry_date: string;

  free_time_pol: string;
  free_time_pod: string;

  containers: IContainer[];

  created_by: string;

  created_at: string;
  updated_at: string;
}

export enum EMblField {
  exchange_rate = 'exchange_rate',
  movement_type = 'movement_type',

  shipment_folder_id = 'shipment_folder_id',
  shipment_mode = 'shipment_mode',
  shipment_type = 'shipment_type',
  trade_type = 'trade_type',
  booking_number = 'booking_number',
  mbl_type = 'mbl_type',

  shipper = 'shipper',
  shipper_address = 'shipper_address',
  consignee = 'consignee',
  consignee_address = 'consignee_address',
  notify = 'notify',
  notify_address = 'notify_address',
  agent = 'agent',
  agent_address = 'agent_address',
  shipping_line = 'shipping_line',
  mbl_number = 'mbl_number',
  mbl_date = 'mbl_date',

  place_of_receipt = 'place_of_receipt',
  place_of_delivery = 'place_of_delivery',
  port_of_loading = 'port_of_loading',
  port_of_discharge = 'port_of_discharge',
  voyage_number = 'voyage_number',
  transhipment_port = 'transhipment_port',
  incoterm = 'incoterm',
  freight_type = 'freight_type',
  sob_date = 'sob_date',
  eta_pod = 'eta_pod',
  shipping_bill_number = 'shipping_bill_number',
  shipping_bill_date = 'shipping_bill_date',
  bill_of_entry = 'bill_of_entry',
  bill_of_entry_date = 'bill_of_entry_date',

  free_time_pol = 'free_time_pol',
  free_time_pod = 'free_time_pod',

  containers = 'containers',
  created_by = 'created_by',

  created_at = 'created_at',
  updated_at = 'updated_at',
}

export enum EContainerField {
  container_number = 'container_number',
  line_seal = 'line_seal',
  shipper_seal = 'shipper_seal',
  custom_seal = 'custom_seal',
  container_size = 'container_size',
  container_type = 'container_type',
  package_count = 'package_count',
  package_type = 'package_type',
  description = 'description',
  gross_weight = 'gross_weight',
  net_weight = 'net_weight',
  volume = 'volume',
}

//ZOD SCHEMA
export const ContainerSchema = z
  .object({
    container_number: z.string(),
    line_seal: z.string(),
    shipper_seal: z.string(),
    customer_seal: z.string(),
    container_size: z.nativeEnum(CONTAINER_SIZE),
    container_type: z.nativeEnum(CONTAINER_TYPE),
    package_count: z.string(),
    package_type: z.string(),
    description: z.string(),
    gross_weight: z.string(),
    net_weight: z.string(),
    volume: z.string(),
  })
  .partial(); // ⇢ every key inside ContainerSchema is now optional

/* -------- MBL schema -------- */
export const MblSchema = z
  .object({
    shipment_folder_id: z.string(),

    shipment_mode: z.union([z.nativeEnum(ShipmentMode), z.string()]),
    shipment_type: z.union([z.nativeEnum(ShipmentType), z.string()]),
    trade_type: z.union([z.nativeEnum(TradeType), z.string()]),
    booking_number: z.string(),
    mbl_type: z.union([z.nativeEnum(MBL_Type), z.string()]),

    shipper: z.string(),
    shipper_address: z.string(),
    consignee: z.string(),
    consignee_address: z.string(),
    notify: z.string(),
    notify_address: z.string(),
    agent: z.string(),
    agent_address: z.string(),
    shipping_line: z.string(),
    mbl_number: z.string(),
    mbl_date: z.string(),

    place_of_receipt: z.string(),
    place_of_delivery: z.string(),
    port_of_loading: z.string(),
    port_of_discharge: z.string(),
    voyage_number: z.string(),
    transhipment_port: z.string(),
    incoterm: z.union([z.nativeEnum(INCOTERM), z.string()]),
    freight_type: z.union([z.nativeEnum(FREIGHT_TYPE), z.string()]),
    sob_date: z.string(),
    eta_pod: z.string(),
    shipping_bill_number: z.string(),
    shipping_bill_date: z.string(),
    bill_of_entry: z.string(),
    bill_of_entry_date: z.string(),

    free_time_pol: z.string(),
    free_time_pod: z.string(),

    containers: z.array(ContainerSchema),

    created_by: z.string(),

    created_at: z.string(),
    updated_at: z.string(),
  })
  .partial(); // ⇢ every key inside the MBL schema is now optional



export interface IFolderCard {
  folder_name: string;
  folder_id: string;
  created_by: string;
  created_at: string;
}
