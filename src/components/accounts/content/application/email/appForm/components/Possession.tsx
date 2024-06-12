import { Input } from 'antd';
import { FC } from 'react';

export const Possession: FC<{ possession: string }> = ({ possession }) => {
  return (
    <div className='w-full md:w-[48%] flex flex-col gap-2'>
      <span>Собственность</span>
      <Input className='w-full h-[50px] text-base' disabled value={possession} />
    </div>
  );
};
