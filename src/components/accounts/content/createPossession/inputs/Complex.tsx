import { Select } from 'antd';
import { IApprovePossession, IComplex } from '../../../../types';
import { FC } from 'react';

interface IProps {
  complexes: IComplex[];
  getBuildings: (complex_id: string) => Promise<void>;
  data: IApprovePossession;
  changeData: React.Dispatch<React.SetStateAction<IApprovePossession>>;
}

export const Complex: FC<IProps> = ({ complexes, getBuildings, data, changeData }) => {
  return (
    <div className='text-sm'>
      <div>Жилой комплекс</div>
      <Select
        className='w-full'
        value={!data.complex ? undefined : data.complex}
        onChange={(e: number) => {
          changeData((prev) => ({ ...prev, complex: e, building: 0 }));
          getBuildings(e.toString());
        }}
        options={complexes.map((el) => ({ value: el.id, label: el.name }))}
      />
    </div>
  );
};
