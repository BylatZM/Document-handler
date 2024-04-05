import { FC } from 'react';
import { IApplication, IEmployee, IError, IRole } from '../../../../../../types';
import { Input, Select } from 'antd';
import { useActions } from '../../../../../../hooks/useActions';

interface IProps {
  role: IRole;
  form_id: number;
  data: IApplication;
  workers: IEmployee[];
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
  error: IError | null;
}

export const Employee: FC<IProps> = ({ role, data, workers, changeFormData, form_id, error }) => {
  const { applicationError } = useActions();
  return (
    <div className='flex flex-col gap-2 w-full'>
      <span>исполнитель</span>
      {role === 'executor' && (
        <Select
          className='h-[50px]'
          value={!data.employee.id ? undefined : data.employee.id}
          disabled
          options={[
            {
              label: data.employee.employee,
              value: data.employee.id,
            },
          ]}
        />
      )}
      {role === 'dispatcher' && (
        <>
          <Select
            className='h-[50px]'
            value={!data.employee.id ? undefined : data.employee.id}
            onChange={(e: number) => {
              if (error) applicationError(null);
              const new_worker = workers.filter((el) => el.id === e);
              if (!new_worker.length) return;
              changeFormData((prev) => ({
                ...prev,
                employee: { ...new_worker[0] },
              }));
            }}
            disabled={
              form_id > 0 &&
              data.status.appStatus !== 'Новая' &&
              data.status.appStatus !== 'Назначена' &&
              data.status.appStatus !== 'Возвращена'
                ? true
                : false
            }
            options={workers.map((el) => ({
              value: el.id,
              label: el.employee,
            }))}
          />
          {error && error.type === 'employee' && <span className='errorText'>{error.error}</span>}
        </>
      )}
      <span>специализация</span>
      <Input
        className='h-[50px] text-base'
        value={!data.employee ? undefined : data.employee.competence}
        disabled
      />
      <span>компания</span>
      <Input
        className='h-[50px] text-base'
        value={!data.employee ? undefined : data.employee.company}
        disabled
      />
    </div>
  );
};
