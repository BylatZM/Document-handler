import { FC, useState } from 'react';
import { clsx } from 'clsx';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useLocation } from 'react-router-dom';
import { useLogout } from '../../hooks/useLogout';
import { HelpForm } from '../content/helpForm/HelpForm';
import cat from '../../../assets/images/cat.png';
import { CreatePossession } from '../content/createPossession/CreatePossession';
import { Logo } from '../../../assets/svg';
import { Directories } from './buttons/dispatcher/Directories';
import { Confirmations } from './buttons/dispatcher/Confirmations';
import { AboutMe } from './buttons/general/AboutMe';
import { Applications } from './buttons/general/Applications';
import { TechnicalSupport } from './buttons/general/TechnicalSupport';
import { Logout } from './buttons/general/Logout';
import './media.css';

interface IMenuProps {
  isOpened: boolean;
}

export const Menu: FC<IMenuProps> = ({ isOpened }) => {
  const { pathname } = useLocation();
  const logout = useLogout();
  const { role, account_status } = useTypedSelector((state) => state.UserReducer.user);
  const citizen = useTypedSelector((state) => state.CitizenReducer.citizen);

  const [needShowHelpForm, changeNeedShowHelpForm] = useState(false);
  const [activeAccordion, changeActiveAccordion] = useState<string | null>(null);
  const [needShowPossessionCreateForm, changeNeedShowPossessionCreateForm] = useState(false);

  return (
    <>
      <HelpForm needShowForm={needShowHelpForm} changeNeedShowForm={changeNeedShowHelpForm} />
      <CreatePossession
        needShowForm={needShowPossessionCreateForm}
        changeNeedShowForm={changeNeedShowPossessionCreateForm}
      />
      <div
        className={clsx(
          'transitionGeneral fixed z-[15] inset-y-0 left-0 overflow-hidden overflow-y-auto bg-blue-700 bg-opacity-10 backdrop-blur-xl border-blue-700 border-2 shadow-black shadow-lg',
          isOpened ? 'w-[250px] p-1 sm:w-[310px] sm:p-4' : 'w-0 mr-[-2px]',
        )}
      >
        <div className='relative w-[240px] sm:min-w-[274px] h-full'>
          <div className='h-min flex items-center gap-4 logoGrid'>
            <img src={cat} className='h-auto' width={'70px'} alt='' />
            <div className='flex flex-col items-end overflow-hidden text-white'>
              <span className='text-xs w-max leading-4'>Управляющая компания</span>
              <span className='text-lg sm:text-3xl leading-6'>Миллениум</span>
            </div>
          </div>
          <div className='flex flex-col mt-10 text-lg'>
            <AboutMe pathname={pathname} />
            <Applications
              account_status={account_status}
              role={role}
              citizen={citizen}
              pathname={pathname}
            />
            {role.role === 'dispatcher' && (
              <>
                <Directories
                  changeActiveAccordion={changeActiveAccordion}
                  activeAccordion={activeAccordion}
                  changeNeedShowPossessionCreateForm={changeNeedShowPossessionCreateForm}
                />
                <Confirmations
                  changeActiveAccordion={changeActiveAccordion}
                  activeAccordion={activeAccordion}
                  pathname={pathname}
                />
              </>
            )}
            <TechnicalSupport changeNeedShowHelpForm={changeNeedShowHelpForm} />
            <Logout logout={logout} />
          </div>

          <div
            className={clsx(
              'transitionGeneral absolute bottom-0 left-0 overflow-hidden Logo',
              activeAccordion ? 'z-[-1] opacity-0' : 'opacity-100',
            )}
          >
            <Logo />
          </div>
        </div>
      </div>
    </>
  );
};
