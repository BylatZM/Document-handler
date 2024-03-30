import { Input, Select } from 'antd';
import { IUserDetailsInfo } from '../../../../../types';
import { FC } from 'react';

interface IProps {
  selectedUserInfo: IUserDetailsInfo | null;
}

export const Possessions: FC<IProps> = ({ selectedUserInfo }) => {
  return (
    <>
      {selectedUserInfo &&
        selectedUserInfo.possessions.map((el) => {
          return (
            <div key={el.id} className='p-1'>
              <div className='mt-2 mb-2 max-sm:text-xs text-sm'>
                <span className='font-bold'>Лицевой счет</span>
                <Input value={el.personal_account} disabled />
              </div>
              <div className='mt-2 mb-2 max-sm:text-xs text-sm'>
                <span className='font-bold'>Тип имущества</span>
                <Select
                  className='w-full'
                  options={[
                    { label: 'квартира', value: 1 },
                    { label: 'офис', value: 2 },
                    { label: 'кладовка', value: 4 },
                    { label: 'парковка', value: 3 },
                  ]}
                  value={parseInt(el.possessionType)}
                  disabled
                />
              </div>
              <div className='mt-2 mb-2 max-sm:text-xs text-sm'>
                <span className='font-bold'>Статус собственника</span>
                <Select
                  className='w-full'
                  options={[
                    { label: 'арендатор', value: 1 },
                    { label: 'владелец', value: 2 },
                  ]}
                  disabled
                  value={parseInt(el.ownershipStatus)}
                />
              </div>
              <div className='mt-2 mb-2 max-sm:text-xs text-sm'>
                <span className='font-bold'>Название жилого комплекса</span>
                <Select
                  className='w-full'
                  disabled
                  value={el.complex.id}
                  options={[{ value: el.complex.id, label: el.complex.name }]}
                />
              </div>
              <div className='mt-2 mb-2 max-sm:text-xs text-sm'>
                <span className='font-bold'>Адрес здания</span>
                <Select
                  className='w-full'
                  disabled
                  value={el.building.id}
                  options={[{ value: el.building.id, label: el.building.building }]}
                />
              </div>
              <div className='mt-2 mb-2 max-sm:text-xs text-sm'>
                <span className='font-bold'>Номер квартиры (номер собственности) </span>
                <Select
                  className='w-full'
                  disabled
                  value={el.possession.id}
                  options={[{ value: el.possession.id, label: el.possession.address }]}
                />
              </div>
            </div>
          );
        })}
    </>
  );
};
