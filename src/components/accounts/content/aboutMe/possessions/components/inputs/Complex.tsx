import { FC } from 'react';
import { Select } from 'antd';
import {
  IBuilding,
  ICitizenPossession,
  ICitizenError,
  ICitizenLoading,
  IComplex,
  IPossession,
  IAboutMeFormSteps,
  IAboutMeGeneralSteps,
} from '../../../../../../types';
import clsx from 'clsx';

interface IProps {
  data: ICitizenPossession;
  form_id: number;
  error: ICitizenError | null;
  updatingFormId: number | null;
  changeFormData: React.Dispatch<React.SetStateAction<ICitizenPossession>>;
  citizenErrors: (error: ICitizenError | null) => void;
  getBuildings: (complex_id: string) => void;
  loadingForm: ICitizenLoading;
  complexes: IComplex[];
  emptyPossession: IPossession;
  emptyBuilding: IBuilding;
  setPersonalFormSteps: React.Dispatch<React.SetStateAction<IAboutMeFormSteps>>;
  generalPersonalSteps: IAboutMeGeneralSteps;
  formPersonalSteps: IAboutMeFormSteps;
}

export const Complex: FC<IProps> = ({
  data,
  form_id,
  error,
  updatingFormId,
  changeFormData,
  citizenErrors,
  getBuildings,
  loadingForm,
  complexes,
  emptyPossession,
  emptyBuilding,
  setPersonalFormSteps,
  generalPersonalSteps,
  formPersonalSteps,
}) => {
  return (
    <div className='mt-2 mb-2 text-sm'>
      <span className='primaryField'>Название жилого комплекса</span>
      {updatingFormId === form_id && (
        <div className='relative'>
          <div
            className={clsx(
              !data.complex.id && localStorage.getItem('citizen_registered')
                ? 'heartbeat absolute inset-0 bg-blue-700 rounded-md'
                : 'hidden',
            )}
          ></div>
          <Select
            className='w-full max-sm:h-[30px] h-[40px]'
            disabled={
              (loadingForm && loadingForm.form_id === form_id) || !complexes.length ? true : false
            }
            value={!data.complex.name ? undefined : data.complex.id}
            options={complexes.map((el) => ({ value: el.id, label: el.name }))}
            onChange={(e: number) => {
              if (
                generalPersonalSteps.edit_form_button &&
                !formPersonalSteps.complex &&
                localStorage.getItem('citizen_registered')
              )
                setPersonalFormSteps((prev) => ({ ...prev, complex: true }));
              if (error && error.error.type === 'possession') citizenErrors(null);
              const new_complex = complexes.filter((el) => el.id === e);
              if (!new_complex.length) return;
              changeFormData((prev) => ({
                ...prev,
                complex: { ...new_complex[0] },
                building: { ...emptyBuilding },
                possession: { ...emptyPossession },
              }));
              getBuildings(e.toString());
            }}
          />
        </div>
      )}
      {updatingFormId !== form_id && (
        <Select
          className='w-full max-sm:h-[30px] h-[40px]'
          disabled
          value={!data.complex.name ? undefined : data.complex.id}
          options={[{ value: data.complex.id, label: data.complex.name }]}
        />
      )}
    </div>
  );
};
