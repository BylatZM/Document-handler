import { useTypedSelector } from '../../../../../hooks/useTypedSelector';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { Citizen } from './components/Citizen';
import { INotApproved } from '../../../../../types';
import { Buttons } from './Buttons';

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
        <div className='flex flex-col text-sm'>
          <div className='flex justify-between p-2 gap-x-2 bg-black text-white rounded-t-md'>
            <span className='min-w-[20px] max-w-[20px]'>№</span>
            <span className='min-w-[180px] max-w-[180px] overflow-hidden '>Фамилия</span>
            <span className='min-w-[140px] max-w-[140px] overflow-hidden '>Имя</span>
            <span className='min-w-[140px] max-w-[140px] overflow-hidden '>Статус заявки</span>
            <span className='min-w-[130px] max-w-[130px] overflow-hidden '>Подтвердить</span>
            <span className='min-w-[130px] max-w-[130px] overflow-hidden '>Информация</span>
            <span className='min-w-[120px] max-w-[120px] overflow-hidden '>Отклонить заявку</span>
          </div>
          <hr className='w-full h-[0.1rem] border-none bg-black' />
          <div className='flex flex-col text-sm'>
            {filtratedItems &&
              filtratedItems.map((el) => (
                <div key={el.id} className='transition-colors flex flex-col'>
                  <div className='transitionGeneral flex justify-between items-center p-2 gap-x-2'>
                    <span className='min-w-[20px] overflow-hidden max-w-[20px]'>{el.id}</span>
                    <span className='min-w-[180px] overflow-hidden max-w-[180px] '>
                      {el.user.last_name}
                    </span>
                    <span className='min-w-[140px] overflow-hidden max-w-[140px]'>
                      {el.user.first_name}
                    </span>
                    <span className='min-w-[140px] max-w-[140px] overflow-hidden '>
                      {el.status}
                    </span>
                    <Buttons
                      data={filtratedItems}
                      item={el}
                      changeUserInfo={changeUserInfo}
                      changeIsFormActive={changeIsFormActive}
                    />
                  </div>
                  <hr className='w-full h-[0.1rem] border-none bg-black' />
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};
