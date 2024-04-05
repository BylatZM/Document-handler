import { FC } from 'react';
import { ICitizen, ICitizenError, ICitizenLoading, IPossession } from '../../../../../../types';
import { Select } from 'antd';

interface IProps {
  data: ICitizen;
  form_id: number;
  error: ICitizenError | null;
  updatingFormId: number | null;
  changeFormData: React.Dispatch<React.SetStateAction<ICitizen>>;
  citizenErrors: (error: ICitizenError | null) => void;
  loadingForm: ICitizenLoading;
  possessions: IPossession[];
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
}) => {
  return (
    <div className='mt-2 mb-2 text-sm'>
      <span>Номер собственности</span>
      {updatingFormId === form_id && (
        <Select
          className='w-full'
          disabled={
            loadingForm.form_id === form_id || !data.building.id || !possessions.length
              ? true
              : false
          }
          value={!possessions.length || !data.possession.id ? undefined : data.possession.id}
          options={possessions.map((el) => ({ value: el.id, label: el.address }))}
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
          value={!data.possession.address ? undefined : data.possession.id}
          options={[{ value: data.possession.id, label: data.possession.address }]}
        />
      )}
      {error && error.form_id === form_id && error.error.type === 'possession' && (
        <div className='errorText'>{error.error.error}</div>
      )}
    </div>
  );
};
