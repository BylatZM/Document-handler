import { FC } from 'react';
import { IApplication, IEmployee, IError } from '../../../../../../types';
import { Select } from 'antd';
import { useActions } from '../../../../../../hooks/useActions';
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector';

interface IProps {
  role: string;
  form_id: number;
  data: IApplication;
  workers: IEmployee[];
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
  error: IError | null;
}

export const Employee: FC<IProps> = ({ role, data, workers, changeFormData, form_id, error }) => {
  const { isLoading } = useTypedSelector((state) => state.ApplicationReducer);
  const { applicationError } = useActions();
  return (
    <div className='flex flex-col gap-2 w-full'>
      <span>исполнитель</span>
      {role === 'executor' && (
        <Select
          className='h-[50px]'
          value={!data.employee?.id ? undefined : data.employee.id}
          disabled
          options={
            data.employee
              ? [
                  {
                    label: data.employee.employee,
                    value: data.employee.id,
                  },
                ]
              : []
          }
        />
      )}
      {role === 'dispatcher' && (
        <>
          <Select
            className='h-[50px]'
            value={!data.employee?.id ? undefined : data.employee.id}
            loading={isLoading === 'employs' ? true : false}
            onChange={(e: number) => {
              if (error) applicationError(null);
              const newExecutor = workers.filter((el) => el.id === e);
              if (!newExecutor.length) return;
              changeFormData((prev) => ({
                ...prev,
                employee: { ...newExecutor[0] },
              }));
            }}
            disabled={
              (form_id > 0 &&
                data.status.name !== 'Новая' &&
                data.status.name !== 'Назначена' &&
                data.status.name !== 'Возвращена') ||
              !workers.length
                ? true
                : false
            }
            status={error && error.type === 'employee' ? 'error' : undefined}
            options={
              data.status.name === 'Закрыта' && data.employee
                ? [{ value: data.employee.id, label: data.employee.employee }]
                : workers.map((el) => ({
                    value: el.id,
                    label: el.employee,
                  }))
            }
          />
          {error && error.type === 'employee' && <span className='errorText'>{error.error}</span>}
        </>
      )}
    </div>
  );
};
