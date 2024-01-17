import { FC } from 'react';
import { IApplication, ICar, ICitizen, IPossession, IRole } from '../../../../../types';
import { Select } from 'antd';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';

interface IProps {
  form_id: number;
  role: IRole;
  data: IApplication;
  possessions: IPossession[] | null;
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
  changeCarInfo: React.Dispatch<React.SetStateAction<ICar | null>>;
  citizenPossessions: ICitizen[];
  getPossessions: (type: string, building_id: string) => Promise<void>;
}

export const Possession: FC<IProps> = ({
  form_id,
  role,
  data,
  possessions,
  changeFormData,
  changeCarInfo,
  citizenPossessions,
  getPossessions,
}) => {
  const { error } = useTypedSelector((state) => state.CitizenReducer);
  return (
    <div className='flex flex-col gap-2 w-[48%]'>
      <span>Собственность</span>
      {role.role === 'citizen' && (
        <Select
          value={!data.possession.id ? undefined : data.possession.id}
          onChange={(e: number) => {
            if (citizenPossessions.filter((el) => el.possession.id === e)[0].possession.car)
              changeCarInfo(
                citizenPossessions.filter((el) => el.possession.id === e)[0].possession.car,
              );
            changeFormData((prev) => ({
              ...prev,
              possession: { ...prev.possession, id: e, address: '' },
              complex: {
                id: citizenPossessions.filter((el) => el.possession.id === e)[0].complex.id,
                name: citizenPossessions.filter((el) => el.possession.id === e)[0].complex.name,
              },
              building: {
                id: citizenPossessions.filter((el) => el.possession.id === e)[0].building.id,
                address: citizenPossessions.filter((el) => el.possession.id === e)[0].building
                  .address,
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
      {role.role === 'dispatcher' && (
        <>
          <Select
            value={!data.possession.id ? undefined : data.possession.id}
            onChange={(e: number) => {
              if (
                possessions &&
                possessions.some((el) => el.id === e) &&
                possessions.filter((el) => el.id === e)[0].car
              )
                changeCarInfo(possessions.filter((el) => el.id === e)[0].car);
              changeFormData((prev) => ({
                ...prev,
                possession: { ...prev.possession, id: e, address: '' },
              }));
            }}
            disabled={form_id !== 0 || data.building.id === 0 || error ? true : false}
            options={
              form_id !== 0
                ? [{ label: data.possession.address, value: data.possession.id }]
                : possessions
                ? possessions.map((el) => ({
                    value: el.id,
                    label: el.address,
                  }))
                : []
            }
          />
          {error && <span className='errorText'>{error.error.error}</span>}
        </>
      )}
      {role.role === 'executor' && (
        <Select
          value={!data.possession.id ? undefined : data.possession.id}
          disabled
          options={[{ label: data.possession.address, value: data.possession.id }]}
        />
      )}
    </div>
  );
};
