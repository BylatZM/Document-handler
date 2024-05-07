import { FC, useState } from 'react';
import { clsx } from 'clsx';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useLocation } from 'react-router-dom';
import { useLogout } from '../../hooks/useLogout';
import cat from '../../../assets/images/cat.png';
import { Logo } from '../../../assets/svg';
import { Directories } from './buttons/dispatcher/Directories';
import { Confirmations } from './buttons/dispatcher/Confirmations';
import { AboutMe } from './buttons/general/AboutMe';
import { Applications } from './buttons/general/Applications';
import { TechnicalSupport } from './buttons/general/TechnicalSupport';
import { Logout } from './buttons/general/Logout';
import './media.css';
import { GisApplications } from './buttons/general/GisApplications';

interface IMenuProps {
  isOpened: boolean;
  changeNeedShowCreatePossessionForm: React.Dispatch<React.SetStateAction<boolean>>;
  changeNeedShowHelpForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Menu: FC<IMenuProps> = ({
  isOpened,
  changeNeedShowCreatePossessionForm,
  changeNeedShowHelpForm,
}) => {
  const { pathname } = useLocation();
  const logout = useLogout();
  const { role, email } = useTypedSelector((state) => state.UserReducer.user);

  const [activeAccordion, changeActiveAccordion] = useState<string | null>(null);

  return (
    <div
      className={clsx(
        'transitionGeneral fixed z-40 inset-y-0 left-0 overflow-x-hidden overflow-y-auto bg-blue-700 bg-opacity-10 backdrop-blur-xl border-blue-700 border-2 shadow-black shadow-lg',
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
          <Applications pathname={pathname} />
          {(role === 'executor' || role === 'dispatcher') && (
            <GisApplications pathname={pathname} />
          )}
          {role === 'dispatcher' && (
            <>
              <Directories
                changeActiveAccordion={changeActiveAccordion}
                activeAccordion={activeAccordion}
                changeNeedShowCreatePossessionForm={changeNeedShowCreatePossessionForm}
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
  );
};
