import PageHeader from '@blocks/page-header';
import HBL from '@modules/hbl';
import MBLFormPage from '@modules/mbl';
import { Tabs } from '@shared/components';
import useTabTitle from '@shared/hooks/useTabTitle';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ShipmentDocumentUpload from '../components/ShipmentDocumentUpload';
import { useShipmentApi } from '../hooks/useShipmentApi';
import { IFolderCard } from '../index.types';

const FolderDetailCard = ({ folder_name, folder_id, created_by, created_at }: IFolderCard) => {
  const obj: Record<string, string> = {
    'Folder ID': folder_id,
    'Folder Name': folder_name,
    'Created By': created_by,
    'Created At': created_at,
  };
  return (
    <div className="shipment_info_card">
      <p>Shipment Details</p>
      <ul>
        {Object.keys(obj).map((key) => (
          <li key={key} className="shipment_info_card--text flex justify-between">
            {key}:<span className="">{obj[key]} </span>
            {/* <Badge label={obj[key]} id={key} tagType="badge" shape="rectangle" variant="primary" /> */}
          </li>
        ))}
      </ul>
    </div>
  );
};
const ShipmentFolderPage = () => {
  const { id } = useParams() as { id: string };
  const { useGetShipmentById } = useShipmentApi();
  const { data } = useGetShipmentById(id);
  useTabTitle(`GCCI - ${data?.shipment_name}`);

  const [activeTab, setActiveTab] = useState('MBL');
  const tabs = [
    { tabId: 'MBL', tabName: 'MBL' },
    { tabId: 'HBL', tabName: 'HBL' },
    { tabId: 'Attachments', tabName: 'Attachments' },
  ];

  const breadcrumbArray = [
    { label: 'Dashboard', href: '/' },
    { label: 'Shipment', href: '/shipment' },
    { label: id === 'new' ? 'New Shipment' : (data?.shipment_name ?? ''), href: '' },
  ];

  const handleUploadComplete = (files: File[]) => {
    console.log('Files uploaded:', files);
    // This will be connected to the backend API once ready
  };

  return (
    <div>
      <div className="flex justify-between">
        <PageHeader
          pageName="Shipment Detail"
          pageDescription="Here you can manage MBL, HBL(s), Attachments and other shipment details."
          isEdit={false}
          isViewMode={false}
          isForm={false}
          breadcrumnArray={breadcrumbArray}
        />
        {id !== 'new' && (
          <FolderDetailCard
            folder_id={id}
            folder_name={data?.shipment_name}
            created_by={`${data?.created_by?.first_name} ${data?.created_by?.last_name}`}
            created_at={new Date(data?.createdAt).toLocaleDateString()}
          />
        )}
      </div>

      <div className="my-4">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={(tabId) => {
            setActiveTab(tabId);
          }}
        ></Tabs>
      </div>

      {activeTab.toUpperCase() === 'MBL' && <MBLFormPage id={id} />}
      {activeTab.toUpperCase() === 'HBL' && <HBL id={id} />}
      {activeTab.toUpperCase() === 'ATTACHMENTS' && <ShipmentDocumentUpload shipmentId={id} onUploadComplete={handleUploadComplete} />}
    </div>
  );
};

export default ShipmentFolderPage;
