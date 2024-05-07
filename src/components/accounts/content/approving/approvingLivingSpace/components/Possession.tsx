import { Input } from 'antd';
import { INotApprovedPossession } from '../../../../../types';
import { FC } from 'react';

interface IProps {
  selectedPossession: INotApprovedPossession | null;
}

export const Possession: FC<IProps> = ({ selectedPossession }) => {
  return (
    <div className='p-1 disable'>
      <div className='mb-2 max-sm:text-xs text-sm'>
        <span className='font-bold'>Лицевой счет</span>
        <Input
          disabled
          className='text-base'
          value={
            !selectedPossession?.personal_account ? 'Не задан' : selectedPossession.personal_account
          }
        />
      </div>
      <div className='mb-2 max-sm:text-xs text-sm'>
        <span className='font-bold'>Пользователь, добавивший запись</span>
        <Input
          disabled
          className='text-base h-auto'
          value={!selectedPossession?.who_created ? 'Не задан' : selectedPossession.who_created}
        />
      </div>
      <div className='mb-2 max-sm:text-xs text-sm'>
        <span className='font-bold'>Тип собственности</span>
        <Input
          disabled
          className='text-base'
          value={!selectedPossession ? '' : selectedPossession.type}
        />
      </div>
      <div className='mt-2 mb-2 max-sm:text-xs text-sm'>
        <span className='font-bold'>Статус</span>
        <Input
          className='text-base'
          value={!selectedPossession ? '' : selectedPossession.approving_status}
          disabled
        />
      </div>
      <div className='mt-2 mb-2 max-sm:text-xs text-sm'>
        <span className='font-bold'>Название жилого комплекса</span>
        <Input
          className='text-base'
          disabled
          value={!selectedPossession ? '' : selectedPossession.complex}
        />
      </div>
      <div className='mt-2 mb-2 max-sm:text-xs text-sm'>
        <span className='font-bold'>Адрес здания</span>
        <Input
          className='text-base'
          disabled
          value={!selectedPossession ? '' : selectedPossession.building}
        />
      </div>
      <div className='mt-2 mb-2 max-sm:text-xs text-sm'>
        <span className='font-bold'>Номер собственности</span>
        <Input
          className='text-base'
          disabled
          value={!selectedPossession ? '' : selectedPossession.name}
        />
      </div>
    </div>
  );
};
