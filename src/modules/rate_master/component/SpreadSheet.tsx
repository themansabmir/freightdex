import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import styles from './Spreadsheet.module.scss';


export default function SpreadSheet({ data = [], columns = [], className = '' }) {

  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.container}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={styles.th}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row, rIdx) => (
              <tr key={row.id} className={rIdx % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={styles.td}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
