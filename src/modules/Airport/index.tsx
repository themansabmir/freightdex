import AirportForm from '@generator/form';
import AirportTable from '@generator/table';
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
import { useAirportApi } from './hooks/useAirportApi';
import { IAirport, AirportGetAllParams, airportSchema } from './index.types';
import PageLoader from '@shared/components/Loader/PageLoader';
import { Stack } from '@shared/components/Stack';
import { useAirportPage } from './hooks/useAirport';

// Dummy airport generator
const generateDummyAirport = (id: number): IAirport => ({
  _id: `dummy-${id}`,
  airport_name: `Dummy Airport ${id}`,
  airport_code: `D${id.toString().padStart(3, '0')}`,
});

const generateDummyAirports = (count: number = 5): IAirport[] =>
  Array.from({ length: count }, (_, i) => generateDummyAirport(i + 1));

const Airport = () => {
  const { columns: airportColumns, formSchema: airportFormSchema, payload } = useAirportPage();
  const [formData, setFormData] = useState<IAirport>(payload);

  const { updateAirport, createAirport, deleteAirport, isDeleting, isCreating, isUpdating, useGetAirports } =
    useAirportApi();
  const { isOpen: isDeleteModal, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  const { validate, handleChange, errors } = useFormValidation(airportSchema, formData);

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
  const getRowId = (row: IAirport) => row._id;
  const selectedAirportIds = Object.keys(rows).map((id) => id);

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
    await deleteAirport(selectedAirportIds[0]);
    setRows({});
    closeDeleteModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validate();
    if (!isValid) return;

    if (!isEdit) {
      const createdAirport = await createAirport(formData);
      if (createdAirport && keepCreating) {
        setFormData(payload);
      } else {
        handleCancel();
      }
    } else {
      const record = returnSelectedRecord();
      if (record) {
        await updateAirport({ id: record._id, payload: formData });
        handleCancel();
      }
    }
  };

  const returnSelectedRecord = () => {
    const record = data?.response.find((row) => row._id === selectedAirportIds[0]);
    return record;
  };

  const handleEdit = () => {
    const record = returnSelectedRecord();
    if (record) {
      setIsEdit(true);
      setFormData(record);
      setIsForm(true);
    }
  };

  const queryBuilder = useMemo((): AirportGetAllParams => {
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

  const { isLoading, data } = useGetAirports(queryBuilder);

  const breadcrumbArray = [{ label: 'Home', href: '/' }, { label: 'Airport' }];

  return (
    <>
      <PageLoader isLoading={isCreating || isDeleting || isUpdating} />
      <PageHeader
        pageName="Airport"
        pageDescription="Here you can manage your airport database."
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
              label="Search Airport"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              name="search"
              placeholder="Search Airport"
            />
            <Button onClick={handleAddNew}>+Add New</Button>
          </Stack>
          <AirportTable
            columns={airportColumns}
            data={data?.response ?? generateDummyAirports()}
            getRowId={getRowId}
            sortColumnArr={sorting}
            sortingHandler={setSorting}
            selectedRowsArr={rows}
            selectRowsHandler={setRows}
            pagination={pagination}
            setPagination={setPagination}
            rowCount={data?.total ?? generateDummyAirports().length}
            isLoading={isLoading}
          />
          <ActionButtonContainer show={selectedAirportIds.length > 0}>
            {selectedAirportIds.length === 1 && (
              <>
                <Button onClick={handleView}>View</Button>
                <Button onClick={handleEdit}>Edit</Button>
              </>
            )}
            <Button variant="destructive" type="solid" onClick={openDeleteModal}>
              {selectedAirportIds.length === 1 ? 'Delete' : 'Bulk Delete'}
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
            <ToggleButton
              label="Keep form open"
              variant="primary"
              defaultChecked={keepCreating}
              onChange={() => setKeepCreating(!keepCreating)}
            />
          </div>
          <AirportForm
            errors={errors}
            schema={airportFormSchema}
            data={formData}
            setData={setFormData}
            onChange={handleChange}
            isViewMode={isViewMode}
          />
          <FormActions
            isCreating={isCreating}
            isViewMode={isViewMode}
            isEdit={isEdit}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
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
              Are you sure you want to delete Airport? <br /> You will not be able to reverse the process
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

export default Airport;
