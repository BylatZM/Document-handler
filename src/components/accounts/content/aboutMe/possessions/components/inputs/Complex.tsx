import { FC } from 'react';
import { Select } from 'antd';
import {
  IBuilding,
  ICitizen,
  ICitizenError,
  ICitizenLoading,
  IComplex,
  IPosLoading,
  IPossession,
} from '../../../../../../types';

interface IProps {
  data: ICitizen;
  form_id: number;
  error: ICitizenError | null;
  updatingFormId: number | null;
  changeFormData: React.Dispatch<React.SetStateAction<ICitizen>>;
  citizenErrors: (error: ICitizenError | null) => void;
  getBuildings: (complex_id: string) => void;
  loadingForm: ICitizenLoading;
  complexes: IComplex[];
  emptyPossession: IPossession;
  emptyBuilding: IBuilding;
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
}) => {
  return (
    <div className='mt-2 mb-2 text-sm'>
      <span>Название жилого комплекса</span>
      {updatingFormId === form_id && (
        <Select
          className='w-full'
          disabled={
            (loadingForm && loadingForm.form_id === form_id) || !complexes.length ? true : false
          }
          value={!data.complex.name ? undefined : data.complex.id}
          options={complexes.map((el) => ({ value: el.id, label: el.name }))}
          onChange={(e: number) => {
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
      )}
      {updatingFormId !== form_id && (
        <Select
          className='w-full'
          disabled
          value={!data.complex.name ? undefined : data.complex.id}
          options={[{ value: data.complex.id, label: data.complex.name }]}
        />
      )}
    </div>
  );
};
