import { Select } from 'antd';
import { FC } from 'react';
import { IApplication, IPriority, IRole } from '../../../../../types';

interface IProps {
  form_id: number;
  role: IRole;
  data: IApplication;
  priorities: IPriority[] | null;
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
}

export const Priority: FC<IProps> = ({ role, data, priorities, changeFormData, form_id }) => {
  return (
    <div className='w-[48%] mt-2 gap-2 flex flex-col'>
      <span>Приоритет исполнения</span>
      <Select
        value={!data.priority ? undefined : data.priority.id}
        disabled={
          ['executor', 'citizen'].some((el) => el === role.role) ||
          (data.status &&
            form_id > 0 &&
            data.status.appStatus !== 'Новая' &&
            data.status.appStatus !== 'Назначена' &&
            data.status.appStatus !== 'Возвращена')
            ? true
            : false
        }
        onChange={(e: number) =>
          changeFormData((prev) => ({ ...prev, priority: { id: e, appPriority: '' } }))
        }
        options={
          !priorities
            ? []
            : priorities.map((el) => ({
                value: el.id,
                label: el.appPriority,
              }))
        }
      />
    </div>
  );
};