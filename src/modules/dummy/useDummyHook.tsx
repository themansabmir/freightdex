import { Checkbox } from "@shared/components";
import Column from "@shared/components/Column";
import { ColumnDef } from "@tanstack/react-table";

function generateVesselData(count = 50) {
  const data = [];

  for (let i = 0; i < count; i++) {
    data.push({
      voyageNo: `VOY${Math.floor(1000 + Math.random() * 9000)}`,
      vesselType: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
      expDtOfArrival: `${String(
        Math.floor(1012010 + Math.random() * 999999)
      ).padStart(8, "0")}`,
      portOfArrival: `IN${String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
      )}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}1`,
      imoCodeOfVessel:
        Math.random() > 0.5
          ? "-"
          : `IMO${Math.floor(100000 + Math.random() * 900000)}`,
      igmDt: `${String(Math.floor(1012010 + Math.random() * 999999)).padStart(
        8,
        "0"
      )}`,
      igmNo: Math.floor(2000000 + Math.random() * 1000000),
      vesselCode: `${Math.floor(300000 + Math.random() * 100000)}`,
      totalNoOfLines: Math.floor(1 + Math.random() * 10),
    });
  }

  return data;
}
function generateContainerData(count = 50) {
  const data = [];

  for (let i = 0; i < count; i++) {
    data.push({
      containerNo: [
        `${String.fromCharCode(
          65 + Math.floor(Math.random() * 26)
        )}${String.fromCharCode(
          65 + Math.floor(Math.random() * 26)
        )}${String.fromCharCode(
          65 + Math.floor(Math.random() * 26)
        )}U${Math.floor(1000000 + Math.random() * 9000000)}`,
      ],
      sbNo: Math.floor(6000000 + Math.random() * 1000000),
      noOfPckgs: Math.floor(1 + Math.random() * 100),
      portOfDest: `${String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
      )}${String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
      )}${String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
      )}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
    });
  }

  return data;
}

type Vessel = {
  voyageNo: string;
  vesselType: string;
  expDtOfArrival: string;
  portOfArrival: string;
  imoCodeOfVessel: string;
  igmDt: string;
  igmNo: number;
  vesselCode: string;
  totalNoOfLines: number;
};

type Container = {
  containerNo: string[];
  sbNo: number;
  noOfPckgs: number;
  portOfDest: string;
};

const useDummyHook = () => {
  const igmData = generateVesselData();
  const egmData = generateContainerData();
  const egmColumns: ColumnDef<Container>[] = [
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
      accessorKey: "noOfPckgs",
      header: ({ header }) => (
        <Column header={header} title={"Total Packages"} />
      ),
      size: 250,
    },
    {
      accessorKey: "portOfDest",
      header: ({ header }) => <Column header={header} title={"P.O.D"} />,
      size: 250,
    },
    {
      accessorKey: "sbNo",
      header: ({ header }) => <Column header={header} title={"SB number"} />,
      size: 250,
    },
  ];
  const igmColumns: ColumnDef<Vessel>[] = [
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
      accessorKey: "expDtOfArrival",
      header: ({ header }) => (
        <Column header={header} title={"Date Of Arrival"} />
      ),
      size: 250,
    },
    {
      accessorKey: "igmDt",
      header: ({ header }) => <Column header={header} title={"IGM Date"} />,

      size: 150,
    },
    {
      accessorKey: "igmNo",
      header: ({ header }) => <Column header={header} title={"IGM number"} />,
    },
    {
      accessorKey: "imoCodeOfVessel",
      header: ({ header }) => <Column header={header} title={"IMO Code"} />,
    },

    {
      accessorKey: "portOfArrival",
      header: () => <button>POA</button>,
    },
    {
      accessorKey: "vesselCode",
      header: () => <button>Vessel Code</button>,
    },
    {
      accessorKey: "voyageNo",
      header: () => <button>Voyage No</button>,
    },
  ];

  return { igmData, igmColumns, egmData, egmColumns };
};

export default useDummyHook;
