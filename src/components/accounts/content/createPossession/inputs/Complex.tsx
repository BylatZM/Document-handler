import { Select } from 'antd';
import { IApprovePossession, IBuilding, IComplex } from '../../../../types';
import { FC } from 'react';

interface IProps {
  complexes: IComplex[];
  getAllBuildingsByComplexId: (complex_id: string) => Promise<IBuilding[] | void>;
  data: IApprovePossession;
  changeData: React.Dispatch<React.SetStateAction<IApprovePossession>>;
}

export const Complex: FC<IProps> = ({
  complexes,
  getAllBuildingsByComplexId,
  data,
  changeData,
}) => {
  return (
    <div className='text-sm'>
      <div>Жилой комплекс</div>
      <Select
        className='h-[40px] max-sm:h-[30px] w-full'
        value={!data.complex ? undefined : data.complex}
        onChange={(e: number) => {
          changeData((prev) => ({ ...prev, complex: e, building: 0 }));
          getAllBuildingsByComplexId(e.toString());
        }}
        options={complexes.map((el) => ({ value: el.id, label: el.name }))}
      />
    </div>
  );
};
