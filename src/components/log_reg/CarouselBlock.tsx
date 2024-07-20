import { Carousel, ConfigProvider } from 'antd';
import './Main.css';
import clsx from 'clsx';
import React, { FC } from 'react';

interface ICarouselProps {
  showAnimation: boolean;
}

export const CarouselBlock: FC<ICarouselProps> = React.memo(({ showAnimation }) => {
  return (
    <div className='flex self-center mx-auto w-[52rem] h-[30rem] justify-center items-center backdrop-blur-md bg-opacity-10 z-10'>
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
          className={clsx(
            'main_form_carouselSection_carousel',
            showAnimation && 'main_form_carouselSection_carousel_active',
          )}
          autoplaySpeed={10000}
        >
          <div>
            <div className='form_carouselSection_carousel_item'>
              <span className='carouselSection_carousel_item_span'>Зарегистрируйтесь</span>
              <ul className='carouselSection_carousel_item_ul'>
                <li className='carouselSection_carousel_item_li'>Перейдите на форму регистрации</li>
                <li className='carouselSection_carousel_item_li'>Укажите Вашу действующую почту</li>
                <li className='carouselSection_carousel_item_li'>
                  Дайте согласие на обработку персональных данных
                </li>
                <li className='carouselSection_carousel_item_li'>
                  Нажмите на кнопку "Зарегистрироваться"
                </li>
                <li className='carouselSection_carousel_item_li'>
                  Откройте действующую электронную почту
                  <br />и посмотрите Ваш логин и пароль
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div className='form_carouselSection_carousel_item'>
              <span className='carouselSection_carousel_item_span'>Войдите в личный кабинет</span>
              <ul className='carouselSection_carousel_item_ul'>
                <li className='carouselSection_carousel_item_li'>
                  Укажите номер телефона, фамилию, имя, отчество (при наличии)
                </li>
                <li className='carouselSection_carousel_item_li'>Добавьте собственность</li>
                <li className='carouselSection_carousel_item_li'>
                  Дождитесь подтверждения аккаунта от диспетчера
                  <br />
                  (уведомление будет выслано на Вашу почту)
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div className='form_carouselSection_carousel_item'>
              <span className='carouselSection_carousel_item_span'>Создайте заявку</span>
              <ul className='carouselSection_carousel_item_ul'>
                <li className='carouselSection_carousel_item_li'>
                  Убедитесь, что аккаунт был подтвержден диспетчером
                </li>
                <li className='carouselSection_carousel_item_li'>Откройте меню</li>
                <li className='carouselSection_carousel_item_li'>Нажмите на кнопку "Заявки"</li>
                <li className='carouselSection_carousel_item_li'>Нажмите на кнопку "+"</li>
                <li className='carouselSection_carousel_item_li'>Направьте заявку</li>
                <li className='carouselSection_carousel_item_li'>Отслеживайте ее движение</li>
              </ul>
            </div>
          </div>
        </Carousel>
      </ConfigProvider>
    </div>
  );
});
