import { Select } from 'antd';
import { FC } from 'react';
import {
  IApplication,
  IBuildingWithComplex,
  ICitizenPossession,
  IComplex,
  IError,
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
  citizenPossessions: ICitizenPossession[];
  getBuildings: (complex_id: string) => Promise<void | IBuildingWithComplex[]>;
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
  error,
}) => {
  const { applicationError } = useActions();

  return (
    <div className='flex flex-col gap-2 w-full md:w-[48%]'>
      <span>Жилой комплекс</span>
      {role === 'citizen' && (
        <Select
          className='h-[50px]'
          value={!data.complex.id ? undefined : data.complex.id}
          onChange={(e) => {
            const newPossession = citizenPossessions.filter((el) => el.complex.id === e);
            if (!newPossession.length) return;
            changeFormData((prev) => ({
              ...prev,
              complex: { ...newPossession[0].complex },
              building: { ...newPossession[0].building },
              possession: { ...newPossession[0].possession },
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
      {role === 'dispatcher' && (
        <Select
          className='h-[50px]'
          value={!data.complex.id ? undefined : data.complex.id}
          onChange={(e: number) => {
            if (error) applicationError(null);
            const newComplex = complexes.filter((el) => el.id === e);
            if (!newComplex.length) return;
            getBuildings(e.toString());
            changeFormData((prev) => ({
              ...prev,
              complex: { ...newComplex[0] },
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
