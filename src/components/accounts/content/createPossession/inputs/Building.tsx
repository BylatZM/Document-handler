import { Select } from 'antd';
import { FC } from 'react';
import { IApprovePossession, IBuilding } from '../../../../types';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';

interface IProps {
  data: IApprovePossession;
  changeData: React.Dispatch<React.SetStateAction<IApprovePossession>>;
  buildings: IBuilding[];
}

export const Building: FC<IProps> = ({ data, changeData, buildings }) => {
  const { isLoading } = useTypedSelector((state) => state.PossessionReducer);
  return (
    <div className='text-sm'>
      <div>Адресс здания</div>
      <Select
        className='w-full h-[40px] max-sm:h-[30px]'
        disabled={!data.complex || isLoading === 'buildings' || !buildings.length ? true : false}
        loading={isLoading === 'buildings' ? true : false}
        value={!data.building ? undefined : data.building}
        onChange={(e: number) => changeData((prev) => ({ ...prev, building: e }))}
        options={buildings.map((el) => ({ value: el.id, label: el.address }))}
      />
    </div>
  );
};
