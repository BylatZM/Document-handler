import { Select } from 'antd';
import { FC } from 'react';
import {
  IPossession,
  ICitizen,
  ICitizenError,
  ICitizenLoading,
  IBuilding,
} from '../../../../../../types';

interface IProps {
  data: ICitizen;
  form_id: number;
  updatingFormId: number | null;
  changeFormData: React.Dispatch<React.SetStateAction<ICitizen>>;
  citizenErrors: (error: ICitizenError | null) => void;
  getPossessions: (type: string, building_id: string) => void;
  loadingForm: ICitizenLoading;
  buildings: IBuilding[];
}

export const Building: FC<IProps> = ({
  data,
  form_id,
  updatingFormId,
  changeFormData,
  citizenErrors,
  getPossessions,
  loadingForm,
  buildings,
}) => {
  return (
    <div className='mt-2 mb-2 text-sm'>
      <span>Адрес здания</span>
      {updatingFormId === form_id && (
        <Select
          className='h-[50px] sm:h-[32px] w-full'
          disabled={
            loadingForm.form_id === form_id || !data.complex.id || !buildings.length ? true : false
          }
          value={!data.building.id || !buildings.length ? undefined : data.building.id}
          options={buildings.map((el) => ({ value: el.id, label: el.building }))}
          onChange={(e: number) => {
            citizenErrors(null);
            changeFormData((prev) => ({
              ...prev,
              building: {
                id: e,
                building: !buildings.length
                  ? ''
                  : buildings.filter((el) => el.id === e)[0].building,
              },
              possession: { id: 0, address: '', type: '', building: '' },
            }));
            getPossessions(data.possessionType, e.toString());
          }}
        />
      )}
      {updatingFormId !== form_id && (
        <Select
          className='h-[50px] sm:h-[32px] w-full'
          disabled
          value={!data.building.building ? undefined : data.building.id}
          options={[{ value: data.building.id, label: data.building.building }]}
        />
      )}
    </div>
  );
};
