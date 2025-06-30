import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import TableHeader from './components/TableHeader';
import TableBody from './components/TableBody';
import TableFooter from './components/TableFooter';
import { UseTableLogicProps } from './table.types';
import Typography from '@shared/components/Typography';
import Loader from '@shared/components/Loader';

import { createPortal } from 'react-dom';
const RenderTableBody = ({ isLoading, data, table }:{ isLoading?: boolean, data: any[], table: any}) => {
  if (isLoading) {
    return createPortal(
      <div className="" style={{ position: 'absolute', top: '50%', left: '50%' }}>
        <Loader />
      </div>,
      document.body // or a specific DOM node if needed
    );
  }

  if (!isLoading && data.length === 0) return <>No data found</>;
  return <TableBody table={table} />;
};

const Table = <TData extends object>({
  data,
  columns,
  sortColumnArr,
  sortingHandler,
  selectedRowsArr,
  selectRowsHandler,
  getRowId,
  enableManualSorting,
  enableRowsSelection,
  pagination,
  setPagination,
  rowCount,
  isLoading,
}: UseTableLogicProps<TData>) => {
  const table = useReactTable({
    data,
    columns,
    getRowId: getRowId,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: sortingHandler,
    onRowSelectionChange: selectRowsHandler,
    onPaginationChange: setPagination,
    manualSorting: enableManualSorting ?? true,
    enableRowSelection: enableRowsSelection ?? true,
    manualPagination: true,
    rowCount: rowCount,
    state: {
      sorting: sortColumnArr,
      rowSelection: selectedRowsArr,
      pagination,
    },
  });

  return (
    <div>
      <div className="table__container">
        <table role="table" aria-label="Data Table">
          <TableHeader table={table} />
          {/* TABLE HEAD */}

          {/* TABLE BODY */}

          {/* <TableBody table={table} /> */}
          <RenderTableBody isLoading={isLoading} data={data} table={table} />
          {isLoading && <div style={{ minHeight: '40vh' }}></div>}

          {/* PAGINATION COMPONENT */}
          <TableFooter pagination={pagination} setPagination={setPagination} table={table} />
        </table>
      </div>
      <Typography variant="sm" weight="bold" align="left">
        Total Data: {table.getRowCount()}
      </Typography>
    </div>
  );
};

export default Table;
