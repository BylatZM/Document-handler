import { Carousel, ConfigProvider } from 'antd';
import Styles from './Main.module.scss';
import clsx from 'clsx';
import React, { FC } from 'react';

interface ICarouselProps {
  showAnimation: boolean;
}

export const CarouselBlock: FC<ICarouselProps> = React.memo(({ showAnimation }) => {
  return (
    <div className='flex self-center mx-auto w-[52rem] h-[30rem] justify-center backdrop-blur-md bg-opacity-10 z-10'>
      <ConfigProvider
        theme={{
          components: {
            Carousel: {
              dotWidth: 64,
              dotActiveWidth: 64,
              colorBgContainer: '#2d5adb',
            },
          },
        }}
      >
        <Carousel
          autoplay
          className={clsx(Styles.carousel, showAnimation && Styles.carousel_active)}
          autoplaySpeed={10000}
        >
          <div>
            <div className={Styles.carouselItem}>
              <span>Зарегистрируйтесь</span>
              <ul>
                <li>Перейдите на форму регистрации</li>
                <li>Укажите вашу действующую почту</li>
                <li>Дайте согласие на обработку персональных данных</li>
                <li>Нажмите на кнопку зарегистрироваться</li>
                <li>Откройте электронную почту и посмотрите ваш логин и пароль</li>
              </ul>
            </div>
          </div>
          <div>
            <div className={Styles.carouselItem}>
              <span>Войдите в личный кабинет</span>
              <ul>
                <li>Задайте собственность</li>
                <li>Укажите номер телефона, фамилию, имя, отчество (при наличии)</li>
                <li>Дождитесь подтверждения аккаунта от диспетчера</li>
              </ul>
            </div>
          </div>
          <div>
            <div className={Styles.carouselItem}>
              <span>Создайте заявку</span>
              <ul>
                <li>Убедитесь, что аккаунт был подтвержден диспетчером</li>
                <li>Откройте меню</li>
                <li>Нажмите на кнопку "Заявки"</li>
                <li>Нажмите на кнопку "+"</li>
                <li>Задайте данные</li>
                <li>Создайте заявку</li>
                <li>Отслеживайте ее движение</li>
              </ul>
            </div>
          </div>
        </Carousel>
      </ConfigProvider>
    </div>
  );
});
