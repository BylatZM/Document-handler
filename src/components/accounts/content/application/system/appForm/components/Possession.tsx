import { FC } from 'react';
import {
  IApplication,
  ICitizenPossession,
  IError,
  IPosLoading,
  IPossession,
  IRole,
} from '../../../../../../types';
import { Select } from 'antd';

interface IProps {
  form_id: number;
  role: IRole;
  data: IApplication;
  possessions: IPossession[];
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
  citizenPossessions: ICitizenPossession[];
  error: IError | null;
  possessionLoadingField: IPosLoading;
}

export const Possession: FC<IProps> = ({
  form_id,
  role,
  data,
  possessions,
  changeFormData,
  citizenPossessions,
  error,
  possessionLoadingField,
}) => {
  return (
    <div className='flex flex-col gap-2 w-full md:w-[48%]'>
      <span>Собственность</span>
      {role === 'citizen' && (
        <>
          <Select
            className='h-[50px]'
            value={!data.possession.id ? undefined : data.possession.id}
            onChange={(e: number) => {
              const newPossession = citizenPossessions.filter((el) => el.possession.id === e);
              if (!newPossession.length) return;
              changeFormData((prev) => ({
                ...prev,
                possession: { ...newPossession[0].possession },
                complex: { ...newPossession[0].complex },
                building: { ...newPossession[0].building },
              }));
            }}
            disabled={form_id !== 0 || citizenPossessions.length === 0 ? true : false}
            options={
              form_id !== 0
                ? [{ label: data.possession.address, value: data.possession.id }]
                : citizenPossessions
                    .filter((el) => el.approving_status === 'Подтверждена')
                    .map((el) => ({
                      value: el.possession.id,
                      label: el.possession.address,
                    }))
            }
          />
          {error && error.type === 'possession' && <span className='errorText'>{error.error}</span>}
        </>
      )}
      {role === 'dispatcher' && (
        <>
          <Select
            className='h-[50px]'
            value={!data.possession.id ? undefined : data.possession.id}
            onChange={(e: number) => {
              const newPossession = possessions.filter((el) => el.id === e);
              if (!newPossession.length) return;
              changeFormData((prev) => ({
                ...prev,
                possession: { ...newPossession[0] },
              }));
            }}
            loading={possessionLoadingField === 'possessions' ? true : false}
            disabled={
              form_id !== 0 ||
              !data.building.id ||
              (error && error.type === 'possession') ||
              !possessions.length ||
              possessionLoadingField === 'possessions'
                ? true
                : false
            }
            options={
              form_id !== 0
                ? [{ label: data.possession.address, value: data.possession.id }]
                : possessions.map((el) => ({
                    value: el.id,
                    label: el.address,
                  }))
            }
          />
          {error && error.type === 'possession' && <span className='errorText'>{error.error}</span>}
        </>
      )}
      {role === 'executor' && (
        <Select
          className='h-[50px]'
          value={!data.possession.id ? undefined : data.possession.id}
          disabled
          options={[{ label: data.possession.address, value: data.possession.id }]}
        />
      )}
    </div>
  );
};
