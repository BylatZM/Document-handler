import { FC } from 'react';
import { useActions } from '../../../../../hooks/useActions';
import { Select } from 'antd';
import { IApplication, IBuilding, ICar, ICitizen, IRole } from '../../../../../types';

interface IProps {
  form_id: number;
  role: IRole;
  data: IApplication;
  buildings: IBuilding[] | null;
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
  changeCarInfo: React.Dispatch<React.SetStateAction<ICar | null>>;
  citizenPossessions: ICitizen[];
  getPossessions: (type: string, building_id: string) => Promise<void>;
}

export const Building: FC<IProps> = ({
  form_id,
  role,
  data,
  buildings,
  changeFormData,
  changeCarInfo,
  citizenPossessions,
  getPossessions,
}) => {
  const { possessionSuccess, citizenErrors } = useActions();

  return (
    <div className='flex flex-col gap-2 w-[48%]'>
      <span>Здание</span>
      {role.role === 'citizen' && (
        <Select
          value={!data.building.id ? undefined : data.building.id}
          onChange={(e: number) => {
            changeCarInfo(null);
            if (
              citizenPossessions.filter(
                (el) =>
                  el.possession.id ===
                  citizenPossessions.filter((el) => el.building.id === e)[0].possession.id,
              )[0].possession.car
            )
              changeCarInfo(
                citizenPossessions.filter(
                  (el) =>
                    el.possession.id ===
                    citizenPossessions.filter((el) => el.building.id === e)[0].possession.id,
                )[0].possession.car,
              );
            changeFormData((prev) => ({
              ...prev,
              building: { id: e, address: '' },
              complex: {
                id: citizenPossessions.filter((el) => el.building.id === e)[0].complex.id,
                name: citizenPossessions.filter((el) => el.building.id === e)[0].complex.name,
              },
              possession: {
                ...prev.possession,
                id: citizenPossessions.filter((el) => el.building.id === e)[0].possession.id,
                address: citizenPossessions.filter((el) => el.building.id === e)[0].possession
                  .address,
              },
            }));
          }}
          disabled={form_id !== 0 ? true : false}
          options={
            form_id !== 0
              ? [{ label: data.building.address, value: data.building.id }]
              : citizenPossessions
                  .filter((el, index, array) => {
                    const prevIndex = array.findIndex((prevItem, prevIndex) => {
                      return prevIndex < index && prevItem.building.id === el.building.id;
                    });

                    return prevIndex === -1;
                  })
                  .map((el) => ({
                    value: el.building.id,
                    label: el.building.address,
                  }))
          }
        />
      )}
      {role.role === 'dispatcher' && (
        <Select
          value={!data.building.id ? undefined : data.building.id}
          onChange={(e: number) => {
            possessionSuccess([]);
            changeCarInfo(null);
            citizenErrors(null);
            getPossessions(data.possessionType, e.toString());
            changeFormData((prev) => ({
              ...prev,
              building: { id: e, address: '' },
              possession: {
                id: 0,
                address: '',
                car: null,
              },
            }));
          }}
          disabled={form_id !== 0 || data.complex.id === 0 ? true : false}
          options={
            form_id !== 0
              ? [{ label: data.building.address, value: data.building.id }]
              : buildings
              ? buildings.map((el) => ({
                  value: el.id,
                  label: el.address,
                }))
              : []
          }
        />
      )}
      {role.role === 'executor' && (
        <Select
          value={!data.building.id ? undefined : data.building.id}
          disabled
          options={[{ label: data.building.address, value: data.building.id }]}
        />
      )}
    </div>
  );
};
