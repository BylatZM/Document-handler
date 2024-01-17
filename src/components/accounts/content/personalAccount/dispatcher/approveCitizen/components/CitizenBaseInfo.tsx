import { Input } from 'antd';
import { FC } from 'react';
import { INotApproved } from '../../../../../../types';

export const CitizenBaseInfo: FC<{ citizenInfo: INotApproved | null }> = ({ citizenInfo }) => {
  return (
    <div>
      <div className='mt-2 mb-2 text-sm'>
        <span className='font-bold'>Фамилия</span>
        <Input value={citizenInfo ? citizenInfo.user.last_name : ''} disabled />
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span className='font-bold'>Имя</span>
        <Input value={citizenInfo ? citizenInfo.user.first_name : ''} disabled />
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span className='font-bold'>Отчество</span>
        <Input
          value={citizenInfo && citizenInfo.user.patronymic ? citizenInfo.user.patronymic : ''}
          disabled
        />
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span className='font-bold'>Номер телефона</span>
        <Input
          value={citizenInfo && citizenInfo.user.phone ? citizenInfo.user.phone : ''}
          disabled
        />
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span className='font-bold'>Почта</span>
        <Input value={citizenInfo ? citizenInfo.user.email : ''} disabled />
      </div>
    </div>
  );
};
