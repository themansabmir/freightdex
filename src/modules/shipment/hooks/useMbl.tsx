import { FieldSchema } from '@generator/form/index.types';
import { usePortApi } from '@modules/port/hooks/usePortApi';
import { formatShippingLines, formatVendors } from '@modules/vendor/helper';
import { useVendorApi } from '@modules/vendor/hooks/useVendorApi';
import { useEffect, useState } from 'react';
import { EContainerField, EMblField, IMbl } from '../index.types';

interface options {
  label: string;
  value: string;
}
type DropdownOptions = options[] | undefined | [];
const searchQuery = {
  search: '',
  limit: '0',
  skip: '0',
  sortBy: '',
  sortOrder: '',
};
const useMbl = () => {
  const [shipper, setShipper] = useState<DropdownOptions>([]);
  const [consignee, setConsignee] = useState<DropdownOptions>([]);
  const [notify, setNotify] = useState<DropdownOptions>([]);
  const [agent, setAgent] = useState<DropdownOptions>([]);
  const [shippingLine, setShippingLine] = useState<DropdownOptions>([]);
  const [portData, setPortData] = useState<DropdownOptions>([]);

  //DYNAMIC DATA FOR DROPDOWNS
  const { useGetVendors } = useVendorApi();
  const { useGetPort } = usePortApi();
  const { data: ports } = useGetPort(searchQuery);
  const { data: vendors, isLoading } = useGetVendors(searchQuery);

  useEffect(() => {
    if (vendors?.response) {
      const shippers = formatVendors(vendors?.response, 'shipper');
      const consignees = formatVendors(vendors?.response, 'consignee');
      const agents = formatVendors(vendors?.response, 'agent');
      const notify = formatVendors(vendors?.response, 'notify');
      const shippingLines = formatShippingLines(vendors?.response);
      const portOptions = ports?.response?.map((item) => {
        return {
          label: `${item.port_name}-(${item.port_code?.toUpperCase()})`,
          value: item._id,
        };
      });

      setShipper(shippers);
      setConsignee(consignees);
      setAgent(agents);
      setNotify(notify);
      setShippingLine(shippingLines);
      setPortData(portOptions);
    }
  }, [isLoading]);

  //payload and form schema
  const mbl_payload: IMbl = {
    shipment_folder_id: '',
    shipment_mode: '', // ShipmentMode
    shipment_type: '', // ShipmentType
    trade_type: '', // TradeType
    booking_number: '',
    mbl_type: '', // MBL_Type

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
    bill_of_entry: '',
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
    },
    { type: 'text', name: EMblField.booking_number, label: 'Booking Number', placeholder: 'Booking Number', required: false },
    {
      type: 'dropdown',
      label: 'MBL Type',
      name: EMblField.mbl_type,
      options: [
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
      label: 'Agent',
      name: 'agent',
      colSpan: 2,
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
      type: 'text',
      label: 'Place Of Delivery',
      name: EMblField.place_of_delivery,
      placeholder: 'Port Of Delivery',
      colSpan: 2,
      required: false,
    },
    {
      type: 'text',
      label: 'Vessel/Voyage Number',
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
      type: 'text',
      label: 'ETA POD',
      name: EMblField.eta_pod,
      placeholder: 'ETA POD',
      colSpan: 1,
      required: false,
    },
    {
      type: 'text',
      label: 'Shipping Bill Number',
      name: EMblField.shipping_bill_number,
      placeholder: 'Shipping Bill Number',
      colSpan: 1,
      required: false,
    },
    {
      type: 'date',
      label: 'Shipping Bill Date',
      name: EMblField.shipping_bill_date,
      placeholder: 'Shipping Bill Date',
      colSpan: 2,
      required: false,
    },
    {
      type: 'text',
      label: 'Bill Of Entry Number',
      name: EMblField.bill_of_entry,
      placeholder: 'Bill Of Entry Number',
      colSpan: 1,
      required: false,
    },
    {
      type: 'date',
      label: 'Bill Of Entry Date',
      name: EMblField.bill_of_entry_date,
      placeholder: 'Bill Of Entry Date',
      colSpan: 2,
      required: false,
    },
    {
      type: 'text',
      label: 'Free Time At POL',
      name: EMblField.free_time_pol,
      placeholder: 'Free Time At POL',
      colSpan: 1,
      required: false,
    },
    {
      type: 'text',
      label: 'Free Time At POD',
      name: EMblField.free_time_pod,
      placeholder: 'Free Time At POD',
      colSpan: 2,
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

  return { mbl_payload, mbl_form_schema };
};

export default useMbl;
