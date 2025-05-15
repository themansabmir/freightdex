import { FieldSchema } from "@generator/form/index.types";
import { Checkbox } from "@shared/components";
import Column from "@shared/components/Column";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export interface Airport {
  airport_code: string;
  airport_name: string;
  id: string;
}

export const useAirportPage = () => {
  const formSchema: FieldSchema[] = [
    {
      name: "airport_name",
      label: "Airport Name",
      type: "text",
      required: true,
    },
    {
      name: "airport_code",
      label: "Airport Code",
      type: "text",
      required: true,
    },
  ];

  const generateDummyData = (count: number): Airport[] => {
    return Array.from({ length: count }, (_, i) => ({
      airport_code: `AP-${1000 + i}`,
      airport_name: `Airport ${i + 1}`,
      id: `Airport ${i + 1}`,
    }));
  };

  const data = useMemo(() => generateDummyData(50), []);

  const columns: ColumnDef<Airport>[] = [
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
      )
    },
    {
      accessorKey: "airport_name",
      header: ({ header }) => <Column header={header} title={"Airport Name"} />,
    },
    {
      accessorKey: "airport_code",
      header: ({ header }) => <Column header={header} title={"Airport code"} />,
    },
  ];

  return { formSchema, data, columns };
};

export default useAirportPage;


