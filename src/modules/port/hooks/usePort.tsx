import { FieldSchema } from "@generator/form/index.types";
import { Checkbox } from "@shared/components";
import Column from "@shared/components/Column";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export interface Port {
  port_name: string;
  port_code: string;
  id: string;
}

export const usePortPage = () => {
  const formSchema: FieldSchema[] = [
    {
      name: "port_name",
      label: "Port Name",
      type: "text",
      required: true,
    },
    {
      name: "port_code",
      label: "Port Code",
      type: "text",
      required: true,
    },
  ];

  const generateDummyData = (count: number): Port[] => {
    const statuses = ["24wL89", "9876p32", "20KG543", "J4N238"];
    return Array.from({ length: count }, (_, i) => ({
      port_name: `Ship${i + 1} Which is going to port everything`,
      port_code: statuses[Math.floor(Math.random() * statuses.length)],
      id: String(i + 1),
    }));
  };

  const data = useMemo(() => generateDummyData(50), []);

  const columns: ColumnDef<Port>[] = [
    {
      id: "id",
      size: 4,
      header: ({ table }) => (
        <Checkbox
          checked={Boolean(table.getIsAllRowsSelected())}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
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
      accessorKey: "port_name",
      header: ({ header }) => <Column header={header} title="Port Name" />,
    },
    {
      accessorKey: "port_code",
      header: () => <button>Port Code</button>,
      cell: ({ row }) => <div>{row.original.port_code}</div>,
    },
  ];

  return { formSchema, data, columns };
};

export default usePortPage;
