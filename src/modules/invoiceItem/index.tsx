import { useState } from 'react';
import PageHeader from '@blocks/page-header';
import PageLoader from '@shared/components/Loader/PageLoader';
import DynamicForm from '@generator/form';
import { useFormValidation } from '@shared/hooks/useFormValidation';
import { Button, Typography } from '@shared/components';
import { z } from 'zod';
import { Modal } from '@shared/components/Modal';
import { useModal } from '@shared/hooks/useModa';
import { Stack } from '@shared/components/Stack';
import ServiceItemRow from '@shared/components/ItemRow';
import { useGetAllInvoiceItems, useSaveInvoiceItem } from './hooks/useInvoiceItemApi';
import { defaultFormData, formSchema, validationSchema, breadcrumbArray } from './hooks/costants';
import { FormValues } from './index.types';

const InvoiceItem = () => {
  // LOCAL STATES
  const { isOpen, openModal, closeModal } = useModal();
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<FormValues>({ ...defaultFormData });

  // API CALLS
  const { data: serviceList = [], isLoading: isLoadingServiceList } = useGetAllInvoiceItems();
  const { saveInvoiceItem, isSaving } = useSaveInvoiceItem();

  //HANDLER FUNCTIONS
  const { handleChange, errors } = useFormValidation<FormValues>(z.object(validationSchema), formData);

  const handleCloseModal = () => {
    setFormData({ ...defaultFormData });
    closeModal();
    setIsEdit(false);
  };
  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if(isEdit){
      console.log("UPDATE")
      
    }
    saveInvoiceItem(formData);
    handleCloseModal();
    setIsEdit(false);
  };

  // MODAL + FORM
  const renderModal = () => {
    return (
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="lg">
        <Modal.Header>
          <Typography variant="display-xs" weight="bold" transform="capitalize" addClass="ml-2">
            Service Item
          </Typography>
        </Modal.Header>
        <Modal.Body>
          <div className="ml-10 py-5">
            <div>
              <DynamicForm schema={formSchema} data={formData} setData={setFormData} onChange={handleChange} isViewMode={false} errors={errors} />
              <div style={{ marginTop: '16px' }}></div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Stack direction="horizontal" gap="1em" justify="end" className="mr-4">
            <Button variant="destructive" onClick={() => closeModal()}>
              Close
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </Stack>
        </Modal.Footer>
      </Modal>
    );
  };

  // LIST
  const renderListItems = () => {
    return (
      serviceList.length > 0 &&
      serviceList?.map((item, index) => (
        <ServiceItemRow
          key={index}
          item={item}
          onEdit={(row: any) => {
            console.log("row", row)
            setFormData(row);
            setIsEdit(true);
            openModal();
          }}
          onDelete={(id: string | number) => {
            openModal();
          }}
          className="service-item-row"
        />
      ))
    );
  };

  return (
    <div>
      {renderModal()}
      <PageLoader isLoading={isLoadingServiceList || isSaving} />
      <PageHeader
        pageName="Service Item"
        pageDescription="Here you can manage your invoice service item form field & types"
        isEdit={false}
        isViewMode={false}
        isForm={isOpen}
        breadcrumnArray={breadcrumbArray}
      />

      <Stack direction="horizontal" justify="end">
        <Button onClick={() => openModal()} addClass="flex">
          + Add New Service
        </Button>
      </Stack>
      {renderListItems()}
    </div>
  );
};

export default InvoiceItem;
