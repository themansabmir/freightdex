import { Checkbox } from "@shared/components";
import Column from "@shared/components/Column";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
}
const useCustomerTable = () => {
  const generateDummyData = (count: number) => {
    const statuses = ["Single", "In Relationship", "Complicated", "Married"];
    return Array.from({ length: count }, (_, i) => ({
      firstName: `First${i + 1}`,
      lastName: `Last${i + 1}`,
      age: Math.floor(Math.random() * 60) + 18, // Random age between 18-77
      visits: Math.floor(Math.random() * 200), // Random visits
      status: statuses[Math.floor(Math.random() * statuses.length)], // Random status
      progress: Math.floor(Math.random() * 100), // Progress between 0-100
      id: i + 10,
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
      accessorKey: "firstName",
      header: ({ header }) => <Column header={header} title={"First Name"} />,
      size: 250,
    },
    {
      accessorKey: "lastName",
      header: ({ header }) => <Column header={header} title={"Last Name"} />,

      size: 150,
    },
    {
      accessorKey: "age",
      header: ({ header }) => <Column header={header} title={"Age"} />,
    },
    {
      accessorKey: "visits",
      header: ({ header }) => <Column header={header} title={"Visits"} />,
    },

    {
      accessorKey: "progress",
      header: () => <button>Progress</button>,

      cell: ({ row }) => <div>{row.original.progress}%</div>,
    },
    {
      accessorKey: "progress",
      header: () => <button>Progress</button>,

      cell: ({ row }) => <div>{row.original.progress}%</div>,
    },
  ];

  return { columns, data };
};

export default useCustomerTable;
