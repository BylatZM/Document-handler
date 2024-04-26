import { Input } from 'antd';
import { INotApprovedCitizenPossession } from '../../../../../types';
import { FC } from 'react';

interface IProps {
  selectedCitizenPossession: INotApprovedCitizenPossession | null;
}

export const Possession: FC<IProps> = ({ selectedCitizenPossession }) => {
  return (
    <div className='p-1 disable'>
      <div className='mt-2 mb-2 max-sm:text-xs text-sm'>
        <span className='font-bold'>Лицевой счет</span>
        <Input
          className='text-base'
          value={!selectedCitizenPossession ? '' : selectedCitizenPossession.personal_account}
          disabled
        />
      </div>
      <div className='mt-2 mb-2 max-sm:text-xs text-sm'>
        <span className='font-bold'>Тип имущества</span>
        <Input
          disabled
          className='text-base'
          value={!selectedCitizenPossession ? '' : selectedCitizenPossession.possession_type}
        />
      </div>
      <div className='mt-2 mb-2 max-sm:text-xs text-sm'>
        <span className='font-bold'>Статус собственника</span>
        <Input
          disabled
          className='text-base'
          value={!selectedCitizenPossession ? '' : selectedCitizenPossession.ownership_status}
        />
      </div>
      <div className='mt-2 mb-2 max-sm:text-xs text-sm'>
        <span className='font-bold'>Название жилого комплекса</span>
        <Input
          disabled
          className='text-base'
          value={!selectedCitizenPossession ? '' : selectedCitizenPossession.complex}
        />
      </div>
      <div className='mt-2 mb-2 max-sm:text-xs text-sm'>
        <span className='font-bold'>Адрес здания</span>
        <Input
          disabled
          className='text-base'
          value={!selectedCitizenPossession ? '' : selectedCitizenPossession.building}
        />
      </div>
      <div className='mt-2 mb-2 max-sm:text-xs text-sm'>
        <span className='font-bold'>Номер собственности</span>
        <Input
          disabled
          className='text-base'
          value={!selectedCitizenPossession ? '' : selectedCitizenPossession.possession}
        />
      </div>
    </div>
  );
};
