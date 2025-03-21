import { FC } from 'react';
import { IOpenKazanApplication } from '../../../../../../types';
import { Select } from 'antd';

interface IProps {
  data: IOpenKazanApplication;
}

export const Employee: FC<IProps> = ({ data }) => {
  return (
    <div className='flex flex-col gap-2 w-full'>
      <span>исполнитель</span>
        <Select
          className='h-[50px]'
          value={!data.employee ? undefined : data.employee.id}
          disabled
          options={[
            data.employee
              ? {
                  label: data.employee.employee,
                  value: data.employee.id,
                }
              : [],
          ]}
        />
    </div>
  );
};
