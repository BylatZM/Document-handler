import { Select } from 'antd';
import { FC } from 'react';
import { IEmailApplication, IPriority } from '../../../../../../types';

interface IProps {
  role: string;
  data: IEmailApplication;
  priorities: IPriority[];
  changeFormData: React.Dispatch<React.SetStateAction<IEmailApplication>>;
}

export const Priority: FC<IProps> = ({ role, data, priorities, changeFormData }) => {
  return (
    <div className='w-full md:w-[48%] mt-2 gap-2 flex flex-col'>
      <span>Приоритет исполнения</span>
      {role === 'executor' && (
        <Select
          className='h-[50px]'
          value={!data.priority ? undefined : data.priority.id}
          disabled
          options={[{ value: data.priority.id, label: data.priority.name }]}
        />
      )}
      {role === 'dispatcher' && (
        <Select
          className='h-[50px]'
          value={!data.priority ? undefined : data.priority.id}
          disabled={
            data.status.name !== 'Новая' &&
            data.status.name !== 'Назначена' &&
            data.status.name !== 'Возвращена'
              ? true
              : false
          }
          onChange={(e: number) =>
            changeFormData((prev) => ({ ...prev, priority: { id: e, name: '' } }))
          }
          options={priorities.map((el) => ({
            value: el.id,
            label: el.name,
          }))}
        />
      )}
    </div>
  );
};
