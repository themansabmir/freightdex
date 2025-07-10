import { z } from 'zod';
import { IContainer, ContainerSchema, TradeType, ShipmentMode, ShipmentType, INCOTERM, FREIGHT_TYPE } from '@modules/mbl/index.types'; // Reusing from MBL

// Enums can be reused from MBL or defined specifically for HBL if they differ
// For now, let's assume many enums can be reused or are similar

export interface IHbl {
  [key: string]: unknown;

  mbl_id: string; // To link HBL to an MBL
  shipment_folder_id: string; // To link HBL to a shipment folder

  hbl_number: string;
  hbl_date: string;
  reference_number?: string; // Optional reference number

  // Parties involved - can be strings or IDs linking to a contacts/vendor module
  shipper: string;
  shipper_address?: string;
  consignee: string;
  consignee_address?: string;
  notify_party: string;
  notify_party_address?: string;
  forwarding_agent?: string; // Optional: if different from MBL agent
  forwarding_agent_address?: string;

  // Shipment details - some might be inherited or vary from MBL
  shipment_mode: ShipmentMode | string; // Likely same as MBL
  trade_type: TradeType | string; // Likely same as MBL
  shipment_type?: ShipmentType | string; // e.g., LCL within an FCL MBL

  place_of_receipt?: string;
  port_of_loading: string;
  port_of_discharge: string;
  place_of_delivery?: string;
  vessel_name?: string; // Can be same as MBL or different for legs
  voyage_number?: string; // Can be same as MBL

  // Goods details
  marks_and_numbers?: string;
  description_of_goods: string;
  number_of_packages?: string;
  package_type?: string;
  gross_weight: string; // Weight for this HBL's cargo
  net_weight?: string;
  measurement_cbm?: string; // Volume for this HBL's cargo

  incoterm?: INCOTERM | string;
  freight_type?: FREIGHT_TYPE | string; // e.g. Prepaid, Collect

  // Dates specific to HBL
  etd_pol?: string; // Estimated Time of Departure from Port of Loading
  eta_pod?: string; // Estimated Time of Arrival at Port of Discharge

  // Container details - an HBL can have its own set of containers or refer to containers in MBL
  // For simplicity, let's assume an HBL can list specific containers relevant to it.
  // This might be a subset of MBL containers or specific details if LCL.
  containers?: IContainer[]; // Reusing IContainer for now

  // Other HBL specific fields
  special_instructions?: string;
  place_of_issue?: string; // Place where HBL was issued
  date_of_issue?: string;  // Date HBL was issued

  created_by: string;
  created_at: string;
  updated_at: string;
}

// Zod Schema for HBL validation
export const HblSchema = z
  .object({
    mbl_id: z.string().min(1, "MBL ID is required"),
    shipment_folder_id: z.string().min(1, "Shipment Folder ID is required"),

    hbl_number: z.string().min(1, "HBL number is required"),
    hbl_date: z.string().min(1, "HBL date is required"), // Consider validating as date string
    reference_number: z.string().optional(),

    shipper: z.string().min(1, "Shipper is required"),
    shipper_address: z.string().optional(),
    consignee: z.string().min(1, "Consignee is required"),
    consignee_address: z.string().optional(),
    notify_party: z.string().min(1, "Notify party is required"),
    notify_party_address: z.string().optional(),
    forwarding_agent: z.string().optional(),
    forwarding_agent_address: z.string().optional(),

    shipment_mode: z.union([z.nativeEnum(ShipmentMode), z.string()]).optional(),
    trade_type: z.union([z.nativeEnum(TradeType), z.string()]).optional(),
    shipment_type: z.union([z.nativeEnum(ShipmentType), z.string()]).optional(),

    place_of_receipt: z.string().optional(),
    port_of_loading: z.string().min(1, "Port of loading is required"),
    port_of_discharge: z.string().min(1, "Port of discharge is required"),
    place_of_delivery: z.string().optional(),
    vessel_name: z.string().optional(),
    voyage_number: z.string().optional(),

    marks_and_numbers: z.string().optional(),
    description_of_goods: z.string().min(1, "Description of goods is required"),
    number_of_packages: z.string().optional(),
    package_type: z.string().optional(),
    gross_weight: z.string().min(1, "Gross weight is required"),
    net_weight: z.string().optional(),
    measurement_cbm: z.string().optional(),

    incoterm: z.union([z.nativeEnum(INCOTERM), z.string()]).optional(),
    freight_type: z.union([z.nativeEnum(FREIGHT_TYPE), z.string()]).optional(),

    etd_pol: z.string().optional(), // Consider date validation
    eta_pod: z.string().optional(), // Consider date validation

    containers: z.array(ContainerSchema).optional(), // Reusing ContainerSchema

    special_instructions: z.string().optional(),
    place_of_issue: z.string().optional(),
    date_of_issue: z.string().optional(), // Consider date validation

    // created_by, created_at, updated_at are usually handled by the backend
    // created_by: z.string(),
    // created_at: z.string(),
    // updated_at: z.string(),
  })
  .partial({ // Making most fields optional for flexibility during creation vs update
    shipment_mode: true,
    trade_type: true,
    shipment_type: true,
    place_of_receipt: true,
    place_of_delivery: true,
    vessel_name: true,
    voyage_number: true,
    marks_and_numbers: true,
    number_of_packages: true,
    package_type: true,
    net_weight: true,
    measurement_cbm: true,
    incoterm: true,
    freight_type: true,
    etd_pol: true,
    eta_pod: true,
    containers: true,
    special_instructions: true,
    place_of_issue: true,
    date_of_issue: true,
    shipper_address: true,
    consignee_address: true,
    notify_party_address: true,
    forwarding_agent: true,
    forwarding_agent_address: true,
    reference_number: true,
  });
