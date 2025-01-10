import { Input } from 'antd';
import { FC } from 'react';

export const Subtype: FC<{subtype_name: string;}> = ({
  subtype_name,
}) => {
  return (
    <div className='w-full md:w-[48%] gap-2 flex flex-col'>
      <span>Подтип заявки</span>
      <Input className='w-full h-[50px] text-base' disabled value={subtype_name} />
    </div>
  );
};
