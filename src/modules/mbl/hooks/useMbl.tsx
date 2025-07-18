import { FieldSchema } from '@generator/form/index.types';
import { hydratePayload } from '@shared/utils';
import { EContainerField, EMblField, IMbl } from '../index.types';
import { useDropDownData } from './useDropdownData';

const useMbl = () => {
  const { shipper, shippingLine, portData, agent, consignee, notify } = useDropDownData();

  //payload and form schema
  const mbl_payload: IMbl = {
    movement_type: '',
    shipment_folder_id: '',
    shipment_mode: '', // ShipmentMode
    shipment_type: '', // ShipmentType
    trade_type: '', // TradeType
    booking_number: '',
    mbl_type: '', // MBL_Type
    shipping_bill: [], // IShippingBill[]
    bill_of_entry: [], // IBillOfEntry[]

    shipper: '',
    shipper_address: '',
    consignee: '',
    consignee_address: '',
    notify: '',
    notify_address: '',
    agent: '',
    agent_address: '',
    shipping_line: '',
    mbl_number: '',
    mbl_date: '',

    place_of_receipt: '',
    place_of_delivery: '',
    port_of_loading: '',
    port_of_discharge: '',
    voyage_number: '',
    transhipment_port: '',
    incoterm: '', // INCOTERM
    freight_type: '', // FREIGHT_TYPE
    sob_date: '',
    eta_pod: '',
    shipping_bill_number: '',
    shipping_bill_date: '',
    bill_of_entry_date: '',

    free_time_pol: '',
    free_time_pod: '',

    containers: [], // IContainer[]

    created_by: '',

    created_at: '',
    updated_at: '',
  };

  const container_size_options = ['20GP', '40HQ', '20RF', '40RF', '20OT', '40OT', '20FR', '40FR'].map((item) => {
    return {
      label: item,
      value: item,
    };
  });

  //  common fields  : shipper, consignee, notify, second_notify,agent, shipping_line
  const mbl_form_schema: FieldSchema[] = [
    {
      type: 'dropdown',
      label: 'Mode Of Shipment',
      name: EMblField.shipment_mode,
      options: [
        { label: 'Sea', value: 'SEA' },
        { label: 'Air', value: 'AIR' },
      ],
      placeholder: 'Mode Of Shipment Sea/Air',
      required: false,
    },
    {
      type: 'dropdown',
      label: 'Movement Type',
      name: EMblField.movement_type,
      options: [
        { label: 'Rail', value: 'RAIL' },
        { label: 'Road', value: 'ROAD' },
      ],
      placeholder: 'Movement Type Rail/Road',
      required: false,
    },
    {
      type: 'dropdown',
      label: 'Type Of Shipment',
      name: EMblField.shipment_type,
      options: [
        { label: 'FCL', value: 'FCL' },
        { label: 'LCL', value: 'LCL' },
      ],
      placeholder: 'Type Of Shipment FCL/LCL',
      required: false,
    },
    {
      type: 'dropdown',
      label: 'Trade Type',
      name: EMblField.trade_type,
      options: [
        { label: 'Import', value: 'IMPORT' },
        { label: 'Export', value: 'EXPORT' },
      ],
      placeholder: 'Trade Type Import/Export',
      required: false,
      disabled: false,
    },
    { type: 'text', name: EMblField.booking_number, label: 'Booking Number', placeholder: 'Booking Number', required: false },
    {
      type: 'dropdown',
      label: 'MBL Type',
      name: EMblField.mbl_type,
      options: [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Obl', value: 'OBL' },
        { label: 'Seaway', value: 'SEAWAY' },
        { label: 'TLX', value: 'TLX' },
        { label: 'Surrender', value: 'SURRENDER' },
      ],
      placeholder: 'MBL Type',
      required: false,
    },
    {
      type: 'dropdown',
      label: 'Shipping Line',
      name: EMblField.shipping_line,
      options: [...(shippingLine ?? [])],
      placeholder: 'Shipping Line',
      required: false,
    },
    {
      type: 'dropdown',
      label: 'Shipper',
      name: 'shipper',
      placeholder: 'Shippers',
      required: false,
      options: [...(shipper ?? [])],
    },
    {
      type: 'dropdown',
      label: 'Consignee',
      name: 'consignee',
      placeholder: 'Consignee',
      required: false,
      options: [...(consignee ?? [])],
    },
    {
      type: 'dropdown',
      label: 'Notify',
      name: 'notify',
      placeholder: 'Notify',
      required: false,
      options: [...(notify ?? [])],
    },
    {
      type: 'dropdown',
      label: 'Second Notify',
      name: 'second_notify',
      placeholder: 'Second Notify',
      required: false,
      options: [...(notify ?? [])],
    },
    {
      type: 'dropdown',
      label: 'Origin Agent',
      name: 'agent_origin',
      colSpan: 1,
      placeholder: 'Agent',
      required: false,
      options: [...(agent ?? [])],
    },
    {
      type: 'dropdown',
      label: 'Destination Agent',
      name: 'agent_destination',
      colSpan: 1,
      placeholder: 'Agent',
      required: false,
      options: [...(agent ?? [])],
    },
    {
      type: 'text',
      label: 'MBL Number',
      name: EMblField.mbl_number,
      placeholder: 'MBL Number',
      required: false,
    },
    {
      type: 'date',
      label: 'MBL Date',
      name: EMblField.mbl_date,
      placeholder: 'MBL Date',
      colSpan: 2,
      required: false,
    },
    {
      type: 'text',
      label: 'Pre Carriage By',
      name: EMblField.place_carriage,
      placeholder: 'Place of Pre Carriage By',
      required: false,
    },
    {
      type: 'dropdown',
      options: [...(portData ?? [])],
      label: 'Place Of Receipt',
      name: EMblField.place_of_receipt,
      placeholder: 'Place Of Receipt',
      required: false,
    },
    {
      type: 'dropdown',
      options: [...(portData ?? [])],
      label: 'Port Of Loading',
      name: EMblField.port_of_loading,
      placeholder: 'Port Of Loading',
      colSpan: 2,
      required: false,
    },
    {
      type: 'dropdown',
      options: [...(portData ?? [])],
      label: 'Port Of Discharge',
      name: EMblField.port_of_discharge,
      placeholder: 'Place Of Receipt',
      required: false,
    },
    {
      type: 'dropdown',
      options: [...(portData ?? [])],
      label: 'Place Of Delivery',
      name: EMblField.place_of_delivery,
      placeholder: 'Port Of Delivery',
      colSpan: 2,
      required: false,
    },
    {
      type: 'text',
      label: 'Vessel Name',
      name: EMblField.vessel_number,
      placeholder: 'Vessel Number ',
      required: false,
    },
    {
      type: 'text',
      label: 'Voyage Number',
      name: EMblField.voyage_number,
      placeholder: 'Vessel Number',
      required: false,
    },
    {
      type: 'dropdown',
      options: [...(portData ?? [])],
      label: 'Transhipment Port',
      name: EMblField.transhipment_port,
      placeholder: 'Transhipment Port',
      colSpan: 2,
      required: false,
    },
    {
      type: 'text',
      label: 'Marks & Numbers',
      name: EMblField.marks_numbers,
      placeholder: 'Marks & Numbers',
      required: false,
    },
    {
      type: 'dropdown',
      label: 'Incoterms',
      name: EMblField.incoterm,
      placeholder: 'Incoterms',
      options: [
        { label: 'FOB', value: 'FOB' },
        { label: 'EXW', value: 'EXW' },
        { label: 'CIF', value: 'CIF' },
        { label: 'FCA', value: 'FCA' },
      ],
      required: false,
    },
    {
      type: 'dropdown',
      label: 'Freight Type',
      name: EMblField.freight_type,
      placeholder: 'Freight Type',
      options: [
        { label: 'Pre Paid', value: 'PRE' },
        { label: 'Collect', value: 'COLLECT' },
      ],
      colSpan: 2,
      required: false,
    },
    {
      type: 'text',
      label: 'Exchange Rate',
      name: EMblField.exchange_rate,
      placeholder: 'Exchange Rate',
      required: false,
    },
    {
      type: 'date',
      label: 'Date Of SOB',
      name: EMblField.sob_date,
      placeholder: 'Date of SOB',
      colSpan: 1,
      required: false,
    },
    {
      type: 'date',
      label: 'ETA POD',
      name: EMblField.eta_pod,
      placeholder: 'ETA POD',
      colSpan: 1,
      required: false,
    },
    {
      type: 'text',
      label: 'Free Time At Origin',
      name: EMblField.free_time_origin,
      placeholder: 'Free Time At Origin',
      colSpan: 1,
      required: false,
    },
    {
      type: 'text',
      label: 'Free Time At Destination',
      name: EMblField.free_time_destination,
      placeholder: 'Free Time At Destination',
      colSpan: 2,
      required: false,
    },
    {
      type: 'text',
      label: 'Extra Free Time at Destination (Purchased)',
      name: EMblField.extra_free_time,
      placeholder: 'Extra Free Time at Destination (Purchased)',
      colSpan: 1,
      required: false,
    },
    {
      type: 'date',
      label: 'ETD POL',
      name: 'etd_pol',
      placeholder: 'ETD POL',
      colSpan: 1,
      required: false,
    },

    {
      type: 'array',
      label: 'Container Details',
      name: EMblField.containers,
      colSpan: 2,
      item: {
        type: 'group',
        fields: [
          {
            type: 'text',
            label: 'Container Number',
            name: EContainerField.container_number,
            placeholder: 'Container Number',
          },
          {
            type: 'dropdown',
            options: [...container_size_options],

            placeholder: 'Container Size',
            label: 'Container Size',
            name: EContainerField.container_size,
            required: false,
          },
          {
            type: 'dropdown',
            options: [
              { label: 'General', value: 'GENERAL' },
              { label: 'Hazardous', value: 'HAZARDOUS' },
              { label: 'Reefer', value: 'REEFER' },
            ],
            placeholder: 'Container Type',
            label: 'Container Type',
            name: EContainerField.container_type,
            required: false,
          },

          {
            type: 'text',
            label: 'Line Seal',
            name: EContainerField.line_seal,
            placeholder: 'Line Seal',
            colSpan: 3,
          },
          {
            type: 'text',
            label: 'Shipper Seal',
            name: EContainerField.shipper_seal,
            placeholder: 'Shipper Seal',
          },
          {
            type: 'text',
            label: 'Custom Seal',
            name: EContainerField.custom_seal,
            placeholder: 'Custom Seal',
            colSpan: 2,
          },
          {
            type: 'text',
            label: 'Net Weight',
            name: EContainerField.net_weight,
            placeholder: 'Net Weight',
            colSpan: 3,
          },
          {
            type: 'text',
            label: 'Gross Weight',
            name: EContainerField.gross_weight,
            placeholder: 'Gross Weight',
          },
          {
            type: 'text',
            label: 'Volume',
            name: EContainerField.volume,
            placeholder: 'Volume',
            colSpan: 2,
          },
          {
            type: 'text',
            label: 'Number Of Package',
            name: EContainerField.package_count,
            placeholder: 'Number Of Package',
            colSpan: 3,
          },
          {
            type: 'text',
            label: 'Package Type',
            name: EContainerField.package_type,
            placeholder: 'Package Type',
          },
          {
            type: 'text',
            label: 'Description',
            name: EContainerField.description,
            placeholder: 'Description',
            colSpan: 2,
          },
        ],
      },
      required: false,
    },
  ];

  // show these fields if movement_type = rail/road and trade_type = export

  const export_rail_fields: FieldSchema[] = [
    {
      type: 'date',
      label: 'ETA FPOD',
      name: 'etd_fpod',
      placeholder: 'ETD FPOD',
      colSpan: 2,
      required: false,
    },
    {
      type: 'array',
      label: 'Shipping Bill',
      name: 'shipping_bill',
      item: {
        type: 'group',
        fields: [
          {
            type: 'text',
            label: 'Shipping Bill Number',
            name: EMblField.shipping_bill_number,
            placeholder: 'Shipping Bill Number',
            required: false,
          },
          {
            type: 'date',
            label: 'Shipping Bill Date',
            name: EMblField.shipping_bill_date,
            placeholder: 'Shipping Bill Number',
            required: false,
          },
        ],
      },
    },
  ];

  const export_rail_container_fields: FieldSchema[] = [
    {
      type: 'date',
      label: 'Date Of Container Pickup',
      name: EContainerField.container_pickup_date,
      required: false,
    },
    {
      type: 'date',
      label: 'Date Of Container Handover',
      name: EContainerField.container_handover_date,
      required: false,
    },
    {
      type: 'date',
      label: 'Date Of Rail Out',
      name: EContainerField.rail_out_date,
      required: false,
    },
    {
      type: 'date',
      label: 'Date Of Arrival at POL',
      name: 'arrival_pol_date',
      required: false,
    },
  ];

  const export_road_container_fields: FieldSchema[] = [
    {
      type: 'date',
      label: 'Date Of Container Pickup',
      name: EContainerField.container_pickup_date,
      required: false,
    },
    {
      type: 'date',
      label: 'Date Of Container Gate In',
      name: 'gate_in_date',
      required: false,
    },
  ];

  // show these fields if movement_type = rail and trade_type = import
  const import_rail_fields: FieldSchema[] = [
    {
      type: 'date',
      label: 'ATA POD',
      placeholder: 'ATA POD',
      name: 'ata_pod',
      required: false,
    },
    {
      type: 'array',
      name: 'bill_of_entry',
      label: 'Bill of Entry',
      item: {
        type: 'group',
        fields: [
          {
            type: 'text',
            label: 'Bill of Entry Number',
            name: EMblField.bill_of_entry_number,
            placeholder: 'Bill of Entry Number',
            required: false,
          },
          {
            type: 'date',
            label: 'Bill of Entry Date',
            name: EMblField.bill_of_entry_date,
            placeholder: 'Bill of Entry Date',
            required: false,
          },
        ],
      },
    },
  ];

  const import_rail_container_fields: FieldSchema[] = [
    {
      type: 'date',
      label: 'Date of Rail Out',
      name: EContainerField.rail_out_date,
      required: false,
    },
    {
      type: 'date',
      label: 'Date Of Arrival at FPOD',
      name: EContainerField.arrival_fpod_date,
      required: false,
    },
    {
      type: 'date',
      label: 'Delivery Order Date',
      name: EContainerField.delivery_order_date,
      required: false,
    },
    {
      type: 'date',
      label: 'Validity of Delivery Order',
      name: EContainerField.delivery_validity_date,
      required: false,
    },
  ];

  const conditionalFieldsMap = {
    EXPORT_RAIL: export_rail_fields,
    EXPORT_ROAD: export_rail_fields,
    IMPORT_RAIL: import_rail_fields,
    EXPORT_RAIL_CONTAINER: export_rail_container_fields,
    EXPORT_ROAD_CONTAINER: export_road_container_fields,
    IMPORT_RAIL_CONTAINER: import_rail_container_fields,
  };
  return {
    mbl_payload: hydratePayload(mbl_payload),
    mbl_form_schema,
    export_rail_container_fields,
    export_rail_fields,
    export_road_container_fields,
    import_rail_fields,
    conditionalFieldsMap,
  };
};

export default useMbl;
