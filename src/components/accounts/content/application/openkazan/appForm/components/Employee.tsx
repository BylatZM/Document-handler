import { FC } from 'react';
import { Input } from 'antd';

export const Employee: FC<{employee_name: string | null;}> = ({ employee_name }) => {
  return (
    <div className='flex flex-col gap-2 w-full'>
      <span>исполнитель</span>
      <Input className='w-full h-[50px] text-base' disabled value={employee_name ?? ''} />
    </div>
  );
};
