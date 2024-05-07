import { FC } from 'react';
import { IEmployee, IGisApplication } from '../../../../../../types';
import { Select } from 'antd';

interface IProps {
  role: string;
  data: IGisApplication;
  workers: IEmployee[];
  changeFormData: React.Dispatch<React.SetStateAction<IGisApplication>>;
}

export const Employee: FC<IProps> = ({ role, data, workers, changeFormData }) => {
  return (
    <div className='flex flex-col gap-2 w-full'>
      <span>исполнитель</span>
      {role === 'executor' && (
        <Select
          className='h-[50px]'
          value={!data.employee ? undefined : data.employee.id}
          disabled
          options={[
            data.employee
              ? {
                  label: data.employee.employee,
                  value: data.employee.id,
                }
              : [],
          ]}
        />
      )}
      {role === 'dispatcher' && workers.length && (
        <Select
          className='h-[50px]'
          value={!data.employee ? undefined : data.employee.id}
          onChange={(e: number) => {
            changeFormData((prev) => ({
              ...prev,
              employee: workers.filter((el) => el.id === e)[0],
            }));
          }}
          disabled={
            data.status.name !== 'Новая' &&
            data.status.name !== 'Назначена' &&
            data.status.name !== 'Возвращена'
              ? true
              : false
          }
          options={workers.map((el) => ({
            value: el.id,
            label: el.employee,
          }))}
        />
      )}
    </div>
  );
};
