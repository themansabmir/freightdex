import PageHeader from '@blocks/page-header';
import { VendorGetAllParams } from '@modules/vendor/index.types';
import { Tabs, Typography } from '@shared/components';
import { useDebounce } from '@shared/hooks/useDebounce';
import usePageState from '@shared/hooks/usePageState';
import useTabTitle from '@shared/hooks/useTabTitle';
import { Folder, FolderPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useShipmentApi } from './hooks/useShipmentApi';
import PageLoader from '@shared/components/Loader/PageLoader';
import { useNavigate } from 'react-router-dom';

interface IShipmentFolder {
  folderName: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
  isCreate?: boolean;
}
const ShipmentFolder = ({ folderName, onClick, onDoubleClick, isCreate = false }: IShipmentFolder) => {
  return (
    <div key={folderName} className="shipment_folder_component" onClick={onClick} onDoubleClick={onDoubleClick}>
      <div>{isCreate ? <FolderPlus size={42} color="#6941c6" /> : <Folder size={42} color="#6941c6" fill="#6941c6" />}</div>
      <Typography align="center" variant="md" weight="regular" as="p">
        {folderName}
      </Typography>
    </div>
  );
};

const Shipment = () => {
  const navigate = useNavigate();
  useTabTitle('GCCI Shipment');
  const breadcrumbArray = [
    { label: 'Dashboard', href: '/' },
    { label: 'Shipment', href: '' },
  ];

  const { sorting, pagination, query } = usePageState();
  const debounceSearch = useDebounce(query.trim(), 1000);

  const { useGetShipments, createShipmentFolder, isCreating } = useShipmentApi();

  const [activeTab, setActiveTab] = useState<string>('IMP');

  const queryBuilder = useMemo((): VendorGetAllParams => {
    const query = {
      skip: String(pagination.pageIndex),
      limit: String(pagination.pageSize),
      sortBy: '',
      sortOrder: '',
      search: debounceSearch,
      shipment_type: activeTab,
    };
    return query;
  }, [pagination.pageIndex, pagination.pageSize, debounceSearch, activeTab]);

  if (sorting?.[0]) {
    queryBuilder.sortOrder = sorting[0]?.desc ? 'desc' : 'asc';
    queryBuilder.sortBy = sorting[0]?.id;
  }

  const { data, isLoading } = useGetShipments(queryBuilder);

  const tabs = [
    { tabId: 'IMP', tabName: 'Import' },
    { tabId: 'EXP', tabName: 'Export' },
  ];

  return (
    <>
      <PageLoader isLoading={isCreating || isLoading} />

      <PageHeader
        pageName="Shipment"
        pageDescription="Here you can manage your shipments"
        isEdit={false}
        isViewMode={false}
        isForm={false}
        breadcrumnArray={breadcrumbArray}
      />

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={(tabId) => {
          setActiveTab(tabId);
        }}
      ></Tabs>

      <div className="shipment__folders_container ">
        <ShipmentFolder
          isCreate={true}
          folderName="Create New"
          onClick={() => {
            createShipmentFolder({ shipment_type: activeTab });
          }}
        />
        {data?.map(({ shipment_name, _id }: { shipment_name: string; _id: string }) => {
          return (
            <ShipmentFolder key={_id} folderName={shipment_name} onClick={() => {}} onDoubleClick={() => navigate(`/shipment/${_id}`)} />
          );
        })}
      </div>
    </>
  );
};

export default Shipment;
