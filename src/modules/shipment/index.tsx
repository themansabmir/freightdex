import PageHeader from '@blocks/page-header';
import { VendorGetAllParams } from '@modules/vendor/index.types';
import { Button } from '@shared/components';
import PageLoader from '@shared/components/Loader/PageLoader';
import { Stack } from '@shared/components/Stack';
import { useDebounce } from '@shared/hooks/useDebounce';
import usePageState from '@shared/hooks/usePageState';
import useTabTitle from '@shared/hooks/useTabTitle';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShipmentApi } from './hooks/useShipmentApi';


const Shipment = () => {
  const navigate = useNavigate();
  useTabTitle('GCCI Shipment');
  const breadcrumbArray = [
    { label: 'Dashboard', href: '/' },
    { label: 'Shipment', href: '' },
  ];

  const { sorting, pagination, query } = usePageState();
  const debounceSearch = useDebounce(query.trim(), 1000);

  const { useGetShipments } = useShipmentApi();

  const queryBuilder = useMemo((): VendorGetAllParams => {
    const query = {
      skip: String(pagination.pageIndex),
      limit: String(pagination.pageSize),
      sortBy: '',
      sortOrder: '',
      search: debounceSearch,
      // shipment_type: activeTab,
    };
    return query;
  }, [pagination.pageIndex, pagination.pageSize, debounceSearch]);

  if (sorting?.[0]) {
    queryBuilder.sortOrder = sorting[0]?.desc ? 'desc' : 'asc';
    queryBuilder.sortBy = sorting[0]?.id;
  }

  const { data, isLoading } = useGetShipments(queryBuilder);

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
      <Stack direction="horizontal" justify="end">
        <Button onClick={() => navigate('/shipment/new')}>New Shipment +</Button>
      </Stack>
      <div className="shipment__folders_container ">
        {data?.map(({ shipment_name,  }: { shipment_name: string; _id: string }) => {
          return <div>{shipment_name}</div>;
        })}
      </div>
    </>
  );
};

export default Shipment;
