import { useEffect, useState, FC } from 'react';
import Styles from './Main.module.scss';
import clsx from 'clsx';
import { Auth } from './authorization/Auth';
import { Reg } from './registration/Reg';
import { CarouselBlock } from './CarouselBlock';
import { HelpForm } from '../accounts/content/helpForm/HelpForm';
import { Checkbox, ConfigProvider } from 'antd';
import { DotsEffect } from '../dotsAnimation/DotsEffect';
import { UpdatePassword } from './updatePassword/UpdatePassword';
import cat from '../../assets/images/cat.png';
import { SendEmail } from './registration/SendEmail';
import { useTypedSelector } from '../hooks/useTypedSelector';

interface IMainProps {
  pageType: 'auth' | 'reg';
}

export const Main: FC<IMainProps> = ({ pageType }) => {
  const { email } = useTypedSelector((state) => state.RegReducer);
  const [isAnimActive, changeAnimState] = useState(false);
  const [needShowPasswordForm, changeNeedShowPasswordForm] = useState(false);
  const [needShowHelpForm, changeNeedShowHelpForm] = useState(false);
  const [isAgreementChecked, changeIsAgreementChecked] = useState(false);
  const [needShowSendEmailForm, changeNeedShowSendEmailForm] = useState(false);

  useEffect(() => {
    changeAnimState(true);
  }, [pageType]);

  useEffect(() => {
    if (localStorage.getItem('personal_agreement') === null) {
      changeIsAgreementChecked(false);
    } else {
      changeIsAgreementChecked(true);
    }
  }, [pageType, needShowHelpForm]);

  return (
    <div className={Styles.main}>
      <DotsEffect dotsQuantity={10} />
      <SendEmail
        email={email}
        needShowForm={needShowSendEmailForm}
        changeNeedShowForm={changeNeedShowSendEmailForm}
      />
      <HelpForm needShowForm={needShowHelpForm} changeNeedShowForm={changeNeedShowHelpForm} />
      <UpdatePassword
        needShowForm={needShowPasswordForm}
        changeNeedShowForm={changeNeedShowPasswordForm}
      />
      <div className={clsx(Styles.form, isAnimActive && Styles.form_active)}>
        <div className='w-11/12 mx-auto flex items-start mt-3'>
          <div className='logoGrid h-[70px] flex items-center'>
            <img src={cat} width={'70px'} alt='' />
          </div>
        </div>
        <div className='w-11/12 mx-auto'>
          {pageType === 'auth' && (
            <Auth
              changeAnimState={changeAnimState}
              isAgreementChecked={isAgreementChecked}
              changeNeedShowPasswordForm={changeNeedShowPasswordForm}
            />
          )}
          {pageType === 'reg' && (
            <Reg
              changeAnimState={changeAnimState}
              isAgreementChecked={isAgreementChecked}
              changeNeedShowSendEmailForm={changeNeedShowSendEmailForm}
            />
          )}

          {!isAgreementChecked && (
            <ConfigProvider
              theme={{
                components: {
                  Checkbox: {
                    colorBorder: '#9fa6b1',
                  },
                },
              }}
            >
              <Checkbox
                className='w-full text-left text-gray-400 text-xs'
                onChange={() => {
                  localStorage.setItem('personal_agreement', 'true');
                  changeIsAgreementChecked(true);
                }}
              >
                Я принимаю пользовательское соглашение и даю разрешение порталу на обработку моих
                персональных данных в соотвествии с Федеральным законом №152-ФЗ от 27.07.2006 года
                “О персональных данных”
              </Checkbox>
            </ConfigProvider>
          )}
        </div>
        <button
          className='outline-none border-none mb-2 text-blue-700'
          onClick={() => changeNeedShowHelpForm(true)}
        >
          Написать в техподдержку
        </button>
      </div>
      <div className={Styles.carouselSection}>
        <CarouselBlock showAnimation={isAnimActive} />
      </div>
    </div>
  );
};
