import { Select } from 'antd';
import { FC } from 'react';

export const Grade: FC<{ form_id: number }> = ({ form_id }) => {
  return (
    <>
      {form_id > 0 && (
        <div className='w-[48%] gap-2 flex flex-col'>
          <span>Класс заявки</span>
          <Select value={1} disabled options={[{ value: 1, label: 'Клиентская' }]} />
        </div>
      )}
    </>
  );
};
