import { Select } from 'antd';
import { FC } from 'react';
import {
  IApplication,
  IBuilding,
  IBuildingWithComplex,
  ICitizen,
  IComplex,
  IError,
  IPossession,
  IRole,
} from '../../../../../../types';
import { useActions } from '../../../../../../hooks/useActions';
import { defaultAppForm } from '../defaultAppForm';

interface IProps {
  form_id: number;
  role: IRole;
  data: IApplication;
  complexes: IComplex[];
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
  citizenPossessions: ICitizen[];
  getBuildings: (complex_id: string) => Promise<void | IBuildingWithComplex[]>;
  buildings: IBuilding[];
  possessions: IPossession[];
  error: IError | null;
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
}) => {
  const { possessionSuccess, buildingSuccess, applicationError } = useActions();

  return (
    <div className='flex flex-col gap-2 w-full md:w-[48%]'>
      <span>Жилой комплекс</span>
      {role === 'citizen' && (
        <Select
          className='h-[50px]'
          value={!data.complex.id ? undefined : data.complex.id}
          onChange={(e) => {
            const new_possession = citizenPossessions.filter((el) => el.complex.id === e);
            if (!new_possession.length) return;
            changeFormData((prev) => ({
              ...prev,
              complex: { ...new_possession[0].complex },
              building: { ...new_possession[0].building },
              possession: { ...new_possession[0].possession },
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
                  .filter((el) => el.approving_status === 'Подтверждена')
                  .map((el) => ({
                    value: el.complex.id,
                    label: el.complex.name,
                  }))
          }
        />
      )}
      {role === 'dispatcher' && complexes.length && (
        <Select
          className='h-[50px]'
          value={!data.complex.id ? undefined : data.complex.id}
          onChange={(e: number) => {
            if (possessions.length) possessionSuccess([]);
            if (buildings.length) buildingSuccess([]);
            if (error) applicationError(null);
            getBuildings(e.toString());
            const new_complex = complexes.filter((el) => el.id === e);
            if (!new_complex.length) return;
            changeFormData((prev) => ({
              ...prev,
              complex: { ...new_complex[0] },
              building: { ...defaultAppForm.building },
              possession: { ...defaultAppForm.possession },
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
          className='h-[50px]'
          value={!data.complex.id ? undefined : data.complex.id}
          disabled
          options={[{ label: data.complex.name, value: data.complex.id }]}
        />
      )}
    </div>
  );
};
