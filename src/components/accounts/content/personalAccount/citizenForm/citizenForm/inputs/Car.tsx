import { Input } from 'antd';
import { FC } from 'react';
import { ICar } from '../../../../../../types';

export const Car: FC<{ car: ICar }> = ({ car }) => {
  return (
    <>
      <div className='mt-2 mb-2 text-sm'>
        <span>Марка автомобиля</span>
        <Input disabled value={car.car_brand} />
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span>Модель автомобиля</span>
        <Input disabled value={car.car_model ? car.car_model : ''} />
      </div>
      <div className='mt-2 mb-2 text-sm'>
        <span>Гос. номер</span>
        <Input disabled value={car.state_number ? car.state_number : ''} />
      </div>
    </>
  );
};
