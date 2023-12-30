import { useLogout } from '../../../../hooks/useLogout';
import { approveUserRequest } from '../../../../../api/requests/Person';
import { useActions } from '../../../../hooks/useActions';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { Button, ConfigProvider, Input } from 'antd';

const { Search } = Input;

export const ApproveCitizen = () => {
  const logout = useLogout();
  const { deleteNotApprovedUsers } = useActions();
  const { notApprovedUsers } = useTypedSelector((state) => state.UserReducer);

  const approveUser = async (id: number) => {
    const response = await approveUserRequest(id, logout);
    if (response === 200) deleteNotApprovedUsers(id);
  };

  return (
    <>
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
            <span className='min-w-[160px] max-w-[160px] overflow-hidden '>Отчество</span>
            <span className='min-w-[220px] max-w-[220px] overflow-hidden '>Почта</span>
            <span className='min-w-[150px] max-w-[150px] overflow-hidden '>Действие</span>
          </div>
          <hr className='w-full h-[0.1rem] border-none bg-black' />
          <div className='flex flex-col text-sm'>
            {notApprovedUsers &&
              notApprovedUsers.map((el) => (
                <div key={el.id} className='transition-colors flex flex-col'>
                  <div className='flex justify-between items-center p-2 gap-x-2'>
                    <span className='min-w-[20px] overflow-hidden max-w-[20px]'>{el.id}</span>
                    <span className='min-w-[180px] overflow-hidden max-w-[180px] '>
                      {el.last_name}
                    </span>
                    <span className='min-w-[140px] overflow-hidden max-w-[140px]'>
                      {el.first_name}
                    </span>
                    <span className='min-w-[160px] overflow-hidden max-w-[160px] h-min '>
                      {el.patronymic}
                    </span>
                    <span className='min-w-[220px] max-w-[220px]'>{el.email}</span>
                    <div className='min-w-[150px] max-w-[150px]'>
                      <ConfigProvider
                        theme={{
                          components: {
                            Button: {
                              colorPrimaryTextHover: '#30a876',
                              colorPrimaryHover: '#30a876',
                            },
                          },
                        }}
                      >
                        <Button
                          onClick={() => approveUser(el.id)}
                          className=' border-black text-lg p-1 flex leading-5'
                        >
                          Подтвердить
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
