import { FC } from 'react';
import { IEmailApplication, IEmployee } from '../../../../../../types';
import { Select } from 'antd';

interface IProps {
  role: string;
  data: IEmailApplication;
  workers: IEmployee[];
  changeFormData: React.Dispatch<React.SetStateAction<IEmailApplication>>;
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
      {role === 'dispatcher' && (
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
            !workers.length ||
            (data.status.name !== 'Новая' &&
              data.status.name !== 'Назначена' &&
              data.status.name !== 'Возвращена')
              ? true
              : false
          }
          options={
            ['Закрыта', 'В работе', 'Заведена неверно'].some((el) => el === data.status.name) &&
            data.employee
              ? [{ value: data.employee.id, label: data.employee.employee }]
              : workers.map((el) => ({
                  value: el.id,
                  label: el.employee,
                }))
          }
        />
      )}
    </div>
  );
};
