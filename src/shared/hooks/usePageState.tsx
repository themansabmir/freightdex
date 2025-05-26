import { ColumnSort, PaginationState, RowSelectionState } from '@tanstack/react-table';
import { useState } from 'react';

const usePageState = () => {
  const [isView, setView] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isForm, setIsForm] = useState<boolean>(false);
  const [sorting, setSorting] = useState<ColumnSort[]>([]);
  const [rows, setRows] = useState<RowSelectionState>({});
  const [keepCreating, setKeepCreating] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });

  const [query, setQuery] = useState<string>('');
  return {
    //   States
    isView,
    isEdit,
    isForm,
    sorting,
    rows,
    keepCreating,
    pagination,
    query,
    // Functions
    setView,
    setIsEdit,
    setIsForm,
    setSorting,
    setRows,
    setKeepCreating,
    setPagination,
    setQuery,
  };
};

export default usePageState;
