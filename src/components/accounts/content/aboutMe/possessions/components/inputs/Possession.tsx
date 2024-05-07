import { FC } from 'react';
import {
  ICitizenPossession,
  ICitizenError,
  ICitizenLoading,
  IPosLoading,
  IPossession,
} from '../../../../../../types';
import { Select } from 'antd';

interface IProps {
  data: ICitizenPossession;
  form_id: number;
  error: ICitizenError | null;
  updatingFormId: number | null;
  changeFormData: React.Dispatch<React.SetStateAction<ICitizenPossession>>;
  citizenErrors: (error: ICitizenError | null) => void;
  loadingForm: ICitizenLoading;
  possessions: IPossession[];
  possessionLoadingField: IPosLoading;
}

export const Possession: FC<IProps> = ({
  data,
  form_id,
  error,
  updatingFormId,
  changeFormData,
  citizenErrors,
  loadingForm,
  possessions,
  possessionLoadingField,
}) => {
  return (
    <div className='mt-2 mb-2 text-sm'>
      <span>Номер собственности</span>
      {updatingFormId === form_id && (
        <Select
          className='w-full'
          disabled={
            loadingForm.form_id === form_id ||
            !data.building.id ||
            !possessions.length ||
            possessionLoadingField === 'possessions'
              ? true
              : false
          }
          value={!possessions.length || !data.possession.id ? undefined : data.possession.id}
          options={possessions.map((el) => ({ value: el.id, label: el.name }))}
          loading={possessionLoadingField === 'possessions' ? true : false}
          status={
            error && error.form_id === form_id && error.error.type === 'possession'
              ? 'error'
              : undefined
          }
          onChange={(e: number) => {
            if (error && error.error.type === 'possession') citizenErrors(null);
            const new_possession = possessions.filter((el) => el.id === e);
            if (!new_possession.length) return;
            changeFormData((prev) => ({
              ...prev,
              possession: { ...new_possession[0] },
            }));
          }}
        />
      )}
      {updatingFormId !== form_id && (
        <Select
          className='w-full'
          disabled
          value={!data.possession.name ? undefined : data.possession.id}
          options={[{ value: data.possession.id, label: data.possession.name }]}
        />
      )}
      {error && error.form_id === form_id && error.error.type === 'possession' && (
        <div className='errorText'>{error.error.error}</div>
      )}
    </div>
  );
};
