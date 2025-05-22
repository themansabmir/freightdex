import { FieldSchema } from '@generator/form/index.types';
import { Checkbox } from '@shared/components';
import Column from '@shared/components/Column';
import { ColumnDef } from '@tanstack/react-table';
import { EVendor, IVendor } from '../index.types';
import { useMemo } from 'react';

export const useVendorPage = () => {
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
      ],
    },
    {
      name: 'locations',
      label: 'Locations',
      type: 'array',
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

  const generateDummyData = (count: number) => {
    const statuses = ['Single', 'In Relationship', 'Complicated', 'Married'];
    return Array.from(
      { length: count },
      (_, i): IVendor => ({
        vendor_name: `First${i + 1} long String Content to show in column`,
        vendor_type: ['shipper'],
        _id: String(i + 10),
        id: String(i + 10),
        locations: [
          {
            city: statuses[Math.floor(Math.random() * statuses.length)],
            pin_code: statuses[Math.floor(Math.random() * statuses.length)],
            country: statuses[Math.floor(Math.random() * statuses.length)],
            telephone: statuses[Math.floor(Math.random() * statuses.length)],
            mobile_number: statuses[Math.floor(Math.random() * statuses.length)], // Random status
            address: 'my address',
            state: 'delhi',
            gst_number: String(Math.floor(Math.random() * 100)), // Progress between 0-100
            pan_number: String(Math.floor(Math.random() * 100)),
            fax: Math.floor(Math.random() * 100),
          },
        ],
      })
    );
  };
  const data = useMemo(() => {
    return generateDummyData(50);
  }, []);

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

      cell: ({ row }) => <div>{row.original.locations[0]?.pin_code}</div>,
    },
    {
      accessorKey: EVendor.country,
      header: () => <button>Country</button>,

      cell: ({ row }) => <div>{row.original.locations[0]?.country}</div>,
    },
    {
      accessorKey: EVendor.telephone,
      header: () => <button>Telephone</button>,

      cell: ({ row }) => <div>{row.original.locations[0]?.telephone}</div>,
    },
    {
      accessorKey: EVendor.mobile_number,
      header: () => <button>Mobile</button>,

      cell: ({ row }) => <div>{row.original.locations[0].mobile_number}</div>,
    },
    {
      accessorKey: EVendor.fax,
      header: () => <button>Fax</button>,

      cell: ({ row }) => <div>{row.original.locations[0].fax}</div>,
    },
    {
      accessorKey: EVendor.gst_number,
      header: () => <button>GST</button>,

      cell: ({ row }) => <div>{row.original.locations[0].gst_number}</div>,
    },
    {
      accessorKey: EVendor.pan_number,
      header: () => <button>PAN</button>,
      cell: ({ row }) => <div>{row.original.locations[0].pan_number}</div>,
    },
  ];

  return { formSchema, columns, data};
};

export default useVendorPage;
