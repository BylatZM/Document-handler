import { Select } from 'antd';
import { FC } from 'react';
import { IGisApplication, IPriority, IRole } from '../../../../../../types';

interface IProps {
  role: IRole;
  data: IGisApplication;
  priorities: IPriority[];
  changeFormData: React.Dispatch<React.SetStateAction<IGisApplication>>;
}

export const Priority: FC<IProps> = ({ role, data, priorities, changeFormData }) => {
  return (
    <div className='w-full md:w-[48%] mt-2 gap-2 flex flex-col'>
      <span>Приоритет исполнения</span>
      <Select
        className='h-[50px]'
        value={!data.priority ? undefined : data.priority.id}
        disabled={
          role === 'executor' ||
          (data.status.appStatus !== 'Новая' &&
            data.status.appStatus !== 'Назначена' &&
            data.status.appStatus !== 'Возвращена')
            ? true
            : false
        }
        onChange={(e: number) =>
          changeFormData((prev) => ({ ...prev, priority: { id: e, appPriority: '' } }))
        }
        options={priorities.map((el) => ({
          value: el.id,
          label: el.appPriority,
        }))}
      />
    </div>
  );
};
