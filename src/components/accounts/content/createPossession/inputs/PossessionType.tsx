import { Select } from 'antd';
import { IApprovePossession, ICar } from '../../../../types';
import { FC } from 'react';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';

interface IProps {
  data: IApprovePossession;
  changeData: React.Dispatch<React.SetStateAction<IApprovePossession>>;
  defaultCar: ICar;
}

export const PossessionType: FC<IProps> = ({ data, changeData, defaultCar }) => {
  const { role } = useTypedSelector((state) => state.UserReducer.user);
  return (
    <div className='text-sm'>
      <span>Тип имущества</span>
      <Select
        className='w-full'
        options={
          role.role === 'citizen'
            ? [
                { label: 'квартира', value: 1 },
                { label: 'коммерческое помещение', value: 2 },
                { label: 'кладовка', value: 4 },
              ]
            : [
                { label: 'квартира', value: 1 },
                { label: 'коммерческое помещение', value: 2 },
                { label: 'кладовка', value: 4 },
                { label: 'жилищный комплекс', value: 5 },
              ]
        }
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
