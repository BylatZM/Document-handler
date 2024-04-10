import { Input } from 'antd';
import { FC } from 'react';
import { IUserDetailsInfo } from '../../../../../types';

export const BaseInfo: FC<{ data: IUserDetailsInfo | null }> = ({ data }) => {
  return (
    <div className='p-1 disable'>
      <div className='mt-2 mb-2 text-sm'>
        <span className='font-bold'>Фамилия</span>
        <Input className='text-base' value={data ? data.last_name : ''} disabled />
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span className='font-bold'>Имя</span>
        <Input className='text-base' value={data ? data.first_name : ''} disabled />
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span className='font-bold'>Отчество</span>
        <Input
          className='text-base'
          value={data && data.patronymic ? data.patronymic : ''}
          disabled
        />
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span className='font-bold'>Номер телефона</span>
        <Input className='text-base' value={data && data.phone ? data.phone : ''} disabled />
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span className='font-bold'>Почта</span>
        <Input className='text-base' value={data ? data.email : ''} disabled />
      </div>
    </div>
  );
};
