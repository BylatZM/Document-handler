import { useTypedSelector } from '../../../../../hooks/useTypedSelector';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { Citizen } from './components/Citizen';
import { INotApproved } from '../../../../../types';
import clsx from 'clsx';
import { ApplicationsTable } from './components/ApplicationsTable';

export const ApproveCitizen = () => {
  const [isFormActive, changeIsFormActive] = useState(false);
  const { notApproved } = useTypedSelector((state) => state.UserReducer);
  const [selectedUserInfo, changeUserInfo] = useState<INotApproved | null>(null);
  const [filtratedItems, changeFiltratedItems] = useState<INotApproved[] | null>(null);
  const [filterType, changeFilterType] = useState<1 | 2 | 3>(3);

  useEffect(() => {
    if (!notApproved) return;

    if (filterType === 1) changeFiltratedItems(notApproved.filter((el) => el.status === 'новая'));
    if (filterType === 2)
      changeFiltratedItems(notApproved.filter((el) => el.status === 'отклонена'));
    if (filterType === 3) changeFiltratedItems(notApproved);
  }, [filterType, notApproved]);

  return (
    <>
      <Citizen
        changeIsFormActive={changeIsFormActive}
        isFormActive={isFormActive}
        selectedUserInfo={selectedUserInfo}
        changeUserInfo={changeUserInfo}
      />
      <div className='w-max p-2 flex flex-col m-auto gap-4'>
        <div className='flex justify-between'>
          <div className='flex items-center gap-4'>
            <span className='text-gray-400 text-sm'>
              Найдено: {!notApproved ? 0 : notApproved.length}
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
        <ApplicationsTable
          tableItems={filtratedItems}
          changeIsFormActive={changeIsFormActive}
          changeUserInfo={changeUserInfo}
        />
      </div>
    </>
  );
};
