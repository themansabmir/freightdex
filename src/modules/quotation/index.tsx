// src/modules/quotation/index.tsx
import QuotationTable from '@generator/table';
import { TextField } from '@shared/components';
import PageLoader from '@shared/components/Loader/PageLoader';
import { Stack } from '@shared/components/Stack';
import { SearchIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import PageHeader from '../../blocks/page-header';

import usePageState from '@shared/hooks/usePageState';
import QuotationDetailsDrawer from './components/QuotationDetailsDrawer';
import useQuotationPage from './hooks/useQuotation';
import { useGetQuotations } from './hooks/useQuotationApi';
import { IQuotation, QuotationGetAllParams } from './index.types';

const Quotation = () => {
  const [selectedQuotation, setSelectedQuotation] = useState<IQuotation | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleViewDetails = (quotation: IQuotation) => {
    setSelectedQuotation(quotation);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // Delay clearing the selected quotation to allow drawer close animation
    setTimeout(() => setSelectedQuotation(null), 300);
  };

  const { columns } = useQuotationPage({ onViewDetails: handleViewDetails });

  const { rows, sorting, pagination, query, setQuery, setRows, setPagination, setSorting } = usePageState();

  const getRowId = (row: IQuotation) => row._id;

  const queryBuilder = useMemo((): QuotationGetAllParams => {
    return {
      skip: String(pagination.pageIndex),
      limit: String(pagination.pageSize),
      search: query.trim(),
      sortBy: sorting?.[0]?.id ?? '',
      sortOrder: sorting?.[0]?.desc ? 'desc' : 'asc',
    };
  }, [pagination.pageIndex, pagination.pageSize, query, sorting]);

  const { isLoading, data } = useGetQuotations(queryBuilder);

  const breadcrumbArray = [{ label: 'Home', href: '/' }, { label: 'Quotation' }];

  return (
    <>
      <PageLoader isLoading={isLoading} />

      <PageHeader
        pageName="Quotation"
        pageDescription="Here you can manage your freight quotations."
        isEdit={false}
        isViewMode={false}
        isForm={false}
        breadcrumnArray={breadcrumbArray}
      />

      <Stack direction="horizontal" align="end" justify="between">
        <TextField
          prefixIcon={<SearchIcon />}
          label="Search Quotation"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          name="search"
          placeholder="Search by quotation number or customer..."
        />
      </Stack>

      <QuotationTable
        columns={columns}
        data={data?.response ?? []}
        getRowId={getRowId}
        sortColumnArr={sorting}
        sortingHandler={setSorting}
        selectedRowsArr={rows}
        selectRowsHandler={setRows}
        pagination={pagination}
        setPagination={setPagination}
        rowCount={data?.total ?? 0}
        isLoading={isLoading}
      />

      <QuotationDetailsDrawer
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        quotation={selectedQuotation}
      />
    </>
  );
};

export default Quotation;

