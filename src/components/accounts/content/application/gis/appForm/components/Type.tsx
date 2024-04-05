import { Input } from 'antd';
import { FC } from 'react';

export const Type: FC<{ type: string }> = ({ type }) => {
  return (
    <div className='w-full md:w-[48%] gap-2 flex flex-col'>
      <span>Тип заявки</span>
      <Input disabled value={type} className='h-[50px] text-base' />
    </div>
  );
};
