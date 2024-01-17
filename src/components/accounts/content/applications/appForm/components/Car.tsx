import { Input } from 'antd';
import { FC } from 'react';
import { ICar } from '../../../../../types';

export const Car: FC<{ car: ICar }> = ({ car }) => {
  return (
    <>
      <div className='w-[48%] mt-2 gap-2 flex flex-col'>
        <span>Марка автомобиля</span>
        <Input disabled value={car.car_brand} />
      </div>
      <div className='w-[48%] mt-2 gap-2 flex flex-col'>
        <span>Модель автомобиля</span>
        <Input disabled value={!car.car_model ? '' : car.car_model} />
      </div>
      <div className='w-[48%] mt-2 gap-2 flex flex-col'>
        <span>Гос. номер</span>
        <Input disabled value={!car.state_number ? '' : car.state_number} />
      </div>
    </>
  );
};
