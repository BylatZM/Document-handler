import { FC } from 'react';
import { IStatus } from '../../../../../../types';
import { Select } from 'antd';

interface IProps {
  status: IStatus;
}

export const Status: FC<IProps> = ({ status }) => {
  return (
    <div className='w-full md:w-[48%] gap-2 flex flex-col'>
      <span>Статус заявки</span>
      <Select
        className='h-[50px]'
        value={!status.id ? undefined : status.id}
        disabled
        options={[{ value: status.id, label: status.name }]}
      />
    </div>
  );
};
