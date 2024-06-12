import { Select } from 'antd';
import { FC } from 'react';
import {
  ICitizenPossession,
  ICitizenError,
  ICitizenLoading,
  IBuilding,
  IPossession,
  IPosLoading,
  IAboutMeFormSteps,
  IAboutMeGeneralSteps,
} from '../../../../../../types';
import clsx from 'clsx';

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
  setPersonalFormSteps: React.Dispatch<React.SetStateAction<IAboutMeFormSteps>>;
  generalPersonalSteps: IAboutMeGeneralSteps;
  formPersonalSteps: IAboutMeFormSteps;
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
  setPersonalFormSteps,
  generalPersonalSteps,
  formPersonalSteps,
}) => {
  return (
    <div className='mt-2 mb-2 text-sm'>
      <span>Адрес здания</span>
      {updatingFormId === form_id && (
        <div className='relative'>
          <div
            className={clsx(
              !data.building.id &&
                loadingForm.form_id !== form_id &&
                data.complex.id &&
                buildings.length &&
                localStorage.getItem('citizen_registered')
                ? 'heartbeat absolute inset-0 bg-blue-700 rounded-md'
                : 'hidden',
            )}
          ></div>
          <Select
            className='max-sm:h-[30px] h-[40px] w-full'
            disabled={
              loadingForm.form_id === form_id || !data.complex.id || !buildings.length
                ? true
                : false
            }
            value={!data.building.id || !buildings.length ? undefined : data.building.id}
            options={buildings.map((el) => ({ value: el.id, label: el.address }))}
            loading={possessionLoadingField === 'buildings' ? true : false}
            onChange={(e: number) => {
              if (
                generalPersonalSteps.edit_form_button &&
                !formPersonalSteps.building &&
                localStorage.getItem('citizen_registered')
              )
                setPersonalFormSteps((prev) => ({ ...prev, building: true }));
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
        </div>
      )}
      {updatingFormId !== form_id && (
        <Select
          className='max-sm:h-[30px] h-[40px] w-full'
          disabled
          value={!data.building.address ? undefined : data.building.id}
          options={[{ value: data.building.id, label: data.building.address }]}
        />
      )}
    </div>
  );
};
