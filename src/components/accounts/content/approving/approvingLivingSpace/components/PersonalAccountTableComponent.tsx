import { Button, Dropdown, Input } from 'antd';
import { FC, useEffect, useState } from 'react';
import { IFilterNotApprovedLivingSpacesOptions } from '../../../../../types';
import { IoFunnel } from 'react-icons/io5';
import clsx from 'clsx';

interface IProps {
  name: any[];
  defaultItemValue: string | null;
  setFilterOptions: React.Dispatch<React.SetStateAction<IFilterNotApprovedLivingSpacesOptions>>;
  changeIsNeedToGet: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PersonalAccountTableComponent: FC<IProps> = ({
  name,
  defaultItemValue,
  setFilterOptions,
  changeIsNeedToGet,
}) => {
  const [value, changeValue] = useState('');

  useEffect(() => {
    if (defaultItemValue) {
      changeValue(defaultItemValue);
    }
  }, []);

  return (
    <div className='flex items-center gap-x-2 justify-center'>
      <span>{name}</span>
      <Dropdown
        trigger={['click']}
        arrow
        placement='bottom'
        align={{ offset: [0, 18] }}
        overlayClassName='bg-black p-4 border-white border-[1px] text-white bg-opacity-70 max-sm:max-w-[200px] max-sm:text-sm'
        dropdownRender={() => (
          <div className='dropdown-content'>
            <span>Лицевой счет</span>
            <Input
              value={value}
              onChange={(e) => changeValue(e.target.value)}
              placeholder='Лицевой счет'
            />
            <div className='flex gap-x-2 mt-4 max-sm:flex-col max-sm:gap-y-2 max-sm:gap-x-0'>
              <Button
                type='primary'
                className='bg-blue-700 text-white border-none'
                onClick={() => {
                  setFilterOptions((prev) => ({ ...prev, personalAccount: value }));
                  changeIsNeedToGet(true);
                }}
              >
                Искать
              </Button>
              <Button
                className='text-blue-700 border-blue-700 border-[1px]'
                onClick={() => {
                  setFilterOptions((prev) => ({
                    ...prev,
                    personalAccount: null,
                  }));
                  changeIsNeedToGet(true);
                }}
              >
                Отменить
              </Button>
            </div>
          </div>
        )}
      >
        <IoFunnel
          className={clsx(
            'text-lg cursor-pointer',
            defaultItemValue ? 'text-blue-700' : 'text-white',
          )}
        />
      </Dropdown>
    </div>
  );
};
