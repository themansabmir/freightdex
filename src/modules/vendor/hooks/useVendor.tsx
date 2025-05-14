import { FieldSchema } from "@generator/form/index.types";
import { Checkbox } from "@shared/components";
import Column from "@shared/components/Column";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
export interface User {
  id: string;
  company_name: string;
  vendor_type: string;
  city: string;
  pin_code: string;
  country: string;
  telephone: string;
  mobile_number: string;
  gst_number: string;
  pan_number: string;
  fax: number;
}

export const useVendorPage = () => {
  const formSchema: FieldSchema[] = [
    {
      name: "vendor_name",
      label: "Vendor Name",
      type: "text",
      required: true,
    },

    {
      name: "vendor_type",
      label: "Vendor Type",
      type: "multiselect",
      options: [
        { label: "Shipper", value: "shipper" },
        { label: "Consignee", value: "consignee" },
        { label: "Shipping Line", value: "shipping_line" },
        { label: "Freight Forwarder", value: "freight_forwarder" },
        { label: "Agent", value: "agent" },
        { label: "CHA", value: "cha" },
      ],
    },
    {
      name: "locations",
      label: "Locations",
      type: "array",
      item: {
        type: "group",
        fields: [
          {
            name: "city",
            label: "City",
            type: "text",
            required: true,
          },
          {
            name: "address",
            label: "Address",
            type: "text",
            required: true,
          },
          {
            name: "state",
            label: "State",
            type: "text",
            required: true,
          },
          {
            name: "country",
            label: "Country",
            type: "text",
            required: true,
          },
          {
            name: "pincode",
            label: "Pin Code",
            type: "text",
            required: true,
          },
          {
            name: "telephone",
            label: "Telephone",
            type: "text",
            required: true,
          },
          {
            name: "mobile",
            label: "Mobile Number",
            type: "text",
            required: true,
          },
          {
            name: "fax",
            label: "FAX",
            type: "text",
            required: true,
          },
          {
            name: "gst_number",
            label: "GST Number",
            type: "text",
            required: true,
          },
          {
            name: "pan_number",
            label: "Pan Number",
            type: "text",
            required: true,
          },
        ],
      },
    },
  ];

  const generateDummyData = (count: number) => {
    const statuses = ["Single", "In Relationship", "Complicated", "Married"];
    return Array.from({ length: count }, (_, i) => ({
      company_name: `First${i + 1} long String Content to show in column`,
      vendor_type: statuses[Math.floor(Math.random() * statuses.length)],
      city: statuses[Math.floor(Math.random() * statuses.length)],
      pin_code: statuses[Math.floor(Math.random() * statuses.length)],
      country: statuses[Math.floor(Math.random() * statuses.length)],
      telephone: statuses[Math.floor(Math.random() * statuses.length)],

      mobile_number: statuses[Math.floor(Math.random() * statuses.length)], // Random status
      gst_number: String(Math.floor(Math.random() * 100)), // Progress between 0-100
      id: String(i + 10),
      pan_number: String(Math.floor(Math.random() * 100)),
      fax: Math.floor(Math.random() * 100),
    }));
  };
  const data = useMemo(() => {
    return generateDummyData(50);
  }, []);

  const columns: ColumnDef<User>[] = [
    {
      id: "id",
      size: 4,
      header: ({ table }) => {
        return (
          <Checkbox
            checked={Boolean(table.getIsAllRowsSelected())}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        );
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
      accessorKey: "company_name",
      header: ({ header }) => <Column header={header} title={"Company Name"} />,
    },
    {
      accessorKey: "vendor_type",
      header: ({ header }) => <Column header={header} title={"Vendor Type"} />,
    },
    {
      accessorKey: "city",
      header: ({ header }) => <Column header={header} title={"City"} />,
    },

    {
      accessorKey: "pin_code",
      header: () => <button>Pin Code</button>,

      cell: ({ row }) => <div>{row.original.pin_code}</div>,
    },
    {
      accessorKey: "country",
      header: () => <button>Country</button>,

      cell: ({ row }) => <div>{row.original.country}</div>,
    },
    {
      accessorKey: "telephone",
      header: () => <button>Telephone</button>,

      cell: ({ row }) => <div>{row.original.telephone}</div>,
    },
    {
      accessorKey: "mobile_number",
      header: () => <button>Mobile</button>,

      cell: ({ row }) => <div>{row.original.mobile_number}</div>,
    },
    {
      accessorKey: "fax",
      header: () => <button>Fax</button>,

      cell: ({ row }) => <div>{row.original.fax}</div>,
    },
    {
      accessorKey: "gst_number",
      header: () => <button>GST</button>,

      cell: ({ row }) => <div>{row.original.gst_number}</div>,
    },
    {
      accessorKey: "pan_number",
      header: () => <button>PAN</button>,

      cell: ({ row }) => <div>{row.original.pan_number}</div>,
    },
  ];

  return { formSchema, data, columns };
};

export default useVendorPage;
