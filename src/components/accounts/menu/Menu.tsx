import { FC, useState } from 'react';
import { IoDocuments } from 'react-icons/io5';
import { RiLogoutBoxFill } from 'react-icons/ri';
import { clsx } from 'clsx';
import { Popover } from 'antd';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useNavigate, Link, useLocation, Navigate } from 'react-router-dom';
import { useLogout } from '../../hooks/useLogout';
import { HelpForm } from '../../help_form/HelpForm';
import { MdSupportAgent } from 'react-icons/md';
import { FaUserCheck } from 'react-icons/fa';
import { FaUserCog } from 'react-icons/fa';
import { PiUsersFill } from 'react-icons/pi';
import cat from '../../../assets/images/cat.png';
import { MdOutlineClass } from 'react-icons/md';
import { GrUserWorker } from 'react-icons/gr';
import { BsFillBuildingsFill } from 'react-icons/bs';
import { GrNext } from 'react-icons/gr';
import { GoFileDirectoryFill } from 'react-icons/go';
import { OwnershipCreateHandler } from '../content/personalAccount/OwnershipCreateHandler';
import { Logo } from '../../../assets/svg';

interface IMenuProps {
  isOpened: boolean;
}

export const Menu: FC<IMenuProps> = ({ isOpened }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const logout = useLogout();
  const isApproved = useTypedSelector((state) => state.UserReducer.user?.isApproved);
  const role = useTypedSelector((state) => state.UserReducer.user?.role.role);
  const citizen = useTypedSelector((state) => state.CitizenReducer.citizen);

  const [activeForm, changeActiveForm] = useState<null | 'help'>(null);
  const [activeAccordion, changeActiveAccordion] = useState<string | null>(null);
  const [isPossFormActive, changeIsPossFormActive] = useState(false);

  return (
    <>
      <HelpForm activeForm={activeForm} changeActiveForm={changeActiveForm} />
      <OwnershipCreateHandler
        isFormActive={isPossFormActive}
        changeIsFormActive={changeIsPossFormActive}
      />
      <div
        className={clsx(
          'transitionGeneral fixed inset-0 bg-blue-700 bg-opacity-10 backdrop-blur-xl z-[20]',
          activeForm || isPossFormActive ? 'w-full' : 'w-0',
        )}
      ></div>
      <div
        className={clsx(
          'transitionGeneral fixed z-[15] inset-y-0 left-0 overflow-hidden overflow-y-auto bg-blue-700 bg-opacity-10 backdrop-blur-xl border-blue-700 border-2 shadow-black shadow-lg',
          isOpened ? 'w-[310px] p-4' : 'w-0 mr-[-2px]',
        )}
      >
        <div className='min-w-full'>
          <div className='h-min flex items-center gap-4 logoGrid'>
            <img src={cat} className='h-auto' width={'70px'} alt='' />
            <div className='flex flex-col items-end overflow-hidden text-white'>
              <span className='text-xs w-max leading-4'>Управляющая компания</span>
              <span className='text-3xl leading-6'>Миллениум</span>
            </div>
          </div>
        </div>
        <div className='flex flex-col mt-10 text-lg'>
          <Link
            to={'/account/aboutMe'}
            className={clsx(
              'flex items-center min-w-full rounded-md py-2 text-lg mb-4 h-[45px] overflow-hidden',
              pathname.includes('/account/aboutMe') ? 'text-blue-700 bg-blue-300' : 'bg-gray-300',
            )}
          >
            <FaUserCog className='mr-4 ml-4' />
            <span>Обо мне</span>
          </Link>
          <Popover
            content={
              (!isApproved || !citizen[0].id) && role !== 'dispatcher' && role !== 'executor' ? (
                <>
                  <div>Сперва создайте собственность</div>
                  <div>Дождитесь подтверждения аккаунта от диспетчера</div>
                </>
              ) : (
                ''
              )
            }
          >
            <button
              onClick={() => navigate('/account/applications')}
              disabled={
                (!isApproved || !citizen[0].id) && role !== 'dispatcher' && role !== 'executor'
                  ? true
                  : false
              }
              className={clsx(
                'flex items-center py-2 rounded-md text-lg mb-4 h-[45px] overflow-hidden',
                pathname.includes('/account/applications') && isApproved
                  ? 'text-blue-700 bg-blue-300'
                  : 'bg-gray-300',
              )}
            >
              <IoDocuments className='mr-4 ml-4' />
              <span>Заявки</span>
            </button>
          </Popover>
          {role === 'dispatcher' && (
            <>
              <button
                onClick={() => changeActiveAccordion((prev) => (!prev ? 'directories' : null))}
                className='flex items-center justify-between py-2 rounded-md text-lg bg-gray-300 mb-4 h-[45px] overflow-hidden'
              >
                <div className='flex ml-6 items-center'>
                  <GoFileDirectoryFill className='mr-4' />
                  <span>Справочники</span>
                </div>
                <GrNext
                  className={clsx(
                    'transitionGeneral mr-6',
                    activeAccordion === 'directories' && 'rotate-90',
                  )}
                />
              </button>
              <div
                className={clsx(
                  'transitionGeneral flex flex-col gap-y-4 overflow-hidden',
                  activeAccordion === 'directories' ? 'h-[180px]' : 'h-0',
                )}
              >
                <Link
                  to={'/account/directory/applicationClasses'}
                  className={clsx(
                    'flex items-center py-2 rounded-md text-lg pointer-events-none',
                    pathname.includes('/account/directory/applicationClasses')
                      ? 'text-blue-700 bg-blue-300'
                      : 'bg-gray-300',
                  )}
                >
                  <MdOutlineClass className='mr-4 ml-6' />
                  <span>Класс заявок</span>
                </Link>
                <button
                  onClick={() => changeIsPossFormActive(true)}
                  // to={'/account/directory/possession'}
                  className={clsx(
                    'flex items-center py-2 rounded-md text-lg bg-gray-300',
                    // pathname.includes('/account/directory/possession')
                    //   ? 'text-blue-700 bg-blue-300'
                    //   : 'bg-gray-300',
                    // (!isApproved || !citizen[0].id) &&
                    //   role !== 'dispatcher' &&
                    //   role !== 'executor' &&
                    //   'pointer-events-none',
                  )}
                >
                  <BsFillBuildingsFill className='mr-4 ml-6' />
                  <span>Собственность</span>
                </button>
                <Link
                  to={'/account/directory/employee'}
                  className={clsx(
                    'flex items-center py-2 rounded-md text-lg pointer-events-none',
                    pathname.includes('/directory/applicationClasses')
                      ? 'text-blue-700 bg-blue-300'
                      : 'bg-gray-300',
                    (!isApproved || !citizen[0].id) &&
                      role !== 'dispatcher' &&
                      role !== 'executor' &&
                      'pointer-events-none',
                  )}
                >
                  <GrUserWorker className='mr-4 ml-6' />
                  <span>Работник</span>
                </Link>
              </div>
            </>
          )}
          {role === 'citizen' && (
            <Popover content={'В разработке'}>
              <button
                disabled
                className={clsx(
                  'flex items-center py-2 rounded-md text-lg mb-4 h-[45px] overflow-hidden',
                  pathname.includes('/account/addLandlord') && isApproved
                    ? 'text-blue-700 bg-blue-300'
                    : 'bg-gray-300',
                )}
              >
                <PiUsersFill className='mr-4 ml-4' />
                <span>Добавить арендатора</span>
              </button>
            </Popover>
          )}
          {role === 'dispatcher' && (
            <Link
              to={'/account/citizen/approve'}
              className={clsx(
                'flex items-center py-2 rounded-md text-lg mb-4 h-[45px] overflow-hidden',
                pathname.includes('/account/citizen/approve') && isApproved
                  ? 'text-blue-700 blue-300 bg-blue-300'
                  : 'bg-gray-300',
              )}
            >
              <FaUserCheck className='mr-4 ml-4' />
              <span>Подтвердить жителя</span>
            </Link>
          )}
          <button
            className='flex items-center cursor-pointer py-2 rounded-md text-lg bg-gray-300 mb-4 h-[45px] overflow-hidden'
            onClick={() => {
              changeActiveForm('help');
            }}
          >
            <MdSupportAgent className='mr-4 ml-4' />
            <span>Тех. поддержка</span>
          </button>
          <button
            className='flex items-center cursor-pointer py-2 rounded-md text-lg border-none bg-gray-300 h-[45px] overflow-hidden'
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            <RiLogoutBoxFill className='mr-4 ml-4' />
            <span>Выйти</span>
          </button>
        </div>
        <div className='absolute bottom-0 left-0 m-4'>
          <Logo />
        </div>
      </div>
    </>
  );
};
