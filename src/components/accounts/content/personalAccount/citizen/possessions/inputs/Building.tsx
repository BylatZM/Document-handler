import { Select } from 'antd';
import { FC } from 'react';
import {
  IBuilding,
  ICitizen,
  ICitizenError,
  ICitizenLoading,
  IPosLoading,
} from '../../../../../../types';

interface IProps {
  data: ICitizen;
  form_id: number;
  updatingFormId: number | null;
  changeFormData: React.Dispatch<React.SetStateAction<ICitizen>>;
  citizenErrors: (error: ICitizenError | null) => void;
  getPossessions: (type: string, building_id: string) => void;
  loadingForm: ICitizenLoading;
  loadingPossession: IPosLoading;
  buildings: IBuilding[] | null;
}

export const Building: FC<IProps> = ({
  data,
  form_id,
  updatingFormId,
  changeFormData,
  citizenErrors,
  getPossessions,
  loadingForm,
  loadingPossession,
  buildings,
}) => {
  return (
    <div className='mt-2 mb-2 text-sm'>
      <span>Адрес здания</span>
      {updatingFormId === form_id && (
        <Select
          className='w-full'
          disabled={
            loadingForm.form_id === form_id || !data.complex.id || loadingPossession === 'building'
              ? true
              : false
          }
          value={!data.building.id || !buildings ? undefined : data.building.id}
          options={!buildings ? [] : buildings.map((el) => ({ value: el.id, label: el.address }))}
          onChange={(e: number) => {
            citizenErrors(null);
            changeFormData((prev) => ({
              ...prev,
              building: {
                id: e,
                address: !buildings ? '' : buildings.filter((el) => el.id === e)[0].address,
              },
              possession: { id: 0, address: '', car: null },
            }));
            getPossessions(data.possessionType, e.toString());
          }}
        />
      )}
      {updatingFormId !== form_id && (
        <Select
          className='w-full'
          disabled
          value={!data.building.address ? undefined : data.building.id}
          options={[{ value: data.building.id, label: data.building.address }]}
        />
      )}
    </div>
  );
};
