import { FieldSchema } from '@generator/form/index.types';
import { Checkbox } from '@shared/components';
import Column from '@shared/components/Column';
import { ColumnDef } from '@tanstack/react-table';
import { EVendor, IVendor, VendorType } from '../index.types';

export const useVendorPage = () => {
  const payload: IVendor = {
    vendor_name: '',
    _id: '',
    vendor_type: [] as VendorType[],
    locations: [
      {
        _id: '',
        city: '',
        country: '',
        state: '',
        pan_number: '',
        address: '',
        gst_number: '',
        fax: '',
        mobile_number: '',
        pin_code: '',
        telephone: '',
      },
    ],
  };

  const formSchema: FieldSchema[] = [
    {
      name: EVendor.vendor_name,
      label: 'Vendor Name',
      type: 'text',
      required: true,
    },
    {
      name: EVendor.vendor_type,
      label: 'Vendor Type',
      type: 'multiselect',
      options: [
        { label: 'Shipper', value: 'shipper' },
        { label: 'Consignee', value: 'consignee' },
        { label: 'Shipping Line', value: 'shipping_line' },
        { label: 'Freight Forwarder', value: 'freight_forwarder' },
        { label: 'Agent', value: 'agent' },
        { label: 'CHA', value: 'cha' },
        { label: 'Notify', value: 'notify' },
        { label: 'Second Notify', value: 'second_notify' },
      ],
    },
    {
      name:"credit_days", 
      label:"Credit Days (only number)", 
      type: 'text', 
      placeholder:"ex: 15"
    },
    {
      name: 'locations',
      label: 'Locations',
      type: 'array',
      required: true,
      item: {
        type: 'group',
        fields: [
          {
            name: EVendor.city,
            label: 'City',
            type: 'text',
            required: true,
          },
          {
            name: EVendor.address,
            label: 'Address',
            type: 'text',
            required: true,
          },
          {
            name: EVendor.state,
            label: 'State',
            type: 'text',
            required: true,
          },
          {
            name: EVendor.country,
            label: 'Country',
            type: 'text',
            required: true,
          },
          {
            name: EVendor.pin_code,
            label: 'Pin Code',
            type: 'text',
            required: true,
          },
          {
            name: EVendor.telephone,
            label: 'Telephone',
            type: 'text',
            required: true,
          },
          {
            name: EVendor.mobile_number,
            label: 'Mobile Number',
            type: 'text',
            required: true,
          },
          {
            name: EVendor.fax,
            label: 'FAX',
            type: 'text',
            required: true,
          },
          {
            name: EVendor.gst_number,
            label: 'GST Number',
            type: 'text',
            required: true,
          },
          {
            name: EVendor.pan_number,
            label: 'Pan Number',
            type: 'text',
            required: true,
          },
        ],
      },
    },
  ];

  const columns: ColumnDef<IVendor>[] = [
    {
      id: '_id',
      size: 4,
      header: ({ table }) => {
        return <Checkbox checked={Boolean(table.getIsAllRowsSelected())} onChange={table.getToggleAllRowsSelectedHandler()} />;
      },

      cell: ({ row }) => (
        <Checkbox
          checked={Boolean(row.getIsSelected())}
          onChange={() => {
            row.getToggleSelectedHandler();
            row.toggleSelected();
          }}
        />
      ),
    },

    {
      accessorKey: EVendor.vendor_name,
      header: ({ header }) => <Column header={header} title={'Vendor Name'} />,
    },
    {
      accessorKey: EVendor.vendor_type,
      header: ({ header }) => <Column header={header} title={'Vendor Type'} />,
    },
    {
      accessorKey: EVendor.city,
      header: ({ header }) => <Column header={header} title={'City'} />,
      cell: ({ row }) => <div>{row.original.locations[0]?.city}</div>,
    },

    {
      accessorKey: EVendor.pin_code,
      header: () => <button>Pin Code</button>,
      enableSorting: false,

      cell: ({ row }) => <div>{row.original.locations[0]?.pin_code}</div>,
    },
    {
      accessorKey: EVendor.country,
      header: () => <button>Country</button>,
      enableSorting: false,

      cell: ({ row }) => <div>{row.original.locations[0]?.country}</div>,
    },
    {
      accessorKey: EVendor.telephone,
      header: () => <button>Telephone</button>,
      enableSorting: false,

      cell: ({ row }) => <div>{row.original.locations[0]?.telephone}</div>,
    },
    {
      accessorKey: EVendor.mobile_number,
      header: () => <button>Mobile</button>,
      enableSorting: false,

      cell: ({ row }) => <div>{row.original.locations[0].mobile_number}</div>,
    },
    {
      accessorKey: EVendor.fax,
      header: () => <button>Fax</button>,
      enableSorting: false,

      cell: ({ row }) => <div>{row.original.locations[0].fax}</div>,
    },
    {
      accessorKey: EVendor.gst_number,
      header: () => <button>GST</button>,
      enableSorting: false,

      cell: ({ row }) => <div>{row.original.locations[0].gst_number}</div>,
    },
    {
      accessorKey: EVendor.pan_number,
      header: () => <button>PAN</button>,
      cell: ({ row }) => <div>{row.original.locations[0].pan_number}</div>,
      enableSorting: false,
    },
  ];

  return { formSchema, columns, payload };
};

export default useVendorPage;
