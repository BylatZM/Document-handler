import { FC } from 'react';
import { Select } from 'antd';
import {
  ICitizen,
  ICitizenError,
  ICitizenLoading,
  IComplex,
  IPosLoading,
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
  loadingPossession: IPosLoading;
  complexes: IComplex[] | null;
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
  loadingPossession,
  complexes,
}) => {
  return (
    <div className='mt-2 mb-2 text-sm'>
      <span>Название жилого комплекса</span>
      {updatingFormId === form_id && (
        <Select
          className='w-full'
          disabled={
            (loadingForm && loadingForm.form_id === form_id) ||
            !complexes ||
            loadingPossession === 'complex'
              ? true
              : false
          }
          value={!data.complex.name ? undefined : data.complex.id}
          options={!complexes ? [] : complexes.map((el) => ({ value: el.id, label: el.name }))}
          onChange={(e: number) => {
            if (error) citizenErrors(null);
            changeFormData((prev) => ({
              ...prev,
              complex: { id: e, name: '' },
              building: { id: 0, address: '' },
              possession: { id: 0, address: '', car: null },
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
