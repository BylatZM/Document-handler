import { FC } from 'react';
import { Input, Popover } from 'antd';
import { ICitizenPossession } from '../../../../../../types';

interface IProps {
  data: ICitizenPossession;
}

export const CreatedDate: FC<IProps> = ({ data }) => {
  return (
    <div className='mt-2 mb-2 text-sm'>
      <span>Дата изменения записи</span>
      <Popover content='Поле не заполняется пользователем'>
        <Input
          className='max-sm:h-[30px] h-[40px]'
          value={data.created_date}
          maxLength={15}
          disabled
        />
      </Popover>
    </div>
  );
};
