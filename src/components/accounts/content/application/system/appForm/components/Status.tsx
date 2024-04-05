import { FC } from 'react';
import { IApplication, IStatus } from '../../../../../../types';
import { Select } from 'antd';

interface IProps {
  status: IStatus;
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
  statuses: IStatus[];
}

export const Status: FC<IProps> = ({ status, changeFormData, statuses }) => {
  return (
    <div className='w-full md:w-[48%] gap-2 flex flex-col'>
      <span>Статус заявки</span>
      <Select
        className='h-[50px]'
        value={!status.id ? undefined : status.id}
        onChange={(e: number) => {
          const new_status = statuses.filter((el) => el.id === e);
          if (!new_status.length) return;
          changeFormData((prev) => ({ ...prev, status: { ...new_status[0] } }));
        }}
        disabled
        options={statuses.map((el) => ({
          value: el.id,
          label: el.appStatus,
        }))}
      />
    </div>
  );
};
