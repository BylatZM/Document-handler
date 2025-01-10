import { FC } from 'react';
import { Input } from 'antd';

export const Building: FC<{ building_address: string }> = ({ building_address }) => {
  return (
    <div className='flex flex-col gap-2 w-full md:w-[48%]'>
      <span>Здание</span>
      <Input className='w-full h-[50px] text-base' disabled value={building_address} />
    </div>
  );
};
