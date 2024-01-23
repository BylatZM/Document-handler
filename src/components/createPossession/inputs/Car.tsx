import { FC } from 'react';
import { IApprovePossession, IError } from '../../types';
import { Input } from 'antd';

interface IProps {
  data: IApprovePossession;
  changeData: React.Dispatch<React.SetStateAction<IApprovePossession>>;
  error: IError | null;
}

export const Car: FC<IProps> = ({ data, changeData, error }) => {
  const ConverterToString = (field: string | null): string => {
    if (!field) return '';

    return field;
  };

  return (
    <>
      <div className='text-sm'>
        <div>Марка автомобиля</div>
        <Input
          maxLength={25}
          value={!data.possession.car ? '' : data.possession.car.car_brand}
          disabled={!data.building}
          placeholder='Audi'
          onChange={(e) =>
            changeData((prev) => ({
              ...prev,
              possession: {
                ...prev.possession,
                car: !prev.possession.car
                  ? null
                  : { ...prev.possession.car, car_brand: e.target.value },
              },
            }))
          }
        />
      </div>
      <div className='text-sm'>
        <div>Модель автомобиля</div>
        <Input
          maxLength={25}
          value={!data.possession.car ? '' : ConverterToString(data.possession.car.car_model)}
          disabled={!data.building}
          placeholder='A8'
          onChange={(e) =>
            changeData((prev) => ({
              ...prev,
              possession: {
                ...prev.possession,
                car: !prev.possession.car
                  ? null
                  : { ...prev.possession.car, car_model: e.target.value },
              },
            }))
          }
        />
      </div>
      <div className='text-sm'>
        <div>Гос. номер</div>
        <Input
          maxLength={25}
          value={!data.possession.car ? '' : ConverterToString(data.possession.car.state_number)}
          disabled={!data.building}
          placeholder='A001AA77RUS'
          onChange={(e) =>
            changeData((prev) => ({
              ...prev,
              possession: {
                ...prev.possession,
                car: !prev.possession.car
                  ? null
                  : { ...prev.possession.car, state_number: e.target.value },
              },
            }))
          }
        />
        {error && error.type === 'state_number' && <div className='errorText'>{error.error}</div>}
      </div>
    </>
  );
};
