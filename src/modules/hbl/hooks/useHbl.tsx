import { FieldSchema } from '@generator/form/index.types';
import { IHbl, ShipmentMode, TradeType, ShipmentType, INCOTERM, FREIGHT_TYPE } from '../index.types';
import { useDropDownData as useMblDropDownData } from '@modules/mbl/hooks/useDropdownData'; // Reusing for common dropdowns
import { hydratePayload } from '@shared/utils';

// Assuming EContainerField and EMblField might have some reusable enum values
// For HBL specific fields, we might need new enums or just use string literals.
// For now, using string literals for HBL specific fields.

const useHbl = (mblId?: string, shipmentFolderId?: string) => {
  const { shipper, consignee, notify, agent, portData, shippingLine } = useMblDropDownData(); // Reusing MBL dropdown data

  const hbl_payload: IHbl = {
    mbl_id: mblId || '',
    shipment_folder_id: shipmentFolderId || '',

    hbl_number: '',
    hbl_date: '',
    reference_number: '',

    shipper: '',
    shipper_address: '',
    consignee: '',
    consignee_address: '',
    notify_party: '',
    notify_party_address: '',
    forwarding_agent: '',
    forwarding_agent_address: '',

    shipment_mode: '', // Default or inherit from MBL
    trade_type: '',    // Default or inherit from MBL
    shipment_type: '',

    place_of_receipt: '',
    port_of_loading: '',
    port_of_discharge: '',
    place_of_delivery: '',
    vessel_name: '',
    voyage_number: '',

    marks_and_numbers: '',
    description_of_goods: '',
    number_of_packages: '',
    package_type: '',
    gross_weight: '',
    net_weight: '',
    measurement_cbm: '',

    incoterm: '',
    freight_type: '',

    etd_pol: '',
    eta_pod: '',

    containers: [], // IHbl might have its own container list or reference MBL containers

    special_instructions: '',
    place_of_issue: '',
    date_of_issue: '',

    created_by: '', // Should be set by auth context or backend
    created_at: '', // Backend
    updated_at: '', // Backend
  };

  const container_size_options = ['20GP', '40HQ', '20RF', '40RF', '20OT', '40OT', '20FR', '40FR'].map((item) => ({
    label: item,
    value: item,
  }));

  const hbl_form_schema: FieldSchema[] = [
    // Group: HBL Info
    { type: 'text', name: 'hbl_number', label: 'HBL Number', placeholder: 'Enter HBL Number', required: true, colSpan: 1 },
    { type: 'date', name: 'hbl_date', label: 'HBL Date', placeholder: 'Select HBL Date', required: true, colSpan: 1 },
    { type: 'text', name: 'reference_number', label: 'Reference Number', placeholder: 'Enter Reference Number', colSpan: 1 },

    // Group: Parties
    {
      type: 'dropdown',
      label: 'Shipper',
      name: 'shipper',
      placeholder: 'Select Shipper',
      required: true,
      options: [...(shipper ?? [])],
      colSpan: 1,
    },
    { type: 'textarea', name: 'shipper_address', label: 'Shipper Address', placeholder: 'Enter Shipper Address', colSpan: 2 },
    {
      type: 'dropdown',
      label: 'Consignee',
      name: 'consignee',
      placeholder: 'Select Consignee',
      required: true,
      options: [...(consignee ?? [])],
      colSpan: 1,
    },
    { type: 'textarea', name: 'consignee_address', label: 'Consignee Address', placeholder: 'Enter Consignee Address', colSpan: 2 },
    {
      type: 'dropdown',
      label: 'Notify Party',
      name: 'notify_party',
      placeholder: 'Select Notify Party',
      required: true,
      options: [...(notify ?? [])], // Assuming notify can be reused
      colSpan: 1,
    },
    { type: 'textarea', name: 'notify_party_address', label: 'Notify Party Address', placeholder: 'Enter Notify Party Address', colSpan: 2 },
    {
      type: 'dropdown',
      label: 'Forwarding Agent',
      name: 'forwarding_agent',
      placeholder: 'Select Forwarding Agent',
      options: [...(agent ?? [])], // Assuming agent can be reused
      colSpan: 1,
    },
    { type: 'textarea', name: 'forwarding_agent_address', label: 'Forwarding Agent Address', placeholder: 'Enter Forwarding Agent Address', colSpan: 2 },

    // Group: Shipment Details
    {
      type: 'dropdown',
      label: 'Mode Of Shipment',
      name: 'shipment_mode',
      options: [
        { label: 'Sea', value: ShipmentMode.SEA },
        { label: 'Air', value: ShipmentMode.AIR },
      ],
      placeholder: 'Mode Of Shipment',
      required: false, // Should this be editable or inherited?
    },
    {
      type: 'dropdown',
      label: 'Trade Type',
      name: 'trade_type',
      options: [
        { label: 'Import', value: TradeType.IMPORT },
        { label: 'Export', value: TradeType.EXPORT },
      ],
      placeholder: 'Trade Type',
      required: false, // Should this be editable or inherited?
    },
    {
      type: 'dropdown',
      label: 'Shipment Type (HBL)',
      name: 'shipment_type',
      options: [
        { label: 'FCL', value: ShipmentType.FCL },
        { label: 'LCL', value: ShipmentType.LCL },
        // Add other relevant types if HBL can have more specific ones
      ],
      placeholder: 'Type Of Shipment for HBL',
      required: false,
    },
    {
      type: 'dropdown',
      options: [...(portData ?? [])],
      label: 'Place Of Receipt',
      name: 'place_of_receipt',
      placeholder: 'Place Of Receipt',
    },
    {
      type: 'dropdown',
      options: [...(portData ?? [])],
      label: 'Port Of Loading',
      name: 'port_of_loading',
      placeholder: 'Port Of Loading',
      required: true,
    },
    {
      type: 'dropdown',
      options: [...(portData ?? [])],
      label: 'Port Of Discharge',
      name: 'port_of_discharge',
      placeholder: 'Port Of Discharge',
      required: true,
    },
    {
      type: 'dropdown',
      options: [...(portData ?? [])],
      label: 'Place Of Delivery',
      name: 'place_of_delivery',
      placeholder: 'Place Of Delivery',
    },
    { type: 'text', name: 'vessel_name', label: 'Vessel Name', placeholder: 'Enter Vessel Name' },
    { type: 'text', name: 'voyage_number', label: 'Voyage Number', placeholder: 'Enter Voyage Number' },

    // Group: Goods Details
    { type: 'textarea', name: 'marks_and_numbers', label: 'Marks & Numbers', placeholder: 'Enter Marks & Numbers', colSpan: 3 },
    { type: 'textarea', name: 'description_of_goods', label: 'Description of Goods', placeholder: 'Enter Description', required: true, colSpan: 3 },
    { type: 'text', name: 'number_of_packages', label: 'Number of Packages', placeholder: 'e.g., 100' },
    { type: 'text', name: 'package_type', label: 'Package Type', placeholder: 'e.g., Cartons, Pallets' },
    { type: 'text', name: 'gross_weight', label: 'Gross Weight (KG)', placeholder: 'e.g., 1200.50', required: true },
    { type: 'text', name: 'net_weight', label: 'Net Weight (KG)', placeholder: 'e.g., 1150.00' },
    { type: 'text', name: 'measurement_cbm', label: 'Measurement (CBM)', placeholder: 'e.g., 15.75' },


    // Group: Terms & Dates
    {
      type: 'dropdown',
      label: 'Incoterms',
      name: 'incoterm',
      placeholder: 'Select Incoterm',
      options: Object.values(INCOTERM).map(val => ({ label: val, value: val })),
    },
    {
      type: 'dropdown',
      label: 'Freight Type',
      name: 'freight_type',
      placeholder: 'Select Freight Type',
      options: Object.values(FREIGHT_TYPE).map(val => ({ label: val, value: val })),
    },
    { type: 'date', name: 'etd_pol', label: 'ETD POL', placeholder: 'Estimated Departure POL' },
    { type: 'date', name: 'eta_pod', label: 'ETA POD', placeholder: 'Estimated Arrival POD' },

    // Group: Issuance
    { type: 'text', name: 'place_of_issue', label: 'Place of HBL Issue', placeholder: 'e.g., City, Country' },
    { type: 'date', name: 'date_of_issue', label: 'Date of HBL Issue', placeholder: 'Select Date' },
    { type: 'textarea', name: 'special_instructions', label: 'Special Instructions', placeholder: 'Any special instructions for this HBL', colSpan: 3 },


    // Group: Containers (Optional, if HBL has its own specific containers or details)
    // This assumes HBL might itemize containers if it's an LCL part of an FCL MBL,
    // or if specific container details differ at HBL level.
    {
      type: 'array',
      label: 'Container Details (for this HBL)',
      name: 'containers', // Matches IHbl containers
      colSpan: 3, // Full width for the array
      item: {
        type: 'group',
        fields: [
          // Simplified container fields for HBL, or reuse MBL's EContainerField if identical
          { type: 'text', label: 'Container Number', name: 'container_number', placeholder: 'Container Number', required: true },
          {
            type: 'dropdown', options: [...container_size_options],
            placeholder: 'Size', label: 'Size', name: 'container_size',
          },
          {
            type: 'dropdown',
            options: [ { label: 'General', value: 'GENERAL' }, { label: 'Hazardous', value: 'HAZARDOUS' }, { label: 'Reefer', value: 'REEFER' } ],
            placeholder: 'Type', label: 'Type', name: 'container_type',
          },
          { type: 'text', label: 'Seal Number', name: 'line_seal', placeholder: 'Seal Number' }, // Example field
          { type: 'text', label: 'Packages', name: 'package_count', placeholder: 'No. of Packages in Cntr' },
          { type: 'text', label: 'Weight (KG)', name: 'gross_weight', placeholder: 'Gross Weight in Cntr' },
          // Add more fields as necessary, reusing from MBL's EContainerField or defining new ones
           {
            type: 'text',
            label: 'Description (in Cntr)',
            name: 'description', // from IContainer
            placeholder: 'Description of goods in container',
            colSpan: 2,
          },
        ],
      },
      required: false, // Containers might be optional at HBL level or managed differently
    },
  ];

  return {
    hbl_payload: hydratePayload(hbl_payload), // Ensure undefined are null
    hbl_form_schema,
    // Expose conditional logic functions if HBL form has dynamic fields like MBL
  };
};

export default useHbl;
