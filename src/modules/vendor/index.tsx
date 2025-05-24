import VendorForm from '@generator/form';
import VendorTable from '@generator/table';
import { Button, TextField, ToggleButton, Typography } from '@shared/components';
import ActionButtonContainer from '@shared/components/ActionDialouge';
import Header, { Breadcrumb } from '@shared/components/BreadCrumbs';
import { Modal } from '@shared/components/Modal';
import { Stack } from '@shared/components/Stack';
import { useModal } from '@shared/hooks/useModa';
import { generatePageTitle } from '@shared/utils';
import { ColumnSort, PaginationState, RowSelectionState } from '@tanstack/react-table';
import { CircleAlert, SearchIcon } from 'lucide-react';
import { useState } from 'react';
import useVendorPage from './hooks/useVendor';
import { useVendorApi } from './hooks/useVendorApi';
import { IVendor } from './index.types';
import { useDebounce } from '@shared/hooks/useDebounce';

const Vendor = () => {
  /*
    ###################
      CUSTOM HOOKS
    ###################
    */
  const { columns: vendorColumns, formSchema: vendorFormSchema, data: dummyVendorData } = useVendorPage();
  const { createVendor, deleteVendor, isDeleted, isDeleting, isCreating, useGetVendors, isCreated } = useVendorApi();
  const { isOpen: isDeleteModal, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();

  /*
    ###################
          STATES
    ###################
    */
  const [isViewMode, setViewMode] = useState<boolean>(false);
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
  const [formData, setFormData] = useState<Partial<IVendor>>({
    vendor_name: '',
    vendor_type: [],
    id: '',
    locations: [
      {
        city: '',
        country: '',
        state: '',
        pan_number: '',
        address: '',
        gst_number: '',
        fax: 0,
        mobile_number: '',
        pin_code: '',
        telephone: '',
      },
    ],
  });

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
    createVendor(formData);
    if (!isCreated) return;
    if (isCreated && keepCreating) {
      setFormData({});
    } else {
      handleCancel();
    }
  };

  const handleEdit = () => {
    const record =
      data?.response.filter((row) => row._id === selectedVendorIds[0])[0] ?? dummyVendorData.filter((row) => row._id === selectedVendorIds[0])[0];
    if (record) {
      setIsEdit(true);
      setFormData(record);
      setIsForm(true);
    }
  };
  /*
    ###################
      DATA FETCHING
    ###################
  */
  // const [queryBuilder, setQueryBuilder] = useState('');
  interface VendorGetAllParams {
    skip: string;
    limit: string;
    search: string;
    sortBy: string;
    sortOrder: string;
  }
  console.log(query)
  const queryBuilder: VendorGetAllParams = {
    skip: String(pagination.pageIndex),
    limit: String(pagination.pageSize),
    sortBy: '',
    sortOrder: '',
    search: debounceSearch,
  };

  if (sorting?.[0]) {
    queryBuilder.sortOrder = sorting[0]?.desc ? 'desc' : 'asc';
    queryBuilder.sortBy = sorting[0]?.id;
  }
  const { isLoading, data } = useGetVendors(queryBuilder);

  return (
    <>
      <Header
        pageName={generatePageTitle(isForm, isEdit, isViewMode, 'Vendor')}
        label="Here you can manage your Shipper, Consignee, Shipping Line, Agent, CHA etc database."
      />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Vendor' }]} />
      {!isForm ? (
        <>
          <div className="flex justify-between">
            <TextField
              prefixIcon={<SearchIcon />}
              label="Search Vendor"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              name='search'

              placeholder="Search Vendor"
            />

            <Button onClick={() => handleAddNew()}>+Add New</Button>
          </div>
          <VendorTable
            columns={vendorColumns}
            data={data?.response ?? dummyVendorData}
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
          <VendorForm schema={vendorFormSchema} data={formData} setData={setFormData} isViewMode={isViewMode} />
          <Stack gap="1em" direction="horizontal" justify="end" align="center">
            <Button type="outline" variant="destructive" onClick={handleCancel} disabled={isCreating}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isCreating || isViewMode}>
              {!isEdit ? 'Submit' : 'Update'}
            </Button>
          </Stack>
        </>
      )}

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
