import { Input } from 'antd';
import { FC } from 'react';

export const Possession: FC<{ possession: string | null }> = ({ possession }) => {
  return (
    <div className='flex flex-col gap-2 w-full md:w-[48%]'>
      <span>Собственность</span>
      <Input
        className='w-full h-[50px] text-base'
        disabled
        value={!possession ? undefined : possession}
      />
    </div>
  );
};
