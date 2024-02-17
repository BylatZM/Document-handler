import { FC } from 'react';
import { IApplication, IStatus } from '../../../../../types';
import { Select } from 'antd';

interface IProps {
  status: IStatus | null | undefined;
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
  statuses: IStatus[] | null;
}

export const Status: FC<IProps> = ({ status, changeFormData, statuses }) => {
  return (
    <div className='w-full md:w-[48%] gap-2 flex flex-col'>
      <span>Статус заявки</span>
      <Select
        value={!status ? undefined : status.id}
        onChange={(e: number) =>
          changeFormData((prev) => ({ ...prev, status: { id: e, appStatus: '' } }))
        }
        disabled
        options={
          !statuses
            ? []
            : statuses.map((el) => ({
                value: el.id,
                label: el.appStatus,
              }))
        }
      />
    </div>
  );
};
