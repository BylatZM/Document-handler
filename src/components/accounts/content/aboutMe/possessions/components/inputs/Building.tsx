import { Select } from 'antd';
import { FC } from 'react';
import {
  ICitizenPossession,
  ICitizenError,
  ICitizenLoading,
  IBuilding,
  IPossession,
  IPosLoading,
} from '../../../../../../types';

interface IProps {
  data: ICitizenPossession;
  form_id: number;
  updatingFormId: number | null;
  changeFormData: React.Dispatch<React.SetStateAction<ICitizenPossession>>;
  citizenErrors: (error: ICitizenError | null) => void;
  loadingForm: ICitizenLoading;
  buildings: IBuilding[];
  error: ICitizenError | null;
  emptyPossession: IPossession;
  possessionLoadingField: IPosLoading;
  checkPossessionsRequestOnError: (
    form_id: number,
    possession_type: string,
    building_id: string,
  ) => Promise<void>;
}

export const Building: FC<IProps> = ({
  data,
  form_id,
  updatingFormId,
  changeFormData,
  citizenErrors,
  loadingForm,
  buildings,
  error,
  emptyPossession,
  possessionLoadingField,
  checkPossessionsRequestOnError,
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
          loading={possessionLoadingField === 'buildings' ? true : false}
          onChange={(e: number) => {
            if (error && error.error.type === 'possession') citizenErrors(null);
            const new_building = buildings.filter((el) => el.id === e);
            if (!new_building.length) return;
            changeFormData((prev) => ({
              ...prev,
              building: { ...new_building[0] },
              possession: { ...emptyPossession },
            }));
            checkPossessionsRequestOnError(form_id, data.possession_type, e.toString());
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
