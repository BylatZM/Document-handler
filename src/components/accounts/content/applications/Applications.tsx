import { Button, ConfigProvider, Popover } from 'antd';
import { AppForm } from './appForm/AppForm';
import clsx from 'clsx';
import { useState } from 'react';
import { useTypedSelector } from '../../../hooks/useTypedSelector';

export const Applications = () => {
  const [IsFormActive, changeIsFormActive] = useState(false);
  const { userApplication } = useTypedSelector((state) => state.ApplicationReducer);
  const [selectedItem, changeSelectedItem] = useState(0);
  const role = useTypedSelector((state) => state.UserReducer.user.role.role);

  const showForm = async (application_id: number) => {
    changeSelectedItem(application_id);
    changeIsFormActive(true);
  };

  return (
    <>
      <div
        className={clsx(
          'transitionGeneral fixed inset-0 bg-blue-700 bg-opacity-10 backdrop-blur-xl z-[20]',
          IsFormActive ? 'w-full' : 'w-0',
        )}
      ></div>
      <AppForm
        IsFormActive={IsFormActive}
        changeIsFormActive={changeIsFormActive}
        id={selectedItem}
      />
      <div className='w-max p-2 flex flex-col m-auto gap-4'>
        <div className='flex justify-between'>
          <div className='flex items-center gap-4'>
            <span className='text-gray-400 min-w-max text-sm'>
              Найдено: {!userApplication ? 0 : userApplication.length}
            </span>
          </div>
          {['citizen', 'dispatcher'].some((el) => el === role) && (
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorPrimaryHover: '#fff',
                  },
                },
              }}
            >
              <Popover content='Создать заявку'>
                <Button
                  className='w-[30px] h-[30px] rounded-full border-none bg-blue-700 text-white flex items-center justify-center'
                  onClick={() => showForm(0)}
                >
                  +
                </Button>
              </Popover>
            </ConfigProvider>
          )}
        </div>
        <div className='flex flex-col text-sm'>
          <div className='flex justify-between p-2 gap-x-6 bg-black text-white rounded-t-md'>
            <span className='min-w-[20px] max-w-[20px]'>№</span>
            <span className='min-w-[160px] max-w-[160px]'>Дата создания</span>
            <span className='min-w-[180px] max-w-[180px]'>Тип заявки</span>
            <span className='min-w-[220px] max-w-[220px]'>Жилищный комплекс</span>
            <span className='min-w-[160px] max-w-[160px]'>Статус</span>
          </div>
          <hr className='w-full h-[0.1rem] border-none bg-black' />
          <div className='flex flex-col text-sm'>
            {userApplication &&
              userApplication.map((el) => (
                <div
                  key={el.id}
                  onClick={() => showForm(el.id)}
                  className='transition-colors flex flex-col cursor-pointer hover:bg-blue-700 hover:bg-opacity-50 hover:text-white'
                >
                  <div className='flex justify-between items-center p-2 gap-x-6'>
                    <span className='min-w-[20px] max-w-[20px]'>{el.id}</span>
                    <span className='min-w-[160px] max-w-[160px]'>{el.creatingDate}</span>
                    <span className='min-w-[180px] max-w-[180px]'>
                      {!el.type ? '' : el.type.appType}
                    </span>
                    <span className='min-w-[220px] max-w-[220px]'>{el.complex.name}</span>
                    <span className='min-w-[160px] max-w-[160px]'>
                      <span
                        className={clsx(
                          'p-1 rounded-lg text-white',
                          el.status && el.status.appStatus === 'В работе' && 'bg-blue-700',
                          el.status && el.status.appStatus === 'Новая' && 'bg-green-400',
                          el.status && el.status.appStatus === 'Назначена' && 'bg-green-600',
                          el.status && el.status.appStatus === 'Возвращена' && 'bg-amber-500',
                          el.status && el.status.appStatus === 'Закрыта' && 'bg-red-500',
                        )}
                      >
                        {!el.status ? '' : el.status.appStatus}
                      </span>
                    </span>
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
