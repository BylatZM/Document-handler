import { IoIosInformationCircleOutline } from 'react-icons/io';
import { Popover } from 'antd';
import { FaBell } from 'react-icons/fa';
import { FC, useState } from 'react';
import { clsx } from 'clsx';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useLocation } from 'react-router-dom';
import cat from '../../../assets/images/cat.png';

interface IHeaderProps {
  changeIsOpened: (numb: boolean) => void;
  isOpened: boolean;
}

export const Header: FC<IHeaderProps> = ({ changeIsOpened, isOpened }) => {
  const { pathname } = useLocation();
  const [isDropDownActive, changeIsDropDownActive] = useState(false);
  const user = useTypedSelector((state) => state.UserReducer.user);
  const user_email = useTypedSelector((state) => state.UserReducer.user?.email);

  return (
    <>
      <div
        className={clsx(
          'transitionGeneral fixed right-[40px] top-[68px] bg-blue-700 rounded-md z-[10] bg-opacity-10 backdrop-blur-lg border-[1px] border-blue-700 w-[270px] overflow-hidden',
          isDropDownActive ? 'h-[300px]' : 'h-0',
        )}
      >
        <img src={cat} className='absolute inset-0 w-[80px] h-[80px] m-auto opacity-25' alt='' />
      </div>
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
          <div
            className='mr-4 relative cursor-pointer'
            onClick={() => changeIsDropDownActive((prev) => !prev)}
          >
            <FaBell className='text-blue-700 h-4 w-4' />
            {/* <span className='absolute h-3 w-3 top-[-5px] right-[-5px]'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75'></span>
            <span className='absolute inline-flex rounded-full h-3 w-3 bg-sky-500'></span>
          </span> */}
          </div>
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
