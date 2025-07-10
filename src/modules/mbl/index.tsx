import FormActions from '@blocks/form-actions';
import MBLForm from '@generator/form';
import { useShipmentApi } from '@modules/shipment/hooks/useShipmentApi';
import { Button, ToggleButton } from '@shared/components';
import PageLoader from '@shared/components/Loader/PageLoader';
import { useFormValidation } from '@shared/hooks/useFormValidation';
import { hydratePayload, joinCompositeFields, removeNulls, splitCompositeFields } from '@shared/utils';
import cloneDeep from 'lodash/cloneDeep';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useMbl from './hooks/useMbl';
import { useMblApi } from './hooks/useMblApi';
import { IMbl, MblSchema } from './index.types';
import { useHblApi } from '@modules/hbl/hooks/useHblApi'; // Import HBL API hook
import { IHbl } from '@modules/hbl/index.types'; // Import IHbl type

const fields = ['shipper', 'agent', 'notify', 'consignee', 'second_notify', 'agent_origin', 'agent_destination'] as const;

// MBLFormPage now might be part of a route like /shipment/:shipmentId/mbl/:mblIdFromParams
// The `id` prop might be shipmentId or mblId depending on previous structure.
// Let's assume `id` is the MBL's direct identifier (or shipmentFolderId if MBL is unique to it)
const MBLFormPage = ({ id: mblIdFromProp }: { id: string }) => { // Renamed prop for clarity
  const params = useParams<{ shipmentId: string; mblId?: string }>(); // Get shipmentId and potentially mblId from route
  const mblId = params.mblId || mblIdFromProp; // Use mblId from route params if available, else from prop

  const [isView, setIsView] = useState(true); // Start in view mode if an mblId exists
  const [mergeDescription, setMergeDescription] = useState(false);

  const { mbl_payload, mbl_form_schema, conditionalFieldsMap } = useMbl();
  const [formData, setFormData] = useState<IMbl>({ ...mbl_payload });
  const { handleChange, errors, validate, setErrors } = useFormValidation(MblSchema, formData);

  const { saveMbl, useGetMblByShipmentId, isSaving } = useMblApi();
  // Assuming `mblId` is the shipment_folder_id for fetching MBL
  const { data, isLoading, refetch: refetchMbl } = useGetMblByShipmentId(mblId);
  const { createShipmentFolder, isCreating } = useShipmentApi();

  const { useGetHblsByMblId, deleteHbl, isDeletingHbl } = useHblApi();
  // Assuming MBL's `_id` field is the one to use for linking HBLs
  // This might need adjustment based on actual MBL data structure (_id vs shipment_folder_id)
  const mblRecordId = data?._id; // Use the actual MBL record ID if available
  const { data: hbls, isLoading: isLoadingHbls, refetch: refetchHbls } = useGetHblsByMblId(mblRecordId);


  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validate();
    if(!isValid) return toast.error('Please correct the form errors.');

    if (!formData.trade_type) return toast.error('Please select a trade type');

    // If `mblId` prop represents a new MBL, it might be 'new' or similar
    // This logic might need to align with how new MBLs are initiated.
    // For now, assuming if `data` (existing MBL) is not present, it's a new MBL.
    if (!data?._id) { // Creating a new MBL
      const shipmentFolder = await createShipmentFolder({ shipment_type: formData.trade_type === 'IMPORT' ? 'IMP' : 'EXP' });
      if (!shipmentFolder?._id) {
        toast.error('Failed to create shipment folder for MBL.');
        return;
      }
      const withShipmentFolderId = { ...formData, shipment_folder_id: shipmentFolder._id };
      const cleanPayload = removeNulls(hydratePayload(withShipmentFolderId));
      const submitPayload = splitCompositeFields(cleanPayload, fields);
      await saveMbl(submitPayload).then((savedMbl) => {
        if (savedMbl) {
          // Navigate to the new MBL's page, which might involve the shipmentId and new MBL's ID
          // This depends on your routing structure, e.g., /shipment/:shipmentId/mbl/:actualMblId
          // For simplicity, navigating to shipment folder view, assuming MBL is listed there or directly accessible.
          navigate(`/shipment/${shipmentFolder._id}`);
          // Or if you want to navigate to the MBL edit page:
          // navigate(`/shipment/${shipmentFolder._id}/mbl/${savedMbl._id}`); // Assuming savedMbl has _id
        }
      });
    } else { // Updating an existing MBL
      // Ensure shipment_folder_id is correctly assigned if it's the primary key for MBLs or if it's just a field
      const withShipmentFolderId = { ...formData, shipment_folder_id: mblId }; // `mblId` here is likely shipment_folder_id
      const cleanPayload = removeNulls(hydratePayload(withShipmentFolderId));
      const submitPayload = splitCompositeFields(cleanPayload, fields);
      await saveMbl(submitPayload).then(() => {
        setIsView(true);
        refetchMbl(); // Refetch MBL data
      });
    }
  };

  const handleCancel = () => {
    if (!data?._id) { // If it was a new MBL form
        navigate(-1); // Go back
    } else { // If editing existing MBL
        const filterNullify = hydratePayload(data ?? {});
        const dataWithAddress = joinCompositeFields(filterNullify, fields);
        setFormData({ ...dataWithAddress });
        setIsView(true);
        setErrors({});
    }
  };

  const handleMblEdit = () => setIsView(false);

  const handleDeleteHbl = async (hblIdToDelete: string) => {
    if (window.confirm('Are you sure you want to delete this HBL?')) {
      try {
        await deleteHbl(hblIdToDelete);
        toast.success('HBL deleted successfully.');
        refetchHbls(); // Refresh the list of HBLs
      } catch (error) {
        // Error toast is handled by useHblApi
      }
    }
  };

  const visibleSchema = useMemo(() => {
    const schema = cloneDeep(mbl_form_schema);

    if (mergeDescription) {
      schema.push({
        type: 'textarea',
        name: 'description_of_goods',
        label: 'Description',
        colSpan: 3,
      });
      schema.filter((f) => {
        if (f.type === 'array' && f.name === 'containers') {
          f.item.fields = f.item.fields.filter((f) => f.name !== 'description');
        }
      });
    }

    if (formData?.trade_type?.toUpperCase() === 'IMPORT') {
      if (formData.movement_type?.toUpperCase() === 'RAIL') {
        const { IMPORT_RAIL: import_rail_fields, IMPORT_RAIL_CONTAINER } = conditionalFieldsMap;
        schema.push(...import_rail_fields);
        const container = schema.find((f) => f.name === 'containers');
        if (container?.type === 'array' && container?.item?.fields) {
          container.item.fields.push(...IMPORT_RAIL_CONTAINER);
        }
      }
      return schema;
    } else if (formData?.trade_type?.toUpperCase() === 'EXPORT') {
      if (formData.movement_type?.toUpperCase() === 'RAIL') {
        const { EXPORT_RAIL, EXPORT_RAIL_CONTAINER } = conditionalFieldsMap;
        schema.push(...EXPORT_RAIL);
        const container = schema.find((f) => f.name === 'containers');
        if (container?.type === 'array' && container?.item?.fields) {
          container.item.fields.push(...EXPORT_RAIL_CONTAINER);
        }
      } else if (formData.movement_type?.toUpperCase() === 'ROAD') {
        const { EXPORT_ROAD, EXPORT_ROAD_CONTAINER } = conditionalFieldsMap;
        schema.push(...EXPORT_ROAD);
        const container = schema.find((f) => f.name === 'containers');
        if (container?.type === 'array' && container?.item?.fields) {
          container.item.fields.push(...EXPORT_ROAD_CONTAINER);
        }
      }
      return schema;
    } else {
      return schema;
    }
  }, [formData, conditionalFieldsMap, mbl_form_schema, mergeDescription]);

  useEffect(() => {
    if (data) { // If existing MBL data is loaded
      const filterNullify = hydratePayload(data ?? {});
      const dataWithAddress = joinCompositeFields(filterNullify, fields);
      setFormData({ ...dataWithAddress });
      setIsView(true); // Set to view mode when data is loaded
    } else if (mblId === 'new' || !mblId) { // If it's explicitly a new MBL or no ID
      setFormData(mbl_payload); // Reset to initial payload
      setIsView(false); // Start in edit mode for new MBL
    }
  }, [data, mblId, mbl_payload]); // Rerun if `data` or `mblId` changes, or mbl_payload (though less likely to change)

  // console.log(formData, 'AFTER UPDATE');

  // Determine the shipmentId to use for navigation links.
  // It could be from route params, or from the MBL data itself if it contains shipment_folder_id
  const currentShipmentId = params.shipmentId || data?.shipment_folder_id || mblId;


  if (isLoading && mblId !== 'new' && mblId) { // Show loader if loading existing MBL
    return <PageLoader isLoading={true} />;
  }

  return (
    <>
      <PageLoader isLoading={isSaving || isCreating || isDeletingHbl || (isLoading && mblId !=='new')} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>{data?._id ? `MBL: ${formData.mbl_number || mblId}` : 'Create New MBL'}</h1>
        {data?._id && isView && (
          <Button onClick={handleMblEdit} variant="outlined">Edit MBL</Button>
        )}
         {data?._id && !isView && (
          <Button onClick={handleCancel} variant="outlined">Cancel Edit</Button>
        )}
      </div>

      {/* <Button onClick={() => setIsView(!isView)}>{isView ? 'Edit' : 'Cancel MBL Edit'}</Button> */}
      <div className="pt-4"></div>
      {data?._id && ( // Show these only if it's an existing MBL
        <>
          <ToggleButton label="Merge Description" defaultChecked={mergeDescription} onChange={setMergeDescription} />
          <div className="shipment_info_card">Total Containers in MBL: {data?.containers?.length}</div>
        </>
      )}
      <MBLForm errors={errors} onChange={handleChange} data={formData} isViewMode={isView} setData={setFormData} schema={visibleSchema} />
      <FormActions
        isCreating={!data?._id} // True if it's a new MBL
        isViewMode={isView}
        isEdit={!!data?._id} // True if it's an existing MBL
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        submitText={!data?._id ? 'Create MBL' : 'Save MBL Changes'}
        cancelText={!data?._id ? 'Cancel Creation' : 'Cancel MBL Edit'}
      />

      {/* Section for HBLs - only show if viewing an existing MBL */}
      {data?._id && mblRecordId && (
        <div className="hbl-section" style={{ marginTop: '2rem' }}>
          <h2>House Bills of Lading (HBLs)</h2>
          {isLoadingHbls && <p>Loading HBLs...</p>}
          {!isLoadingHbls && hbls && hbls.length === 0 && <p>No HBLs found for this MBL.</p>}
          {!isLoadingHbls && hbls && hbls.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {hbls.map((hbl: IHbl) => (
                <li key={hbl._id} style={{ marginBottom: '0.5rem', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Link to={`/shipment/${currentShipmentId}/mbl/${mblRecordId}/hbl/${hbl._id}`}>
                    {hbl.hbl_number || 'View HBL'} (Date: {hbl.hbl_date || 'N/A'})
                  </Link>
                  <div>
                    <Button
                        onClick={() => navigate(`/shipment/${currentShipmentId}/mbl/${mblRecordId}/hbl/${hbl._id}`)}
                        variant="text"
                        size="small"
                        style={{marginRight: '8px'}}
                    >
                        View/Edit
                    </Button>
                    <Button
                        onClick={() => handleDeleteHbl(hbl._id!)}
                        variant="danger"
                        size="small"
                        disabled={isDeletingHbl}
                    >
                        Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Button
            onClick={() => navigate(`/shipment/${currentShipmentId}/mbl/${mblRecordId}/hbl/new?mblId=${mblRecordId}&shipmentFolderId=${currentShipmentId}`)}
            variant="primary"
            style={{ marginTop: '1rem' }}
          >
            Add New HBL
          </Button>
        </div>
      )}
    </>
  );
};

export default MBLFormPage;
