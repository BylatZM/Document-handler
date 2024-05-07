import { Select } from 'antd';
import { FC } from 'react';
import { IApplication, IPriority } from '../../../../../../types';

interface IProps {
  form_id: number;
  role: string;
  data: IApplication;
  priorities: IPriority[];
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
}

export const Priority: FC<IProps> = ({ role, data, priorities, changeFormData, form_id }) => {
  return (
    <>
      {role !== 'citizen' && (
        <div className='w-full md:w-[48%] mt-2 gap-2 flex flex-col'>
          <span>Приоритет исполнения</span>
          {role === 'dispatcher' && (
            <Select
              className='h-[50px]'
              value={!data.priority.id ? undefined : data.priority.id}
              disabled={
                form_id > 0 &&
                data.status.name !== 'Новая' &&
                data.status.name !== 'Назначена' &&
                data.status.name !== 'Возвращена'
                  ? true
                  : false
              }
              onChange={(e: number) => {
                const newPriority = priorities.filter((el) => el.id === e);
                if (!newPriority.length) return;
                changeFormData((prev) => ({ ...prev, priority: { ...newPriority[0] } }));
              }}
              options={priorities.map((el) => ({
                value: el.id,
                label: el.name,
              }))}
            />
          )}
          {role === 'executor' && (
            <Select
              className='h-[50px]'
              value={!data.priority.id ? undefined : data.priority.id}
              disabled
              options={[{ value: data.priority.id, label: data.priority.name }]}
            />
          )}
        </div>
      )}
    </>
  );
};
