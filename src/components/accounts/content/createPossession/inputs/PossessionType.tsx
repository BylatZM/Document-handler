import { Select } from 'antd';
import { IApprovePossession } from '../../../../types';
import { FC } from 'react';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';

interface IProps {
  data: IApprovePossession;
  changeData: React.Dispatch<React.SetStateAction<IApprovePossession>>;
}

export const PossessionType: FC<IProps> = ({ data, changeData }) => {
  const { role } = useTypedSelector((state) => state.UserReducer.user);
  return (
    <div className='text-sm'>
      <span>Тип имущества</span>
      <Select
        className='h-[50px] sm:h-[30px] w-full'
        options={
          role === 'citizen'
            ? [
                { label: 'квартира', value: 1 },
                { label: 'коммерческое помещение', value: 2 },
                { label: 'парковка', value: 3 },
                { label: 'кладовка', value: 4 },
              ]
            : [
                { label: 'квартира', value: 1 },
                { label: 'коммерческое помещение', value: 2 },
                { label: 'парковка', value: 3 },
                { label: 'кладовка', value: 4 },
                { label: 'жилищный комплекс', value: 5 },
              ]
        }
        value={data.type}
        onChange={(e: number) =>
          changeData((prev) => ({
            ...prev,
            type: e,
          }))
        }
      />
    </div>
  );
};
