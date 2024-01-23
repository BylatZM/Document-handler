import { Select } from 'antd';
import { IApprovePossession, ICar } from '../../types';
import { FC } from 'react';

interface IProps {
  data: IApprovePossession;
  changeData: React.Dispatch<React.SetStateAction<IApprovePossession>>;
  defaultCar: ICar;
}

export const PossessionType: FC<IProps> = ({ data, changeData, defaultCar }) => {
  return (
    <div className='text-sm'>
      <span>Тип имущества</span>
      <Select
        className='w-full'
        options={[
          { label: 'квартира', value: 1 },
          { label: 'офис', value: 2 },
          { label: 'кладовка', value: 4 },
          { label: 'парковка', value: 3 },
        ]}
        value={data.type}
        onChange={(e: number) =>
          changeData((prev) => ({
            ...prev,
            type: e,
            possession: {
              ...prev.possession,
              car: e === 3 ? defaultCar : null,
            },
          }))
        }
      />
    </div>
  );
};
