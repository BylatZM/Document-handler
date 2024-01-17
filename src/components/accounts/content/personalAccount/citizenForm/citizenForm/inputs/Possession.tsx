import { FC } from 'react';
import {
  ICitizen,
  ICitizenError,
  ICitizenLoading,
  IPosLoading,
  IPossession,
} from '../../../../../../types';
import { Select } from 'antd';

interface IProps {
  data: ICitizen;
  form_id: number;
  error: ICitizenError | null;
  updatingFormId: number | null;
  changeFormData: React.Dispatch<React.SetStateAction<ICitizen>>;
  citizenErrors: (error: ICitizenError | null) => void;
  loadingForm: ICitizenLoading;
  loadingPossession: IPosLoading;
  possessions: IPossession[] | null;
}

export const Possession: FC<IProps> = ({
  data,
  form_id,
  error,
  updatingFormId,
  changeFormData,
  citizenErrors,
  loadingForm,
  loadingPossession,
  possessions,
}) => {
  return (
    <div className='mt-2 mb-2 text-sm'>
      <span>Номер квартиры (номер собственности) </span>
      {updatingFormId === form_id && (
        <Select
          className='w-full'
          disabled={
            loadingForm.form_id === form_id || !data.building.id || !possessions ? true : false
          }
          value={!possessions || !data.possession.id ? undefined : data.possession.id}
          options={
            !possessions ? [] : possessions.map((el) => ({ value: el.id, label: el.address }))
          }
          onChange={(e: number) => {
            if (error) citizenErrors(null);
            changeFormData((prev) => ({
              ...prev,
              possession: {
                id: e,
                address: !possessions ? '' : possessions.filter((el) => el.id === e)[0].address,
                car: possessions ? possessions.filter((el) => el.id === e)[0].car : null,
              },
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
