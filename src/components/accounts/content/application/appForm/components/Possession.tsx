import { FC } from 'react';
import { IApplication, ICitizen, IError, IPossession, IRole } from '../../../../../types';
import { Select } from 'antd';

interface IProps {
  form_id: number;
  role: IRole;
  data: IApplication;
  possessions: IPossession[];
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
  citizenPossessions: ICitizen[];
  error: IError | null;
}

export const Possession: FC<IProps> = ({
  form_id,
  role,
  data,
  possessions,
  changeFormData,
  citizenPossessions,
  error,
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
              const new_possession = citizenPossessions.filter((el) => el.possession.id === e);
              if (!new_possession.length) return;
              changeFormData((prev) => ({
                ...prev,
                possession: {
                  id: e,
                  address: new_possession[0].possession.address,
                  type: new_possession[0].possession.type,
                  building: new_possession[0].possession.building,
                },
                complex: {
                  id: new_possession[0].complex.id,
                  name: new_possession[0].complex.name,
                },
                building: {
                  id: new_possession[0].building.id,
                  building: new_possession[0].building.building,
                },
              }));
            }}
            disabled={form_id !== 0 ? true : false}
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
              changeFormData((prev) => ({
                ...prev,
                possession: { ...prev.possession, id: e, address: '' },
              }));
            }}
            disabled={form_id !== 0 || data.building.id === 0 || error ? true : false}
            options={
              form_id !== 0
                ? [{ label: data.possession.address, value: data.possession.id }]
                : possessions.length
                ? possessions.map((el) => ({
                    value: el.id,
                    label: el.address,
                  }))
                : []
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
