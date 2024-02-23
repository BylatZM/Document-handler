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
        <Select
          className='h-[50px]'
          value={!data.possession.id ? undefined : data.possession.id}
          onChange={(e: number) => {
            const citizen = citizenPossessions.filter((el) => el.possession.id === e)[0];
            changeFormData((prev) => ({
              ...prev,
              possession: {
                id: e,
                address: citizen.possession.address,
                type: citizen.possession.type,
                building: citizen.possession.building,
              },
              complex: {
                id: citizen.complex.id,
                name: citizen.complex.name,
              },
              building: {
                id: citizen.building.id,
                building: citizen.building.building,
              },
            }));
          }}
          disabled={form_id !== 0 ? true : false}
          options={
            form_id !== 0
              ? [{ label: data.possession.address, value: data.possession.id }]
              : citizenPossessions.map((el) => ({
                  value: el.possession.id,
                  label: el.possession.address,
                }))
          }
        />
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
          {error && <span className='errorText'>{error.error}</span>}
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
