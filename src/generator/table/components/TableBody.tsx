import { flexRender } from '@tanstack/react-table';
import { ColumnsProps } from '../table.types';

const TableBody = <TData,>({ table }: ColumnsProps<TData>) => {
  return (
    <>
      <tbody role="rowgroup">
        {table.getRowModel().rows.map((row) => {
          return (
            <>
              <tr
                key={row.id}
                data-row-id={row.id}
                role="row"
                aria-selected={row.getIsSelected()}
                className={row.getIsSelected() ? 'table__row--selected' : ''}
                onClick={row.getToggleSelectedHandler()}
                style={{ cursor: 'pointer' }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} role="cell">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            </>
          );
        })}
      </tbody>
    </>
  );
};

export default TableBody;
