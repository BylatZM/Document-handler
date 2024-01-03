import { Logo } from '../../../assets/svg';
import { FC, useState } from 'react';
import { IoDocuments } from 'react-icons/io5';
import { RiLogoutBoxFill } from 'react-icons/ri';
import { clsx } from 'clsx';
import { Button, Popover } from 'antd';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../hooks/useLogout';
import { HelpForm } from '../../help_form/HelpForm';
import { MdSupportAgent } from 'react-icons/md';
import { FaUserCheck } from 'react-icons/fa';
import { FaBuildingUser } from 'react-icons/fa6';
import { FaUserCog } from 'react-icons/fa';
import { PiUsersFill } from 'react-icons/pi';
import cat from '../../../assets/images/cat.png';

interface IMenuProps {
  isOpened: boolean;
}

export const Menu: FC<IMenuProps> = ({ isOpened }) => {
  const navigate = useNavigate();
  const logout = useLogout();
  const isApproved = useTypedSelector((state) => state.UserReducer.user?.isApproved);
  const role = useTypedSelector((state) => state.UserReducer.user?.role.role);
  const [activeItem, changeActiveItem] = useState<number>(1);
  const citizen = useTypedSelector((state) => state.CitizenReducer.citizen);

  const [activeForm, changeActiveForm] = useState<null | 'help'>(null);

  return (
    <>
      <HelpForm activeForm={activeForm} changeActiveForm={changeActiveForm} />
      <div
        className={clsx(
          'transitionGeneral fixed inset-0 bg-blue-700 bg-opacity-10 backdrop-blur-xl z-[20]',
          activeForm ? 'w-full' : 'w-0',
        )}
      ></div>
      <div
        className={clsx(
          'transitionGeneral fixed z-[15] inset-0 w-[310px] flex flex-col bg-blue-700 bg-opacity-10 backdrop-blur-xl border-blue-700 border-2 shadow-black shadow-lg p-4',
          isOpened ? 'translate-x-0' : 'translate-x-[-315px]',
        )}
      >
        <div className='w-full'>
          <div className='h-min flex items-center gap-4 bg-orange-500'>
            <img src={cat} className='h-auto ' width={'70px'} alt='' />
            <div className='flex flex-col items-end overflow-hidden text-white'>
              <span className='text-xs w-max leading-4'>Управляющая компания</span>
              <span className='text-3xl leading-6'>Миллениум</span>
            </div>
          </div>
          <Logo />
        </div>
        <div className='flex flex-col mt-10 text-lg gap-y-4'>
          <Button
            className={clsx(
              'flex items-center cursor-pointer rounded-md p-5 text-lg',
              activeItem === 1 ? 'border-blue-700 text-blue-700' : 'border-black',
            )}
            onClick={() => {
              changeActiveItem(1);
              navigate('/account/aboutMe');
            }}
          >
            <FaUserCog className='mr-4' />
            <span>Обо мне</span>
          </Button>
          <Popover
            content={
              (!isApproved || !citizen[0].id) && role !== 'dispatcher' && role !== 'executor'
                ? 'Сперва укажите собственность и получите подтверждение аккаунта от администратора'
                : ''
            }
          >
            <Button
              className={clsx(
                'flex items-center cursor-pointer p-5 rounded-md text-lg',
                activeItem === 2 && isApproved ? 'border-blue-700 text-blue-700' : 'border-black',
              )}
              disabled={
                (!isApproved || !citizen[0].id) && role !== 'dispatcher' && role !== 'executor'
                  ? true
                  : false
              }
              onClick={() => {
                changeActiveItem(2);
                navigate('/account/applications');
              }}
            >
              <IoDocuments className='mr-4' />
              <span>Заявки</span>
            </Button>
          </Popover>
          {role === 'citizen' && (
            <Popover content={'В разработке'}>
              <Button
                className={clsx(
                  'flex items-center cursor-pointer p-5 rounded-md text-lg',
                  activeItem === 3 && isApproved ? 'border-blue-700 text-blue-700' : 'border-black',
                )}
                disabled={true}
                onClick={() => {
                  changeActiveItem(3);
                  navigate('/account/adding');
                }}
              >
                <PiUsersFill className='mr-4' />
                <span>Добавить арендатора</span>
              </Button>
            </Popover>
          )}
          {role === 'dispatcher' && (
            <Button
              className={clsx(
                'flex items-center cursor-pointer p-5 rounded-md text-lg',
                activeItem === 4 && isApproved ? 'border-blue-700 text-blue-700' : 'border-black',
              )}
              onClick={() => {
                changeActiveItem(4);
                navigate('/account/citizen/approve');
              }}
            >
              <FaUserCheck className='mr-4' />
              <span>подтвердить жителя</span>
            </Button>
          )}
          <Button
            className={clsx(
              'flex items-center cursor-pointer p-5 rounded-md text-lg',
              activeItem === 5 ? 'border-blue-700 text-blue-700' : 'border-black',
            )}
            onClick={() => {
              changeActiveForm('help');
            }}
          >
            <MdSupportAgent className='mr-4' />
            <span>Тех. поддержка</span>
          </Button>
          <Button
            className='flex items-center cursor-pointer p-5 rounded-md text-lg border-black'
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            <RiLogoutBoxFill className='mr-4' />
            <span>Выйти</span>
          </Button>
        </div>
      </div>
    </>
  );
};
