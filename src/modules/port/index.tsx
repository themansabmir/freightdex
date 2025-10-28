import Portform from '@generator/form';
import PortTable from '@generator/table';
import { Button, TextField, ToggleButton, Typography } from '@shared/components';
import ActionButtonContainer from '@shared/components/ActionDialouge';
import { Modal } from '@shared/components/Modal';
import { useDebounce } from '@shared/hooks/useDebounce';
import { useFormValidation } from '@shared/hooks/useFormValidation';
import { useModal } from '@shared/hooks/useModal';
import usePageState from '@shared/hooks/usePageState';
import { CircleAlert, SearchIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import FormActions from '../../blocks/form-actions';
import PageHeader from '../../blocks/page-header';
import usePortPage from './hooks/usePort';
import { usePortApi } from './hooks/usePortApi';
import PageLoader from '@shared/components/Loader/PageLoader';
import { Stack } from '@shared/components/Stack';
import { IPort, PortGetAllParams, portSchema } from './index.types';
import { returnSelectedRecord } from '@shared/utils';

const Port = () => {
  const { columns: portColumns, formSchema: portFormSchema, payload } = usePortPage();
  const [formData, setFormData] = useState<IPort>(payload);

  const { updatePort, createPort, deletePort, isDeleting, isCreating, isUpdating, useGetPort } = usePortApi();
  const { isOpen: isDeleteModal, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  const { validate, handleChange, errors } = useFormValidation(portSchema, formData);

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

  const debounceSearch = useDebounce(query.trim(), 1000);
  const getRowId = (row: IPort) => row._id;
  const selectedPortIds = Object.keys(rows).map((id) => id);

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
    setFormData(payload);
    setIsEdit(false);
    setViewMode(false);
  };

  const handleDeleteConfirm = async () => {
    await deletePort(selectedPortIds[0]);
    setRows({});
    closeDeleteModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;

    if (!isEdit) {
      const createdPort = await createPort(formData);
      if (createdPort && keepCreating) {
        setFormData(payload);
      } else {
        handleCancel();
      }
    } else {
      const record = returnSelectedRecord(data?.response, selectedPortIds[0]);
      if (record) {
        await updatePort({ id: record._id, payload: formData });
        handleCancel();
      }
    }
  };

  const handleEdit = () => {
    const record = returnSelectedRecord(data?.response, selectedPortIds[0]);
    if (record) {
      setIsEdit(true);
      setFormData(record);
      setIsForm(true);
    }
  };

  const queryBuilder = useMemo((): PortGetAllParams => {
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

  const { isLoading, data } = useGetPort(queryBuilder);

  const breadcrumbArray = [{ label: 'Home', href: '/' }, { label: 'Port' }];

  return (
    <>
      <PageLoader isLoading={isCreating || isDeleting || isUpdating} />
      <PageHeader
        pageName="Port"
        pageDescription="Here you can manage your Ports."
        isEdit={isEdit}
        isViewMode={isViewMode}
        isForm={isForm}
        breadcrumnArray={breadcrumbArray}
      />

      {!isForm ? (
        <>
          <Stack direction="horizontal" align="end" justify="between">
            <TextField
              prefixIcon={<SearchIcon />}
              label="Search Port"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              name="search"
              placeholder="Search Port"
            />
            <Button onClick={() => handleAddNew()}>+Add New</Button>
          </Stack>

          <PortTable
            columns={portColumns}
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

          <ActionButtonContainer show={selectedPortIds.length > 0}>
            {selectedPortIds.length === 1 && (
              <>
                <Button onClick={() => handleView()}>View</Button>
                <Button onClick={() => handleEdit()}>Edit</Button>
              </>
            )}
            <Button variant="destructive" type="solid" onClick={openDeleteModal}>
              {selectedPortIds.length === 1 ? 'Delete' : 'Bulk Delete'}
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

          <Portform errors={errors} schema={portFormSchema} data={formData} setData={setFormData} onChange={handleChange} isViewMode={isViewMode} />

          <FormActions isCreating={isCreating} isViewMode={isViewMode} isEdit={isEdit} onCancel={handleCancel} onSubmit={handleSubmit} />
        </>
      )}

      <Modal isOpen={isDeleteModal} onClose={closeDeleteModal} size="sm">
        <Modal.Header>
          <div className="flex item-center gap-1 px-3 ">
            <CircleAlert color="red" className="mt-1 mr-1" />
            <Typography weight="medium" variant="lg" addClass="sub_label">
              Delete
            </Typography>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="sub_label mt-4">
            <Typography variant="sm" addClass="sub_label" align="center">
              Are you sure you want to delete this Port? <br /> You will not be able to reverse the process.
            </Typography>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex gap-2 justify-end px-4">
            <Button variant="neutral" type="outline" onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button variant="destructive" type="solid" onClick={handleDeleteConfirm} isLoading={isDeleting}>
              Confirm
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Port;
