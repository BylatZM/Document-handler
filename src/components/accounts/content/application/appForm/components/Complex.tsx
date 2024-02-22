import { Select } from 'antd';
import { FC } from 'react';
import { IApplication, ICitizen, IComplex, IError, IPossession, IRole } from '../../../../../types';
import { useActions } from '../../../../../hooks/useActions';

interface IProps {
  form_id: number;
  role: IRole;
  data: IApplication;
  complexes: IComplex[];
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
  citizenPossessions: ICitizen[];
  getBuildings: (complex_id: string) => Promise<void>;
  buildings: IPossession[];
  possessions: IPossession[];
  error: IError | null;
  changeError: React.Dispatch<React.SetStateAction<IError | null>>;
}

export const Complex: FC<IProps> = ({
  form_id,
  role,
  data,
  complexes,
  changeFormData,
  citizenPossessions,
  getBuildings,
  buildings,
  possessions,
  error,
  changeError,
}) => {
  const { possessionSuccess, buildingSuccess } = useActions();
  return (
    <div className='flex flex-col gap-2 w-[48%]'>
      <span>Жилой комплекс</span>
      {role === 'citizen' && (
        <Select
          value={!data.complex.id ? undefined : data.complex.id}
          onChange={(e: number) => {
            changeFormData((prev) => ({
              ...prev,
              complex: { id: e, name: '' },
              building: {
                id: citizenPossessions.filter((el) => el.complex.id === e)[0].building.id,
                address: citizenPossessions.filter((el) => el.complex.id === e)[0].building.address,
              },
              possession: {
                ...prev.possession,
                id: citizenPossessions.filter((el) => el.complex.id === e)[0].possession.id,
                address: citizenPossessions.filter((el) => el.complex.id === e)[0].possession
                  .address,
              },
            }));
          }}
          disabled={form_id !== 0 ? true : false}
          options={
            form_id !== 0
              ? [{ value: data.complex.id, label: data.complex.name }]
              : citizenPossessions
                  .filter((el, index, array) => {
                    const prevIndex = array.findIndex((prevItem, prevIndex) => {
                      return prevIndex < index && prevItem.complex.id === el.complex.id;
                    });

                    return prevIndex === -1;
                  })
                  .map((el) => ({
                    value: el.complex.id,
                    label: el.complex.name,
                  }))
          }
        />
      )}
      {role === 'dispatcher' && complexes.length && (
        <Select
          value={!data.complex.id ? undefined : data.complex.id}
          onChange={(e: number) => {
            if (possessions.length) possessionSuccess([]);
            if (buildings.length) buildingSuccess([]);
            if (error) changeError(null);
            getBuildings(e.toString());
            changeFormData((prev) => ({
              ...prev,
              complex: { id: e, name: '' },
              building: { id: 0, address: '' },
              possession: { id: 0, address: '', type: 'квартира' },
            }));
          }}
          disabled={form_id !== 0 ? true : false}
          options={
            form_id !== 0
              ? [{ label: data.complex.name, value: data.complex.id }]
              : complexes.map((el) => ({
                  label: el.name,
                  value: el.id,
                }))
          }
        />
      )}
      {role === 'executor' && (
        <Select
          value={!data.complex.id ? undefined : data.complex.id}
          disabled
          options={[{ label: data.complex.name, value: data.complex.id }]}
        />
      )}
    </div>
  );
};
