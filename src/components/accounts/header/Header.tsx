import { IoIosInformationCircleOutline } from 'react-icons/io';
import { Popover, Dropdown, ConfigProvider } from 'antd';
import { FaBell } from 'react-icons/fa';
import { FC } from 'react';
import { clsx } from 'clsx';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useLocation } from 'react-router-dom';

interface IHeaderProps {
  changeIsOpened: (numb: boolean) => void;
  isOpened: boolean;
}

export const Header: FC<IHeaderProps> = ({ changeIsOpened, isOpened }) => {
  const { pathname } = useLocation();
  const user = useTypedSelector((state) => state.UserReducer.user);
  const user_email = useTypedSelector((state) => state.UserReducer.user?.email);

  const items = [
    {
      label: <span className=''>user info</span>,
      key: '0',
    },
  ];

  return (
    <div className='w-full flex py-5 px-2 justify-between bg-blue-700 bg-opacity-10 backdrop-blur-xl z-10 fixed inset-x-0 top-0'>
      <div className='flex items-center'>
        <b className='mr-2 text-lg'>
          {pathname === '/account/aboutMe' && 'Личный кабинет'}
          {pathname === '/account/settings' && 'Настройки'}
          {pathname === '/account/applications' && 'Заявки'}
          {pathname === '/account/adding' &&
            user?.isApproved &&
            user.role.role === 'citizen' &&
            'Добавить арендатора'}
          {pathname === '/account/create/possession' && 'Собственность жителя'}
          {pathname === '/account/citizen/approve' && 'Подтверждение аккаунтов жителей'}
        </b>
        <Popover content={'Информация'}>
          <IoIosInformationCircleOutline className='text-gray-400' />
        </Popover>
      </div>
      <div className='flex items-center'>
        <b className='mr-4'>{user_email}</b>
        <Dropdown
          menu={{
            items,
          }}
          trigger={['click']}
          className='cursor-pointer'
        >
          <div className='mr-4 relative'>
            <FaBell className='text-red-600 h-4 w-4' />
            <span className='absolute h-3 w-3 top-[-5px] right-[-5px]'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75'></span>
              <span className='absolute inline-flex rounded-full h-3 w-3 bg-sky-500'></span>
            </span>
          </div>
        </Dropdown>
        <div
          className='flex flex-col justify-center w-7 gap-y-2 h-6 cursor-pointer'
          onClick={() => changeIsOpened(!isOpened)}
        >
          <span
            className={clsx(
              'transition-transform relative bg-blue-700 top-0 w-full h-[3px]',
              isOpened && 'rotate-[45deg] top-[6px]',
            )}
          ></span>
          <span
            className={clsx('relative bg-blue-700 w-full h-[3px]', isOpened && 'hidden')}
          ></span>
          <span
            className={clsx(
              'transition-transform relative bg-blue-700 w-full h-[3px]',
              isOpened && 'rotate-[-45deg] bottom-[5px]',
            )}
          ></span>
        </div>
      </div>
    </div>
  );
};
