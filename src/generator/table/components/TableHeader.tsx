import { flexRender } from "@tanstack/react-table";
import { ColumnsProps } from "../table.types";

const Columns = <TData,>({ table }: ColumnsProps<TData>) => {
  return (
    <thead role='rowgroup'>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} role='row'>
          {headerGroup.headers.map((header) => {
            // Determine sorting state
            const sortingState = header.column.getIsSorted();
            const ariaSort =
              sortingState === "asc"
                ? "ascending"
                : sortingState === "desc"
                ? "descending"
                : "none";

            return (
              <th
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                role='columnheader'
                scope='col'
                aria-sort={ariaSort}
                aria-label={
                  header.column.columnDef.header
                    ? `Sort by ${header.column.columnDef.header}`
                    : undefined
                }
                style={{ width: header.getSize() }}
              >
                {!header.isPlaceholder && (
                  <>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </>
                )}
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
};

export default Columns;
