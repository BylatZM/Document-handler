import { Select } from 'antd';
import { FC } from 'react';
import { IApprovePossession, IPossession } from '../../../../types';

interface IProps {
  data: IApprovePossession;
  changeData: React.Dispatch<React.SetStateAction<IApprovePossession>>;
  buildings: IPossession[] | null;
}

export const Building: FC<IProps> = ({ data, changeData, buildings }) => {
  return (
    <div className='text-sm'>
      <div>Адресс здания</div>
      <Select
        className='w-full'
        disabled={!data.complex}
        value={!data.building ? undefined : data.building}
        onChange={(e: number) => changeData((prev) => ({ ...prev, building: e }))}
        options={!buildings ? [] : buildings.map((el) => ({ value: el.id, label: el.address }))}
      />
    </div>
  );
};
