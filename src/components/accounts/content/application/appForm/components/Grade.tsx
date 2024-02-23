import { Select } from 'antd';
import { FC } from 'react';

export const Grade: FC<{ form_id: number }> = ({ form_id }) => {
  return (
    <div className='w-full md:w-[48%] gap-2 flex flex-col'>
      <span>Класс заявки</span>
      <Select
        className='h-[50px]'
        value={1}
        disabled
        options={[{ value: 1, label: 'Клиентская' }]}
      />
    </div>
  );
};
