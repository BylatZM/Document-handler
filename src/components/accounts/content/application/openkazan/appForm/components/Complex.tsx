import { Input, Select } from 'antd';
import { FC } from 'react';
import { IComplex } from '../../../../../../types';

export const Complex: FC<{ complex: IComplex | null }> = ({ complex }) => {
  return (
    <div className='w-full md:w-[48%] gap-2 flex flex-col'>
      <span>Жилищный комплекс</span>
      {complex && (
        <Select
          className='w-full h-[50px]'
          disabled
          value={complex.id}
          options={[{ label: complex.name, value: complex.id }]}
        />
      )}
      {!complex && <Input className='w-full h-[50px] text-base' value={'—'} disabled />}
    </div>
  );
};
