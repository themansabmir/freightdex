import PageHeader from '@blocks/page-header';
import ShipmentTable from '@generator/table';
import { Button, TextField } from '@shared/components';
import PageLoader from '@shared/components/Loader/PageLoader';
import { Stack } from '@shared/components/Stack';
import Dropdown from '@shared/components/Dropdown';
import usePageState from '@shared/hooks/usePageState';
import useTabTitle from '@shared/hooks/useTabTitle';
import { SearchIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShipmentApi } from './hooks/useShipmentApi';
import useShipmentPage from './hooks/useShipmentPage';
import { IShipment, ShipmentGetAllParams } from './index.types';

const Shipment = () => {
  const navigate = useNavigate();
  useTabTitle('GCCI Shipment');
  const { columns } = useShipmentPage();

  const { rows, sorting, pagination, query, setQuery, setRows, setPagination, setSorting } = usePageState();

  // Filter states -shipment_type
  const [shipmentTypeFilter, setShipmentTypeFilter] = useState<string[]>([]);
  const [shipmentTypeInput, setShipmentTypeInput] = useState('');
  const [isShipmentTypeOpen, setIsShipmentTypeOpen] = useState(false);

  const getRowId = (row: IShipment) => row._id;

  const queryBuilder = useMemo((): ShipmentGetAllParams => {
    return {
      skip: String(pagination.pageIndex),
      limit: String(pagination.pageSize),
      search: query.trim(),
      sortBy: sorting?.[0]?.id ?? '',
      sortOrder: sorting?.[0]?.desc ? 'desc' : 'asc',
      shipment_type: shipmentTypeFilter.join(','),
    };
  }, [pagination.pageIndex, pagination.pageSize, query, sorting, shipmentTypeFilter]);

  const { useGetShipments } = useShipmentApi();
  const { isLoading, data } = useGetShipments(queryBuilder);

  const breadcrumbArray = [
    { label: 'Dashboard', href: '/' },
    { label: 'Shipment', href: '' },
  ];

  // Filter options - IMP/EXP
  const shipmentTypeOptions = [
    { label: 'Import', value: 'IMP' },
    { label: 'Export', value: 'EXP' },
  ];

  const handleShipmentTypeSelect = (value: string) => {
    setShipmentTypeFilter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  // Handle row click to navigate to shipment detail page
  const handleRowClick = (row: IShipment) => {
    navigate(`/shipment/${row._id}`);
  };

  return (
    <>
      <PageLoader isLoading={isLoading} />
      <PageHeader
        pageName="Shipment"
        pageDescription="Here you can manage your shipments"
        isEdit={false}
        isViewMode={false}
        isForm={false}
        breadcrumnArray={breadcrumbArray}
      />

      <Stack direction="horizontal" align="end" justify="between">
        <TextField
          prefixIcon={<SearchIcon />}
          label="Search Shipment"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          name="search"
          placeholder="Search by shipment name..."
        />
        <Button onClick={() => navigate('/shipment/new')}>New Shipment +</Button>
      </Stack>

      <Stack direction="horizontal" align="end" justify="start" style={{ marginTop: '1rem', gap: '1rem' }}>
        <Dropdown
          options={shipmentTypeOptions}
          selectedValues={shipmentTypeFilter}
          onSelect={handleShipmentTypeSelect}
          inputValue={shipmentTypeInput}
          onInputChange={setShipmentTypeInput}
          placeholder="Filter by type..."
          isOpen={isShipmentTypeOpen}
          setIsOpen={setIsShipmentTypeOpen}
          label="Shipment Type"
          name="shipment_type_filter"
        />
      </Stack>

      <div
        onClick={(e) => {
          const target = e.target as HTMLElement;
          const row = target.closest('tr[data-row-id]');
          if (row) {
            const rowId = row.getAttribute('data-row-id');
            const shipment = data?.response.find((s) => s._id === rowId);
            if (shipment) handleRowClick(shipment);
          }
        }}
      >
        <ShipmentTable
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
      </div>
    </>
  );
};

export default Shipment;
