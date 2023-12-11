import { Logo } from '../../../assets/svg';
import { FC, useState } from 'react';
import { IoDocuments } from 'react-icons/io5';
import { RiLogoutBoxFill } from 'react-icons/ri';
import { FaUserAlt } from 'react-icons/fa';
import { IoIosAddCircle } from 'react-icons/io';
import { clsx } from 'clsx';
import { Button, Popover } from 'antd';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useNavigate } from 'react-router-dom';
import { logoutRequest } from '../../../store/creators/MainCreators';
import { useDispatch } from 'react-redux';

interface IMenuProps {
  isOpened: boolean;
}

export const Menu: FC<IMenuProps> = ({ isOpened }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isApproved = useTypedSelector((state) => state.UserReducer.user?.isApproved);
  const role = useTypedSelector((state) => state.UserReducer.user?.role.role);
  const [activeItem, changeActiveItem] = useState<number>(1);
  const citizen = useTypedSelector((state) => state.CitizenReducer.citizen);

  return (
    <>
      <div
        className={clsx(
          'transitionTransform fixed z-20 inset-y-0 w-[280px] flex flex-col bg-blue-700 bg-opacity-10 backdrop-blur-xl border-blue-500 border-2 shadow-black shadow-lg p-4',
          isOpened ? 'left-0' : 'left-[-600px]',
        )}
      >
        <div className='w-min mx-auto'>
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
            <FaUserAlt className='mr-4' />
            <span>Обо мне</span>
          </Button>
          <Popover
            content={
              (!isApproved || !citizen[0].id) && role !== 'диспетчер' && role !== 'исполнитель'
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
                (!isApproved || !citizen[0].id) && role !== 'диспетчер' && role !== 'исполнитель'
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
          {role === 'житель' && (
            <Popover
              content={
                !isApproved || citizen[0].id === 0
                  ? 'Сперва укажите собственность и получите подтверждение аккаунта от администратора'
                  : ''
              }
            >
              <Button
                className={clsx(
                  'flex items-center cursor-pointer p-5 rounded-md text-lg',
                  activeItem === 3 && isApproved ? 'border-blue-700 text-blue-700' : 'border-black',
                )}
                disabled={!isApproved || citizen[0].id === 0 ? true : false}
                onClick={() => {
                  changeActiveItem(3);
                  navigate('/account/adding');
                }}
              >
                <IoIosAddCircle className='mr-4' />
                <span>Добавить арендатора</span>
              </Button>
            </Popover>
          )}
          {role === 'диспетчер' && (
            <Popover content='Создать собственность гражданина'>
              <Button
                className={clsx(
                  'flex items-center cursor-pointer p-5 rounded-md text-lg',
                  activeItem === 4 && isApproved ? 'border-blue-700 text-blue-700' : 'border-black',
                )}
                onClick={() => {
                  changeActiveItem(4);
                  navigate('/account/create/possession');
                }}
              >
                <IoIosAddCircle className='mr-4' />
                <span>Житель</span>
              </Button>
            </Popover>
          )}
          <Button
            className='flex items-center cursor-pointer p-5 rounded-md text-lg border-black'
            onClick={() => {
              logoutRequest(dispatch);
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
