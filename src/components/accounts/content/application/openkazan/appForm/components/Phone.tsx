import { FC } from 'react';
import { Input } from 'antd';

export const Phone: FC<{ phone: string | null }> = ({ phone }) => {
  return (
    <>
      <div className='w-full md:w-[48%] gap-2 flex flex-col'>
        <span>Номер телефона заявителя</span>
        <Input
          className='w-full h-[50px] text-base'
          placeholder='+79372833608'
          value={!phone ? undefined : phone}
          disabled
        />
      </div>
    </>
  );
};
