import { useEffect, useState, FC } from 'react';
import Styles from './Main.module.scss';
import clsx from 'clsx';
import { Auth } from './authorization/Auth';
import { Reg } from './registration/Reg';
import { CarouselBlock } from './CarouselBlock';
import { HelpForm } from '../help_form/HelpForm';
import { Checkbox, ConfigProvider } from 'antd';
import { DotsEffect } from '../dotsAnimation/DotsEffect';
import { UpdatePassword } from '../UpdatePassword';
import cat from '../../assets/images/cat.png';

interface IMainProps {
  pageType: 'auth' | 'reg';
}

export const Main: FC<IMainProps> = ({ pageType }) => {
  const [isAnimActive, changeAnimState] = useState(false);
  const [activeForm, changeActiveForm] = useState<null | 'password' | 'help'>(null);
  const [isAgrChecked, ChangeAgrChecked] = useState(true);

  useEffect(() => {
    changeAnimState(true);
  }, [pageType]);

  return (
    <div className={Styles.main}>
      <div
        className={clsx(
          'transitionGeneral fixed inset-0 bg-blue-700 bg-opacity-10 backdrop-blur-xl z-[20]',
          activeForm ? 'w-full' : 'w-0',
        )}
      ></div>
      <HelpForm activeForm={activeForm} changeActiveForm={changeActiveForm} />
      <UpdatePassword activeForm={activeForm} changeActiveForm={changeActiveForm} />
      <div className={clsx(Styles.form, isAnimActive && Styles.form_active)}>
        <div className='absolute inset-x-0 top-0 w-11/12 mx-auto'>
          <div className='h-min flex items-center gap-4 logoGrid'>
            <img src={cat} className='h-auto ' width={'70px'} alt='' />
            <div className='flex flex-col items-end overflow-hidden text-white'>
              <span className='text-xs w-max leading-4'>Управляющая компания</span>
              <span className='text-3xl leading-6'>Миллениум</span>
            </div>
          </div>
        </div>
        <div className='w-11/12 mx-auto'>
          {pageType === 'auth' && (
            <Auth
              changeAnimState={changeAnimState}
              isAgrChecked={isAgrChecked}
              changeActiveForm={changeActiveForm}
            />
          )}
          {pageType === 'reg' && (
            <Reg changeAnimState={changeAnimState} isAgrChecked={isAgrChecked} />
          )}

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
              onChange={() => ChangeAgrChecked(!isAgrChecked)}
              checked={!isAgrChecked}
            >
              Я принимаю пользовательское соглашение и даю разрешение порталу на обработку моих
              персональных данных в соотвествии с Федеральным законом №152-ФЗ от 27.07.2006 года “О
              персональных данных”
            </Checkbox>
          </ConfigProvider>
        </div>
        <span
          className='absolute inset-x-0 bottom-2 text-center text-blue-700 cursor-pointer'
          onClick={() => changeActiveForm('help')}
        >
          Написать в техподдержку
        </span>
      </div>
      <div className={Styles.carouselSection}>
        <DotsEffect dotsQuantity={10} />
        <CarouselBlock showAnimation={isAnimActive} />
      </div>
    </div>
  );
};
