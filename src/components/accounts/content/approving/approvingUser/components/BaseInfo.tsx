import { Input } from 'antd';
import { FC } from 'react';
import { IUserDetailsInfo } from '../../../../../types';

export const BaseInfo: FC<{ data: IUserDetailsInfo | null }> = ({ data }) => {
  return (
    <div className='p-1'>
      <div className='mt-2 mb-2 text-sm'>
        <span className='font-bold'>Фамилия</span>
        <Input value={data ? data.last_name : ''} disabled />
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span className='font-bold'>Имя</span>
        <Input value={data ? data.first_name : ''} disabled />
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span className='font-bold'>Отчество</span>
        <Input value={data && data.patronymic ? data.patronymic : ''} disabled />
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span className='font-bold'>Номер телефона</span>
        <Input value={data && data.phone ? data.phone : ''} disabled />
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span className='font-bold'>Почта</span>
        <Input value={data ? data.email : ''} disabled />
      </div>
    </div>
  );
};
