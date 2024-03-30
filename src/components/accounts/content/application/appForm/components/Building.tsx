import { FC } from 'react';
import { useActions } from '../../../../../hooks/useActions';
import { Select } from 'antd';
import {
  IApplication,
  IBuilding,
  ICitizen,
  IError,
  IPossession,
  IRole,
} from '../../../../../types';

interface IProps {
  form_id: number;
  role: IRole;
  data: IApplication;
  buildings: IBuilding[];
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
  citizenPossessions: ICitizen[];
  getPossessions: (type: string, building_id: string) => Promise<void | IError | IPossession[]>;
  error: IError | null;
  possessions: IPossession[];
}

export const Building: FC<IProps> = ({
  form_id,
  role,
  data,
  buildings,
  changeFormData,
  citizenPossessions,
  getPossessions,
  error,
  possessions,
}) => {
  const { possessionSuccess, applicationError } = useActions();

  return (
    <div className='flex flex-col gap-2 w-full md:w-[48%]'>
      <span>Здание</span>
      {role === 'citizen' && (
        <Select
          className='h-[50px]'
          value={!data.building.id ? undefined : data.building.id}
          onChange={(e: number) => {
            const new_possession = citizenPossessions.filter((el) => el.building.id === e);
            if (!new_possession.length) return;
            changeFormData((prev) => ({
              ...prev,
              building: { id: e, building: '' },
              complex: {
                id: new_possession[0].complex.id,
                name: new_possession[0].complex.name,
              },
              possession: {
                id: new_possession[0].possession.id,
                address: new_possession[0].possession.address,
                building: new_possession[0].possession.building,
                type: new_possession[0].possession.type,
              },
            }));
          }}
          disabled={form_id !== 0 ? true : false}
          options={
            form_id !== 0
              ? [{ label: data.building.building, value: data.building.id }]
              : citizenPossessions
                  .filter((el, index, array) => {
                    const prevIndex = array.findIndex((prevItem, prevIndex) => {
                      return prevIndex < index && prevItem.building.id === el.building.id;
                    });

                    return prevIndex === -1;
                  })
                  .filter((el) => el.approving_status === 'Подтверждена')
                  .map((el) => ({
                    value: el.building.id,
                    label: el.building.building,
                  }))
          }
        />
      )}
      {role === 'dispatcher' && (
        <Select
          className='h-[50px]'
          value={!data.building.id ? undefined : data.building.id}
          onChange={(e: number) => {
            if (possessions.length) possessionSuccess([]);
            if (error) applicationError(null);
            getPossessions(data.possessionType, e.toString());
            changeFormData((prev) => ({
              ...prev,
              building: { id: e, building: '' },
              possession: {
                id: 0,
                address: '',
                type: '',
                building: '',
              },
            }));
          }}
          disabled={form_id !== 0 || data.complex.id === 0 ? true : false}
          options={
            form_id !== 0
              ? [{ label: data.building.building, value: data.building.id }]
              : buildings.length
              ? buildings.map((el) => ({
                  value: el.id,
                  label: el.building,
                }))
              : []
          }
        />
      )}
      {role === 'executor' && (
        <Select
          className='h-[50px]'
          value={!data.building.id ? undefined : data.building.id}
          disabled
          options={[{ label: data.building.building, value: data.building.id }]}
        />
      )}
    </div>
  );
};
