import { Input } from 'antd';
import { FC } from 'react';

interface IProps {
  type_name: string;
}

export const Type: FC<IProps> = ({
  type_name,
}) => {

  return (
    <div className='w-full md:w-[48%] gap-2 flex flex-col'>
      <span>Тип заявки</span>
      <Input className='w-full h-[50px] text-base' disabled value={type_name} />
    </div>
  );
};
