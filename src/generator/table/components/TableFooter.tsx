import { Button } from "@shared/components";
import { PaginationProps } from "../table.types";
import { ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight} from 'lucide-react'

const TableFooter = <TData,>({
  table,
  pagination,
  setPagination,
}: PaginationProps<TData>) => {
  return (
    <tfoot className='table-footer'>
      <tr>
        <td colSpan={table.getAllColumns().length}>
          <div className='pagination-container'>
            {/* Rows per page */}
            <div className='rows-per-page'>
              <span>Rows per page:</span>
              <select
                value={pagination.pageSize}
                onChange={(event) =>
                  setPagination({
                    ...pagination,
                    pageSize: Number(event.target.value),
                  })
                }
                aria-label='Rows per page'
                aria-controls='table-pagination'
              >
                {[10, 20, 30, 40, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Page x of total */}
            <span className='pagination-info'>
              Page <strong>{pagination.pageIndex + 1}</strong> of{" "}
              <strong>{table.getPageCount()}</strong>
            </span>

            {/* Pagination Buttons */}
            <div className='pagination-buttons'>
              <Button
                onClick={() => table.setPageIndex(0)}
                aria-disabled={!table.getCanPreviousPage()}
                variant={table.getCanPreviousPage() ? "primary" : "neutral"}
                shape='rounded'
                type='ghost'
              >
                <ChevronsLeft />
              </Button>
              <Button
                onClick={() => table.previousPage()}
                aria-disabled={!table.getCanPreviousPage()}
                variant={table.getCanPreviousPage() ? "primary" : "neutral"}
                shape='rounded'
                type='ghost'
              >
                <ChevronLeft />
              </Button>
              <Button
                onClick={() => table.getCanNextPage() && table.nextPage()}
                aria-disabled={!table.getCanNextPage()}
                disabled={!table.getCanNextPage()}
                variant='primary'
                shape='rounded'
                type='ghost'
              >
                <ChevronRight />
              </Button>
              <Button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                aria-disabled={!table.getCanNextPage()}
                variant='primary'
                shape='rounded'
                type='ghost'
              >
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </td>
      </tr>
    </tfoot>
  );
};

export default TableFooter;
