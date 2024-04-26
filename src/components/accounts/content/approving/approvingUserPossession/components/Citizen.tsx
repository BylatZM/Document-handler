import { Input } from 'antd';
import { FC } from 'react';
import { INotApprovedCitizenPossession } from '../../../../../types';

export const Citizen: FC<{ selectedCitizenPossession: INotApprovedCitizenPossession | null }> = ({
  selectedCitizenPossession,
}) => {
  return (
    <div className='p-1 disable'>
      <div className='mt-2 mb-2 text-sm'>
        <span className='font-bold'>Фамилия</span>
        <Input
          className='text-base'
          value={selectedCitizenPossession ? selectedCitizenPossession.last_name : ''}
          disabled
        />
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span className='font-bold'>Имя</span>
        <Input
          className='text-base'
          value={selectedCitizenPossession ? selectedCitizenPossession.first_name : ''}
          disabled
        />
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span className='font-bold'>Отчество</span>
        <Input
          className='text-base'
          value={
            selectedCitizenPossession && selectedCitizenPossession.patronymic
              ? selectedCitizenPossession.patronymic
              : ''
          }
          disabled
        />
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span className='font-bold'>Номер телефона</span>
        <Input
          className='text-base'
          value={
            selectedCitizenPossession && selectedCitizenPossession.phone
              ? selectedCitizenPossession.phone
              : ''
          }
          disabled
        />
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span className='font-bold'>Почта</span>
        <Input
          className='text-base'
          value={selectedCitizenPossession ? selectedCitizenPossession.email : ''}
          disabled
        />
      </div>
    </div>
  );
};
