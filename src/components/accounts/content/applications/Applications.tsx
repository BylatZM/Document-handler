import { Input, Button, ConfigProvider, Popover } from 'antd';
import { AppForm } from './AppForm';
import clsx from 'clsx';
import { useState } from 'react';
import { useTypedSelector } from '../../../hooks/useTypedSelector';

const { Search } = Input;

export const Applications = () => {
  const [IsFormActive, changeIsFormActive] = useState(false);
  const { userApplication } = useTypedSelector((state) => state.ApplicationReducer);
  const [selectedItem, changeSelectedItem] = useState(0);
  const { types, statuses, priorities, grades } = useTypedSelector(
    (state) => state.ApplicationReducer,
  );
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
            <Search placeholder='Найти' type='text' onSearch={(e) => console.log(e)} />
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
          <div className='flex justify-between p-2 gap-x-6 bg-black text-white'>
            <span className='min-w-[20px] max-w-[20px]'>№</span>
            <span className='min-w-[180px] max-w-[180px] '>Статус</span>
            <span className='min-w-[140px] max-w-[140px] '>Приоритет</span>
            <span className='min-w-[160px] max-w-[160px] '>Дата создания</span>
            <span className='min-w-[140px] max-w-[140px] '>Класс заявки</span>
            <span className='min-w-[220px] max-w-[220px] '>Тип заявки</span>
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
                  <div className='flex justify-between p-2 gap-x-6'>
                    <span className='min-w-[20px] max-w-[20px]'>{el.id}</span>
                    <span className='min-w-[180px] max-w-[180px]'>
                      <span
                        className={clsx(
                          'p-1 rounded-lg',
                          statuses &&
                            el.status &&
                            statuses.filter((item) => item.id === el.status)[0].appStatus ===
                              'Новая' &&
                            'bg-green-400 text-white',
                          statuses &&
                            el.status &&
                            !['Новая', 'Закрыта'].some(
                              (element) =>
                                element ===
                                statuses.filter((item) => item.id === el.status)[0].appStatus,
                            ) &&
                            'bg-blue-700 text-white',
                          statuses &&
                            el.status &&
                            statuses.filter((item) => item.id === el.status)[0].appStatus ===
                              'Закрыта' &&
                            'bg-gray-300 text-red-500',
                        )}
                      >
                        {statuses &&
                          el.status &&
                          statuses.filter((item) => item.id === el.status)[0].appStatus}
                      </span>
                    </span>
                    <span className='min-w-[140px] max-w-[140px]'>
                      {priorities &&
                        el.priority &&
                        priorities.filter((item) => item.id === el.priority)[0].appPriority}
                    </span>
                    <span className='min-w-[160px] max-w-[160px]'>{el.creatingDate}</span>
                    <span className='min-w-[140px] max-w-[140px]'>
                      {grades &&
                        el.grade &&
                        grades.filter((item) => item.id === el.grade)[0].appClass}
                    </span>
                    <span className='min-w-[220px] max-w-[220px]'>
                      {types && el.type && types.filter((item) => item.id === el.type)[0].appType}
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
