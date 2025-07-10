import FormActions from '@blocks/form-actions';
import HBLFormGenerator from '@generator/form'; // Assuming MBLForm can be generalized or a new HBLForm component is made
import { Button } from '@shared/components';
import PageLoader from '@shared/components/Loader/PageLoader';
import { useFormValidation } from '@shared/hooks/useFormValidation';
import { hydratePayload, removeNulls } from '@shared/utils'; // Assuming split/join composite fields might not be needed or handled differently for HBL
import cloneDeep from 'lodash/cloneDeep';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import useHbl from './hooks/useHbl';
import { useHblApi } from './hooks/useHblApi';
import { IHbl, HblSchema } from './index.types';

// If HBL has composite fields like MBL, define them here
// const fieldsToJoinAndSplit = ['shipper', 'consignee', 'notify_party', 'forwarding_agent']; // Example

const HBLFormPage = () => {
  const { shipmentId, mblId, hblId } = useParams<{ shipmentId: string; mblId: string; hblId: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isCreatingNew = hblId === 'new';

  // Extract mblId and shipmentFolderId from query params if passed for a new HBL
  const mblIdFromQuery = queryParams.get('mblId');
  const shipmentFolderIdFromQuery = queryParams.get('shipmentFolderId') || shipmentId;


  const [isView, setIsView] = useState(!isCreatingNew); // If not new, start in view mode

  const { hbl_payload, hbl_form_schema } = useHbl(mblIdFromQuery || mblId, shipmentFolderIdFromQuery);
  const [formData, setFormData] = useState<Partial<IHbl>>(hbl_payload);
  const { handleChange, errors, setErrors, validate } = useFormValidation(HblSchema, formData);

  const { saveHbl, useGetHblById, isSavingHbl } = useHblApi();
  const { data: existingHblData, isLoading: isLoadingHbl, refetch } = useGetHblById(isCreatingNew ? undefined : hblId);

  const navigate = useNavigate();

  useEffect(() => {
    if (existingHblData) {
      // const dataWithJoinedFields = joinCompositeFields(hydratePayload(existingHblData), fieldsToJoinAndSplit); // If using composite fields
      setFormData(hydratePayload(existingHblData));
      setIsView(true); // Existing data, start in view mode
    } else if (isCreatingNew) {
      // For new HBL, ensure mbl_id and shipment_folder_id are set if available
      setFormData(prev => ({
        ...hbl_payload,
        ...prev, // any existing partial data
        mbl_id: mblIdFromQuery || mblId || '',
        shipment_folder_id: shipmentFolderIdFromQuery || '',
      }));
      setIsView(false); // New form, start in edit mode
    }
  }, [existingHblData, isCreatingNew, mblId, mblIdFromQuery, shipmentFolderIdFromQuery, hbl_payload]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) {
        toast.error('Please correct the form errors.');
        return;
    }

    let payloadToSave: Partial<IHbl> = cloneDeep(formData);
    payloadToSave = removeNulls(payloadToSave);
    // payloadToSave = splitCompositeFields(payloadToSave, fieldsToJoinAndSplit); // If using composite fields

    // Ensure mbl_id and shipment_folder_id are in the payload
    if (!payloadToSave.mbl_id && (mblId || mblIdFromQuery)) {
        payloadToSave.mbl_id = mblId || mblIdFromQuery;
    }
    if (!payloadToSave.shipment_folder_id && (shipmentId || shipmentFolderIdFromQuery)) {
        payloadToSave.shipment_folder_id = shipmentId || shipmentFolderIdFromQuery;
    }

    if (!payloadToSave.mbl_id && !payloadToSave.shipment_folder_id) {
      toast.error("MBL ID or Shipment Folder ID is required to save HBL.");
      return;
    }


    try {
      const savedHbl = await saveHbl(payloadToSave);
      if (savedHbl) {
        if (isCreatingNew) {
          // Navigate to the edit page of the newly created HBL
          // The navigation path might depend on how you structure your routes,
          // assuming shipmentId and mblId are available for context.
          navigate(`/shipment/${shipmentFolderIdFromQuery || shipmentId}/mbl/${mblIdFromQuery || mblId}/hbl/${savedHbl._id}`);
        } else {
          setIsView(true); // Switch to view mode after successful update
          refetch(); // Refetch data to display the latest version
        }
      }
    } catch (error) {
      // Error is handled by useHblApi hook's toast message
      console.error("Failed to save HBL:", error);
    }
  };

  const handleCancel = () => {
    if (isCreatingNew) {
      // If creating new, navigate back, perhaps to MBL page or shipment page
      navigate(-1); // Or a more specific path
    } else {
      // If editing, revert changes and switch to view mode
      if (existingHblData) {
        // const dataWithJoinedFields = joinCompositeFields(hydratePayload(existingHblData), fieldsToJoinAndSplit);
        setFormData(hydratePayload(existingHblData));
      }
      setIsView(true);
      setErrors({}); // Clear any validation errors
    }
  };

  const handleEdit = () => {
    setIsView(false);
  };

  // Memoize the visible schema if it can change dynamically (like in MBLForm)
  // For now, assuming hbl_form_schema is static. If it has conditional fields:
  const visibleSchema = useMemo(() => {
    const schema = cloneDeep(hbl_form_schema);
    // Apply conditional logic to schema if needed, similar to MBLFormPage
    // Example: if (formData.some_condition) { ... modify schema ... }
    return schema;
  }, [hbl_form_schema, formData]);


  if (isLoadingHbl && !isCreatingNew) {
    return <PageLoader isLoading={true} />;
  }

  return (
    <>
      <PageLoader isLoading={isSavingHbl || (isLoadingHbl && !isCreatingNew)} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>{isCreatingNew ? 'Create New HBL' : `HBL: ${formData.hbl_number || hblId}`}</h1>
        {!isView && !isCreatingNew && <Button onClick={() => setIsView(true)} variant="outlined">Cancel Edit</Button>}
      </div>

      {isView && !isCreatingNew && (
        <Button onClick={handleEdit} style={{ marginBottom: '1rem' }}>Edit HBL</Button>
      )}

      <HBLFormGenerator
        errors={errors}
        onChange={handleChange}
        data={formData}
        isViewMode={isView}
        setData={setFormData} // Allow form generator to update state (e.g. for array items)
        schema={visibleSchema}
      />
      <FormActions
        isCreating={isCreatingNew}
        isViewMode={isView}
        isEdit={!isCreatingNew} // True if it's an existing record
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        submitText={isCreatingNew ? 'Create HBL' : 'Save Changes'}
        cancelText={isCreatingNew ? 'Cancel Creation' : 'Cancel Edit'}
      />
    </>
  );
};

export default HBLFormPage;
