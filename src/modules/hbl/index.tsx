import HBLCreationForm from '@generator/form';
import { fields } from '@modules/mbl';
import useMbl from '@modules/mbl/hooks/useMbl';
import { useGetMblByShipmentId } from '@modules/mbl/hooks/useMblApi';
import { Button } from '@shared/components';
import { Stack } from '@shared/components/Stack';
import { joinCompositeFields } from '@shared/utils';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetHblsByShipmentId } from './hooks/useHblApi';
import { getVisibleSchema } from './utils';
import { IHbl } from './index.types';

const HBL = ({ id }: { id: string }) => {
  const navigate = useNavigate();
  const { mbl_form_schema, conditionalFieldsMap } = useMbl();

  const [hblList, setHblList] = useState<IHbl[] | undefined>([]);
  const { data: mblData, isLoading } = useGetMblByShipmentId(id);
  const { data: hblDataList, isLoading: hblLoading } = useGetHblsByShipmentId(id);

  const visibleSchema = useMemo(() => {
    if (!Array.isArray(hblDataList) || hblDataList?.length === 0) return [];
    return hblDataList?.map((formData) => {
      let mergeDescription = false;
      const { description } = formData;
      if (description) {
        mergeDescription = true;
      }

      return getVisibleSchema({
        formData: formData,
        conditionalFieldsMap,
        mbl_form_schema,
        mergeDescription,
      });
    });
  }, [conditionalFieldsMap, mbl_form_schema, hblDataList]);

  useEffect(() => {
    if (!Array.isArray(hblDataList) || hblDataList?.length === 0) return;
    const updatedHbl = hblDataList.map((item) => {
      return joinCompositeFields(item, fields);
    });
    setHblList(updatedHbl);
  }, [hblDataList]);

  const handleChangeOfFormData = (updatedFormData: object, index: number) => {
    setHblList((prev) => prev?.map((form, i) => (i === index ? { ...form, ...updatedFormData } : form)));
  };

  const handleNewHbl = () => {
    navigate('hbl/new');
  };
  if (isLoading) return 'Loading ...';

  if (!mblData) return 'Please create MBL first to proceed with creating HBL';
  if (!mblData?.containers?.length) return 'Please add atleast one container in MBL to proceed with creating HBL';
  if (!mblData?.shipping_bill?.length && !mblData?.bill_of_entry?.length)
    return 'Cannot create HBL without having Bill of entry number/ Shipping Bill number';

  if (id !== 'new')
    return (
      <div>
        <Stack direction="horizontal" justify="end" className="mb-5">
          <Button onClick={handleNewHbl}>+ New HBL</Button>
        </Stack>
        {!hblLoading &&
          hblDataList &&
          hblDataList?.length > 0 &&
          hblList?.map((hblForm, i) => {
            return (
              <div className="py-10">
                <Stack direction="horizontal" justify="between">
                  <h1>HBL FORM {hblForm?.hbl_number ?? i + 1} </h1> <Button onClick={() => navigate(`hbl/${hblForm?._id}`)}>Edit</Button>
                </Stack>
                {hblDataList.length > 0 && (
                  <HBLCreationForm
                    schema={visibleSchema[i]}
                    data={hblForm || {}}
                    setData={(updated) => handleChangeOfFormData(updated, i)}
                    errors={{}}
                    isViewMode={true}
                    onChange={(e, val) => {
                      console.log(e, val);
                    }}
                  />
                )}
              </div>
            );
          })}
      </div>
    );
};

export default HBL;
