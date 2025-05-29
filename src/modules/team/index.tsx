import DeleteModal from '@blocks/delete-modal';
import FormActions from '@blocks/form-actions';
import { FormActionHeader } from '@blocks/form-header';
import PageHeader from '@blocks/page-header';
import DynamicForm from '@generator/form';
import TeamTable from '@generator/table';
import { Button, TextField } from '@shared/components';
import ActionButtonContainer from '@shared/components/ActionDialouge';
import PageLoader from '@shared/components/Loader/PageLoader';
import { Stack } from '@shared/components/Stack';
import { useDebounce } from '@shared/hooks/useDebounce';
import { useFormValidation } from '@shared/hooks/useFormValidation';
import { useModal } from '@shared/hooks/useModa';
import usePageState from '@shared/hooks/usePageState';
import { returnSelectedRecord } from '@shared/utils';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { generateDummyTeamData } from './hooks/dummyData';
import useTeam from './hooks/useTeam';
import { useTeamApi } from './hooks/useTeamApi';
import { ITeam, teamSchema } from './index.types';

const Team = () => {
  const getRowId = (row: ITeam) => row._id;
  const { formSchema: teamForm, payload, columns: vendorColumns } = useTeam();
  const { isCreating, isDeleting, isUpdating, useGetTeam, createTeam, updateTeam, removeTeam } = useTeamApi();
  const { openModal: openDeleteModal, closeModal: closeDeleteModal, isOpen: isDeleteModalOpen } = useModal();
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

    if (!record) {
      console.error('record id mismatch', record, selectedVendorIds[0]);
      toast.error('Error Id Mismatch');
      return;
    }
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

  const handleDeleteConfirm = async () => {
    await removeTeam(selectedVendorIds[0]);
    setRows({});
    closeDeleteModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validate();
    if (!isValid) return;

    if (!isEdit) {
      const createTeamResponse = await createTeam(data);
      if (createTeamResponse && keepCreating) {
        setFormData(payload);
      } else {
        handleCancel();
      }
    } else {
      const record = returnSelectedRecord(teamData?.response, selectedVendorIds[0]);
      if (record) {
        await updateTeam({ id: record._id, payload: data });
        handleCancel();
      }
    }
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
              <DynamicForm schema={teamForm} data={data} setData={setFormData} onChange={handleChange} isViewMode={isViewMode} errors={errors} />
            </div>
            <FormActions onCancel={handleCancel} onSubmit={handleSubmit} isCreating={false} isEdit={isEdit} isViewMode={isViewMode} />
          </div>{' '}
        </>
      )}
      {/*  Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete Team Member"
        message="Are you sure you want to delete this team member? This action cannot be undone."
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </>
  );
};

export default Team;
