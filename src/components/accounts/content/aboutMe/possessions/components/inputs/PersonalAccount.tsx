import { FC } from 'react';
import { Input, Popover } from 'antd';
import { ICitizenPossession } from '../../../../../../types';

interface IProps {
  data: ICitizenPossession;
}

export const PersonalAccount: FC<IProps> = ({ data }) => {
  return (
    <div className='mt-2 mb-2 text-sm'>
      <span>Лицевой счет</span>
      <Popover content='Поле не заполняется пользователем'>
        <Input
          value={!data.possession.personal_account ? 'Не задан' : data.possession.personal_account}
          className='max-sm:h-[30px] h-[40px]'
          maxLength={15}
          disabled
        />
      </Popover>
    </div>
  );
};
