import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { Citizen } from './components/Citizen';
import { IUser } from '../../../types';
import { AppTable } from './components/AppTable';

export const ApproveCitizen = () => {
  const [isFormActive, changeIsFormActive] = useState(false);
  const { notApprovedUsers } = useTypedSelector((state) => state.UserReducer);
  const [selectedUserInfo, changeUserInfo] = useState<IUser | null>(null);
  const [filtratedItems, changeFiltratedItems] = useState<IUser[] | null>(null);
  const [filterType, changeFilterType] = useState<1 | 2 | 3>(3);

  useEffect(() => {
    if (!notApprovedUsers) return;

    if (filterType === 1)
      changeFiltratedItems(notApprovedUsers.filter((el) => el.account_status === 'новый'));
    if (filterType === 2)
      changeFiltratedItems(notApprovedUsers.filter((el) => el.account_status === 'отклонен'));
    if (filterType === 3) changeFiltratedItems(notApprovedUsers);
  }, [filterType, notApprovedUsers]);

  return (
    <>
      <Citizen
        changeIsFormActive={changeIsFormActive}
        isFormActive={isFormActive}
        selectedUserInfo={selectedUserInfo}
        changeUserInfo={changeUserInfo}
      />
      <div className='w-max p-2 flex flex-col mx-auto gap-4 mt-32 sm:mt-0'>
        <div className='flex justify-between'>
          <div className='flex items-center gap-4'>
            <span className='text-gray-400 text-sm'>
              Найдено: {!notApprovedUsers ? 0 : notApprovedUsers.length}
            </span>
            <div>
              <span className='text-gray-400 text-sm'>Фильтрация по статусам заявок: </span>
              <Select
                className='w-[140px] inline-block'
                placeholder='Фильтрация по статусам заявок'
                value={filterType}
                options={[
                  { value: 1, label: 'новые' },
                  { value: 2, label: 'отклоненные' },
                  { value: 3, label: 'все' },
                ]}
                onChange={(e) => changeFilterType(e)}
              />
            </div>
          </div>
        </div>
        <AppTable
          tableItems={filtratedItems}
          changeIsFormActive={changeIsFormActive}
          changeUserInfo={changeUserInfo}
        />
      </div>
    </>
  );
};
