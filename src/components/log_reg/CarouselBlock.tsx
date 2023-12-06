import { Carousel, ConfigProvider } from 'antd';
import Styles from './Main.module.scss';
import clsx from 'clsx';
import React, { FC } from 'react';

interface ICarouselProps {
  showAnimation: boolean;
}

export const CarouselBlock: FC<ICarouselProps> = React.memo(({ showAnimation }) => {
  return (
    <div className='flex self-center mx-auto w-[52rem] h-[30rem] justify-center'>
      <ConfigProvider
        theme={{
          components: {
            Carousel: {
              dotWidth: 64,
              dotActiveWidth: 64,
              colorBgContainer: '#85d1eb',
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
              <span>Тут просто и удобно:</span>
              <ul>
                <li className={Styles.list_items}>Оплачивать услуги ЖКХ</li>
                <li className={Styles.list_items}>Подавать показания приборов учета</li>
                <li className={Styles.list_items}>Отслеживать начисления и платежи</li>
              </ul>
            </div>
          </div>
          <div>
            <div className={Styles.carouselItem}>
              <span>Оставляйте обращения по проблемам ЖКХ</span>
              <p>
                Оставляйте обращения по проблемам в сфере ЖКХ и отслеживайте ход выполнения работ по
                ним в своем личном кабинете
              </p>
            </div>
          </div>
          <div>
            <div className={Styles.carouselItem}>
              <span>Узнавайте об отключениях услуг ЖКХ</span>
              <p>
                Узнавайте о текущих и планируемых отключениях услуг ЖКХ в вашем доме с помощью
                личного кабинета
              </p>
            </div>
          </div>
          <div>
            <div className={Styles.carouselItem}>
              <span>Подавайте показания приборов учета</span>
              <p>
                Передавайте показания приборов учета без совершения платежа быстро и вовремя. Мы
                напомним о времени приема показаний и необходимости поверки счетчика
              </p>
            </div>
          </div>
        </Carousel>
      </ConfigProvider>
    </div>
  );
});
