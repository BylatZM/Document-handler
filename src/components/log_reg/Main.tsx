import { useEffect, useState, FC } from 'react';
import Styles from './Main.module.scss';
import clsx from 'clsx';
import { Auth } from './authorization/Auth';
import { Reg } from './registration/Reg';
import { CarouselBlock } from './CarouselBlock';
import { HelpForm } from './help_form/HelpForm';
import { Checkbox, ConfigProvider } from 'antd';

interface IMainProps {
  pageType: 'auth' | 'reg';
}

export const Main: FC<IMainProps> = ({ pageType }) => {
  const [isAnimActive, changeAnimState] = useState(false);
  const [showHelpForm, changeShowForm] = useState(false);
  const [isAgrChecked, ChangeAgrChecked] = useState(true);

  useEffect(() => {
    changeAnimState(true);
  }, [pageType]);

  return (
    <div className={Styles.main}>
      <div className={clsx(Styles.formCurtain, showHelpForm && Styles.formCurtain_active)}></div>
      <HelpForm showHelpForm={showHelpForm} changeShowForm={changeShowForm} />
      <div className={clsx(Styles.form, isAnimActive && Styles.form_active)}>
        {pageType === 'auth' && (
          <Auth changeAnimState={changeAnimState} isAgrChecked={isAgrChecked} />
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
            className='w-11/12 mx-auto text-left text-gray-400 text-xs'
            onChange={() => ChangeAgrChecked(!isAgrChecked)}
            value={isAgrChecked}
          >
            Я принимаю пользовательское соглашение и даю разрешение порталу на обработку моих
            персональных данных в соотвествии с Федеральным законом №152-ФЗ от 27.07.2006 года “О
            персональных данных”"
          </Checkbox>
        </ConfigProvider>

        <span
          className='absolute inset-x-0 bottom-4 text-center text-blue-700 cursor-pointer'
          onClick={() => changeShowForm(!showHelpForm)}
        >
          Написать в техподдержку
        </span>
      </div>
      <div className={Styles.carouselSection}>
        <CarouselBlock showAnimation={isAnimActive} />
        <div className={Styles.bubbles}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};
