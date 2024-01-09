import { useLogout } from '../../../../hooks/useLogout';
import { approveUserRequest, getCitizenByIdRequest } from '../../../../../api/requests/Person';
import { useActions } from '../../../../hooks/useActions';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { Button, ConfigProvider, Input } from 'antd';
import { citizenLoading } from '../../../../../store/reducers/CitizenReducer';
import { useState } from 'react';
import clsx from 'clsx';
import { CitizenPossession } from './CitizenPossession';

const { Search } = Input;

export const ApproveCitizen = () => {
  const logout = useLogout();
  const [isFormActive, changeIsFormActive] = useState(false);
  const { deleteNotApprovedUsers, citizenSuccess, notApprovedUsersSuccess } = useActions();
  const { notApprovedUsers } = useTypedSelector((state) => state.UserReducer);

  const approveUser = async (id: number) => {
    const response = await approveUserRequest(id, logout);
    if (response === 200) deleteNotApprovedUsers(id);
  };

  const getCitizenById = async (id: number) => {
    citizenLoading({ form_id: 0, isLoading: true });
    const response = await getCitizenByIdRequest(logout, id);
    if (response && typeof response !== 'number') citizenSuccess(response);
    citizenLoading({ form_id: 0, isLoading: false });
  };

  return (
    <>
      <CitizenPossession changeIsFormActive={changeIsFormActive} isFormActive={isFormActive} />
      <div className='w-max p-2 flex flex-col m-auto gap-4'>
        <div className='flex justify-between'>
          <div className='flex items-center gap-4'>
            <span className='text-gray-400 min-w-max text-sm'>
              Найдено: {!notApprovedUsers ? 0 : notApprovedUsers.length}
            </span>
            <Search placeholder='Найти' type='text' onSearch={(e) => console.log(e)} />
          </div>
        </div>
        <div className='flex flex-col text-sm'>
          <div className='flex justify-between p-2 gap-x-2 bg-black text-white'>
            <span className='min-w-[20px] max-w-[20px]'>№</span>
            <span className='min-w-[180px] max-w-[180px] overflow-hidden '>Фамилия</span>
            <span className='min-w-[140px] max-w-[140px] overflow-hidden '>Имя</span>
            <span className='min-w-[130px] max-w-[130px] overflow-hidden '>Подтвердить</span>
            <span className='min-w-[130px] max-w-[130px] overflow-hidden '>Информация</span>
            <span className='min-w-[120px] max-w-[120px] overflow-hidden '>Скрыть</span>
          </div>
          <hr className='w-full h-[0.1rem] border-none bg-black' />
          <div className='flex flex-col text-sm'>
            {notApprovedUsers &&
              notApprovedUsers.map((el) => (
                <div key={el.id} className='transition-colors flex flex-col'>
                  <div className='transitionGeneral flex justify-between items-center p-2 gap-x-2'>
                    <span className='min-w-[20px] overflow-hidden max-w-[20px]'>{el.id}</span>
                    <span className='min-w-[180px] overflow-hidden max-w-[180px] '>
                      {el.last_name}
                    </span>
                    <span className='min-w-[140px] overflow-hidden max-w-[140px]'>
                      {el.first_name}
                    </span>
                    <div className='min-w-[130px] max-w-[130px]'>
                      <ConfigProvider
                        theme={{
                          components: {
                            Button: {
                              colorPrimaryTextHover: '#fff',
                              colorPrimaryHover: undefined,
                            },
                          },
                        }}
                      >
                        <Button
                          onClick={() => approveUser(el.id)}
                          className='text-black border-black text-lg p-1 flex leading-5 border-[1px]'
                        >
                          Подтвердить
                        </Button>
                      </ConfigProvider>
                    </div>
                    <div className='min-w-[130px] max-w-[130px]'>
                      <ConfigProvider
                        theme={{
                          components: {
                            Button: {
                              colorPrimaryTextHover: undefined,
                              colorPrimaryHover: undefined,
                            },
                          },
                        }}
                      >
                        <Button
                          onClick={() => {
                            changeIsFormActive(true);
                            getCitizenById(el.id);
                          }}
                          className='text-blue-500 border-blue-500 text-lg p-1 flex leading-5 border-[1px]'
                        >
                          Информация
                        </Button>
                      </ConfigProvider>
                    </div>
                    <div className='min-w-[120px] max-w-[120px]'>
                      <ConfigProvider
                        theme={{
                          components: {
                            Button: {
                              colorPrimaryTextHover: '#ef4444',
                              colorPrimaryHover: undefined,
                            },
                          },
                        }}
                      >
                        <Button
                          onClick={() => {
                            notApprovedUsersSuccess(
                              notApprovedUsers.filter((item) => item.id !== el.id),
                            );
                          }}
                          className='text-red-500 border-red-500 text-lg p-1 flex leading-5 border-[1px]'
                        >
                          Скрыть
                        </Button>
                      </ConfigProvider>
                    </div>
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
