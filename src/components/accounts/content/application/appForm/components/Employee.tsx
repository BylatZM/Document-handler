import { FC } from 'react';
import { IApplication, IEmployee, IRole } from '../../../../../types';
import { Input, Select } from 'antd';

interface IProps {
  role: IRole;
  form_id: number;
  data: IApplication;
  workers: IEmployee[];
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
}

export const Employee: FC<IProps> = ({ role, data, workers, changeFormData, form_id }) => {
  return (
    <div className='flex flex-col gap-2 w-full'>
      <span>исполнитель</span>
      {['executor'].some((el) => el === role) && (
        <Select
          value={!data.employee ? undefined : data.employee.id}
          disabled
          options={[
            data.employee
              ? {
                  label:
                    data.employee.user.last_name +
                    ' ' +
                    data.employee.user.first_name +
                    ' ' +
                    data.employee.user.patronymic,
                  value: data.employee.id,
                }
              : [],
          ]}
        />
      )}
      {role === 'dispatcher' && workers.length && (
        <Select
          value={!data.employee ? undefined : data.employee.id}
          onChange={(e: number) =>
            changeFormData((prev) => ({
              ...prev,
              employee: workers.filter((el) => el.id === e)[0],
            }))
          }
          disabled={
            data.status &&
            form_id > 0 &&
            data.status.appStatus !== 'Новая' &&
            data.status.appStatus !== 'Назначена' &&
            data.status.appStatus !== 'Возвращена'
              ? true
              : false
          }
          options={
            !workers
              ? []
              : workers.map((el) => ({
                  value: el.id,
                  label: el.user.last_name + ' ' + el.user.first_name + ' ' + el.user.patronymic,
                }))
          }
        />
      )}
      <span>специализация</span>
      <Input value={!data.employee ? undefined : data.employee.competence.competence} disabled />
    </div>
  );
};
