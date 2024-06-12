import { FC } from 'react';
import { Input } from 'antd';

export const Email: FC<{ email: string }> = ({ email }) => {
  return (
    <>
      <div className='w-full md:w-[48%] gap-2 flex flex-col'>
        <span>Адрес электронной почты</span>
        <Input className='w-full h-[50px] text-base' value={email} disabled />
      </div>
    </>
  );
};
