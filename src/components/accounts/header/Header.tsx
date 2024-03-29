import { IoIosInformationCircleOutline } from 'react-icons/io';
import { Popover } from 'antd';
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
  const user_email = useTypedSelector((state) => state.UserReducer.user?.email);

  return (
    <>
      <div className='w-full flex py-5 px-2 justify-between bg-blue-700 bg-opacity-10 backdrop-blur-xl z-10 fixed inset-x-0 top-0'>
        <div className='flex items-center w-0 overflow-hidden sm:w-fit'>
          <b className='mr-2 text-lg'>
            {pathname === '/account/aboutMe' && 'Личный кабинет'}
            {pathname === '/account/applications' && 'Заявки'}
            {pathname === '/account/approve/user' && 'Подтверждение аккаунтов жителей'}
            {pathname === '/account/approve/possession' && 'Подтверждение собственностей'}
          </b>
          <Popover content={'Информация'}>
            <IoIosInformationCircleOutline className='text-gray-400' />
          </Popover>
        </div>
        <div className='flex items-center text-sm sm:text-base'>
          <b className='mr-4'>{user_email}</b>
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
    </>
  );
};
