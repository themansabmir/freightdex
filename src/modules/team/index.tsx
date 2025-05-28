import PageHeader from '@blocks/page-header';
import { Button, TextField, ToggleButton } from '@shared/components';
import { Stack } from '@shared/components/Stack';
import DynamicForm from '@generator/form';
import { useFormValidation } from '@shared/hooks/useFormValidation';
import { useMemo, useState } from 'react';
import useTeam from './hooks/useTeam';
import { ITeam, teamSchema } from './index.types';
import FormActions from '@blocks/form-actions';
import usePageState from '@shared/hooks/usePageState';
import TeamTable from '@generator/table';
import { generateDummyTeamData } from './hooks/dummyData';
import { useTeamApi } from './hooks/useTeamApi';
import { FormActionHeader } from '@blocks/form-header';
import PageLoader from '@shared/components/Loader/PageLoader';
import ActionButtonContainer from '@shared/components/ActionDialouge';
import { useModal } from '@shared/hooks/useModa';
import { returnSelectedRecord } from '@shared/utils';
import { useDebounce } from '@shared/hooks/useDebounce';

const Team = () => {
  const getRowId = (row: ITeam) => row._id;
  const { formSchema: teamForm, payload, columns: vendorColumns } = useTeam();
  const { isCreating, isDeleting, isUpdating, useGetTeam, createTeam, updateTeam, removeTeam } = useTeamApi();
  const { openModal: openDeleteModal, closeModal: closeDeleteModal, isOpen } = useModal();
  const [data, setFormData] = useState(payload);
  const { handleChange, errors, validate, values } = useFormValidation(teamSchema, data);
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

  const handleEdit = () => {
    const record = returnSelectedRecord(teamData?.response, selectedVendorIds[0]);
    console.error('record id mismatch', record, selectedVendorIds[0]);
    if (record) {
      setIsEdit(true);
      setFormData(record);
      setIsForm(true);
    }
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

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;

    await createTeam(data);
    handleCancel();
  };

  /*
    ###################
      DATA FETCHING
    ###################
  */

  const queryBuilder = useMemo(() => {
    return {
      skip: String(pagination.pageIndex),
      limit: String(pagination.pageSize),
      sortBy: '',
      sortOrder: '',
      search: debounceSearch,
    };
  }, [pagination.pageIndex, pagination.pageSize, debounceSearch]);


  console.log(queryBuilder)
  if (sorting?.[0]) {
    queryBuilder.sortOrder = sorting[0]?.desc ? 'desc' : 'asc';
    queryBuilder.sortBy = sorting[0]?.id;
  }
  const { isLoading, data: teamData } = useGetTeam(queryBuilder);

  const pageHeaderProps = {
    pageName: 'Team',
    pageDescription: 'You can manage your system team members here.',
    isViewMode: isViewMode,
    isForm: isForm,
    isEdit: isEdit,
  };
  const breadcrumbArray = [{ label: 'Home', href: '/' }, { label: 'Team' }];
  const dymmuData = useMemo(() => generateDummyTeamData(50), []);

  return (
    <>
      <PageLoader isLoading={isCreating || isDeleting || isUpdating} />
      <PageHeader {...pageHeaderProps} breadcrumnArray={breadcrumbArray} />
      {!isForm ? (
        <>
          {' '}
          <Stack direction="horizontal" align="end" justify="between">
            <TextField placeholder="Search Team Member" label="Search" />
            <Button onClick={handleAddNew}>+Add New</Button>
          </Stack>
          <TeamTable
            columns={vendorColumns}
            data={teamData?.response ?? []}
            getRowId={getRowId}
            sortColumnArr={sorting}
            sortingHandler={setSorting}
            selectedRowsArr={rows}
            selectRowsHandler={setRows}
            pagination={pagination}
            setPagination={setPagination}
            rowCount={teamData?.total ?? 0}
            isLoading={isLoading}
          />
          <ActionButtonContainer show={selectedVendorIds.length > 0}>
            {' '}
            {selectedVendorIds.length === 1 && (
              <>
                <Button onClick={() => handleView()}>View</Button>
                <Button
                  onClick={() => {
                    // handleEdit();
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
          <div>
            <FormActionHeader
              isViewMode={isViewMode}
              isCreating={isCreating}
              keepCreating={keepCreating}
              onGoBack={handleCancel}
              onStartEditing={handleView}
              onToggleKeepCreating={setKeepCreating}
            />
            <div className="my-4">
              <DynamicForm schema={teamForm} data={data} setData={setFormData} onChange={handleChange} isViewMode={false} errors={errors} />
            </div>
            <FormActions onCancel={handleCancel} onSubmit={handleSubmit} isCreating={false} isEdit={isEdit} isViewMode={isViewMode} />
          </div>{' '}
        </>
      )}
    </>
  );
};

export default Team;
