import { FC, useState } from 'react';
import { clsx } from 'clsx';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useLocation } from 'react-router-dom';
import { useLogout } from '../../hooks/useLogout';
import cat from '../../../assets/images/cat.png';
import { Directories } from './buttons/dispatcher/Directories';
import { Confirmations } from './buttons/dispatcher/Confirmations';
import { AboutMe } from './buttons/general/AboutMe';
import { Applications } from './buttons/general/Applications';
import { TechnicalSupport } from './buttons/general/TechnicalSupport';
import { Logout } from './buttons/general/Logout';
import { GisApplications } from './buttons/general/GisApplications';
import { IAccordionState } from '../../types';
import { Camera } from './buttons/general/Camera';
import { EmailApplications } from './buttons/general/EmailApplications';

interface IMenuProps {
  isMenuOpened: boolean;
  changeIsMenuOpened: React.Dispatch<React.SetStateAction<boolean>>;
  changeNeedShowCreatePossessionForm: React.Dispatch<React.SetStateAction<boolean>>;
  changeNeedShowHelpForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Menu: FC<IMenuProps> = ({
  isMenuOpened,
  changeIsMenuOpened,
  changeNeedShowCreatePossessionForm,
  changeNeedShowHelpForm,
}) => {
  const { pathname } = useLocation();
  const logout = useLogout();
  const { role, email } = useTypedSelector((state) => state.UserReducer.user);

  const [activeAccordion, changeActiveAccordion] = useState<IAccordionState>({
    confirmations: false,
    directories: false,
  });
  return (
    <div
      className={clsx(
        'transitionFast fixed z-40 inset-y-0 left-0 overflow-x-hidden p-1 sm:p-4 overflow-y-auto bg-blue-700 bg-opacity-10 backdrop-blur-xl border-blue-700 border-2 shadow-black shadow-lg menu',
        isMenuOpened ? 'w-[250px] sm:w-[310px] opacity-100' : 'w-0 opacity-0 mr-[-2px]',
      )}
    >
      <div className='relative w-[240px] sm:min-w-[274px] h-full'>
        <div className='logoGrid flex w-fit items-center'>
          <img src={cat} className='h-auto' width={'70px'} alt='' />
        </div>
        <div className='flex flex-col mt-10 text-lg'>
          <AboutMe pathname={pathname} changeIsMenuOpened={changeIsMenuOpened} />
          <Applications pathname={pathname} changeIsMenuOpened={changeIsMenuOpened} />
          {(role === 'executor' || role === 'dispatcher') && (
            <GisApplications pathname={pathname} changeIsMenuOpened={changeIsMenuOpened} />
          )}
          {(role === 'executor' || role === 'dispatcher') && (
            <EmailApplications pathname={pathname} changeIsMenuOpened={changeIsMenuOpened} />
          )}
          {email === 'SuperDispatcher2@yandex.ru' && (
            <Camera pathname={pathname} changeIsMenuOpened={changeIsMenuOpened} />
          )}
          {role === 'dispatcher' && (
            <>
              <Directories
                changeActiveAccordion={changeActiveAccordion}
                activeAccordion={activeAccordion}
                changeNeedShowCreatePossessionForm={changeNeedShowCreatePossessionForm}
                changeIsMenuOpened={changeIsMenuOpened}
              />
              <Confirmations
                changeActiveAccordion={changeActiveAccordion}
                activeAccordion={activeAccordion}
                pathname={pathname}
                changeIsMenuOpened={changeIsMenuOpened}
              />
            </>
          )}
          <TechnicalSupport
            changeNeedShowHelpForm={changeNeedShowHelpForm}
            changeIsMenuOpened={changeIsMenuOpened}
          />
          <Logout logout={logout} />
        </div>
      </div>
    </div>
  );
};
