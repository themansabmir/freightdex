import VendorForm from '@generator/form';
import VendorTable from '@generator/table';
import { Button, TextField, ToggleButton, Typography } from '@shared/components';
import ActionButtonContainer from '@shared/components/ActionDialouge';
import { Modal } from '@shared/components/Modal';
import { useDebounce } from '@shared/hooks/useDebounce';
import { useFormValidation } from '@shared/hooks/useFormValidation';
import { useModal } from '@shared/hooks/useModa';
import usePageState from '@shared/hooks/usePageState';
import { CircleAlert, SearchIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import FormActions from '../../blocks/form-actions';
import PageHeader from '../../blocks/page-header';
import useVendorPage from './hooks/useVendor';
import { useVendorApi } from './hooks/useVendorApi';
import { IVendor, VendorGetAllParams, vendorSchema, VendorType } from './index.types';

const Vendor = () => {
  /*
    ###################
      CUSTOM HOOKS
    ###################
    */
  const { columns: vendorColumns, formSchema: vendorFormSchema, vendorPayload, setVendorPayload } = useVendorPage();
  const [formData, setFormData] = useState<Partial<IVendor>>(vendorPayload);

  const { updateVendor, createVendor, deleteVendor, isDeleted, isDeleting, isCreating, useGetVendors, isCreated } = useVendorApi();
  const { isOpen: isDeleteModal, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  const { validate, handleChange, errors } = useFormValidation(vendorSchema, vendorPayload);

  /*
    ###################
          STATES
    ###################
    */
  const {
    rows,
    sorting,
    keepCreating,
    pagination,
    query,
    isEdit,
    isForm,
    isView: isViewMode,
    setIsEdit,
    setIsForm,
    setKeepCreating,
    setPagination,
    setQuery,
    setRows,
    setSorting,
    setView: setViewMode,
  } = usePageState();
  // api payload

  // debounce logic
  const debounceSearch = useDebounce(query.trim(), 1000);

  // IDS
  const getRowId = (row: IVendor) => row._id;
  const selectedVendorIds = Object.keys(rows).map((id) => id);

  /*
    ###################
      HANDLER FUNCTIONS
    ###################
  */

  const handleView = () => {
    setViewMode(true);
    handleEdit();
    setIsEdit(false);
  };
  const handleAddNew = () => {
    setIsForm(true);
  };
  const handleCancel = () => {
    setIsForm(false);
    setFormData({});
    setIsEdit(false);
    setViewMode(false);
  };

  const handleDeleteConfirm = () => {
    deleteVendor(selectedVendorIds[0]);
    if (isDeleted || !isDeleting) {
      setRows({});
      closeDeleteModal();
    }
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (validate()) {
      if (!isEdit) {
        createVendor(formData);
        if (!isCreated) return;
        if (isCreated && keepCreating) {
          setFormData({});
        } else {
          handleCancel();
        }
      } else {
        const record = returnSelectedRecord();
        if (record) {
          updateVendor({ id: record?._id, payload: formData });
        }
      }
    }
  };

  const returnSelectedRecord = () => {
    const record = data?.response.filter((row) => row._id === selectedVendorIds[0])[0];
    return record;
  };
  const handleEdit = () => {
    const record = returnSelectedRecord();
    if (record) {
      setIsEdit(true);
      setFormData(record);
      setVendorPayload(record);
      setIsForm(true);
    }
  };
  /*
    ###################
      DATA FETCHING
    ###################
  */
  const queryBuilder = useMemo((): VendorGetAllParams => {
    return {
      skip: String(pagination.pageIndex),
      limit: String(pagination.pageSize),
      sortBy: '',
      sortOrder: '',
      search: debounceSearch,
    };

  }, [pagination.pageIndex, pagination.pageSize, debounceSearch]);

  if (sorting?.[0]) {
    queryBuilder.sortOrder = sorting[0]?.desc ? 'desc' : 'asc';
    queryBuilder.sortBy = sorting[0]?.id;
  }
  const { isLoading, data } = useGetVendors(queryBuilder);

  const breadcrumbArray = [{ label: 'Home', href: '/' }, { label: 'Vendor' }];

  return (
    <>
      <PageHeader
        pageName="Vendor"
        pageDescription="Here you can manage your Shipper, Consignee, Shipping Line, Agent, CHA etc database."
        isEdit={isEdit}
        isViewMode={isViewMode}
        isForm={isForm}
        breadcrumnArray={breadcrumbArray}
      />

      {!isForm ? (
        <>
          <div className="flex justify-between">
            <TextField
              prefixIcon={<SearchIcon />}
              label="Search Vendor"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              name="search"
              placeholder="Search Vendor"
            />

            <Button onClick={() => handleAddNew()}>+Add New</Button>
          </div>
          <VendorTable
            columns={vendorColumns}
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
          <ActionButtonContainer show={selectedVendorIds.length > 0}>
            {' '}
            {selectedVendorIds.length === 1 && (
              <>
                <Button onClick={() => handleView()}>View</Button>
                <Button
                  onClick={() => {
                    handleEdit();
                  }}
                >
                  Edit
                </Button>
              </>
            )}
            <Button variant="destructive" type="solid" onClick={openDeleteModal}>
              {selectedVendorIds.length === 1 ? 'Delete' : 'Bulk Delete'}
            </Button>
          </ActionButtonContainer>
        </>
      ) : (
        <>
          <div className="flex justify-between">
            <div className="flex gap-4">
              <Button type="outline" variant="destructive" onClick={handleCancel} disabled={isCreating}>
                Go back
              </Button>
              {isViewMode && (
                <Button
                  type="solid"
                  variant="primary"
                  onClick={() => {
                    setIsEdit(true);
                    setViewMode(false);
                  }}
                  disabled={isCreating}
                >
                  Start Editing
                </Button>
              )}
            </div>
            <ToggleButton label="Keep form open" variant="primary" defaultChecked={keepCreating} onChange={() => setKeepCreating(!keepCreating)} />
          </div>
          <VendorForm
            errors={errors}
            schema={vendorFormSchema}
            data={formData}
            setData={setFormData}
            onChange={handleChange}
            isViewMode={isViewMode}
          />
          <FormActions isCreating={isCreating} isViewMode={isViewMode} isEdit={isEdit} onCancel={handleCancel} onSubmit={handleSubmit} />
        </>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <Modal isOpen={isDeleteModal} onClose={closeDeleteModal} size="sm">
        <Modal.Header>
          <div className="flex item-center gap-1 px-3 ">
            <CircleAlert color="red" className="mt-1 mr-1" />{' '}
            <Typography weight="medium" variant="lg" addClass="sub_label">
              Delete
            </Typography>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="sub_label mt-4">
            <Typography variant="sm" addClass="sub_label" align="center">
              Are you sure you want to delete Vendor? <br /> You will not be able to reverse the process
            </Typography>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex gap-2 justify-end px-4">
            <Button variant="neutral" type="outline" onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button variant="destructive" type="solid" onClick={() => handleDeleteConfirm()} isLoading={isDeleting}>
              Confirm
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Vendor;
