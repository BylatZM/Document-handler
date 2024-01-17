import { Select } from 'antd';

export const Grade = () => {
  return (
    <div className='w-[48%] gap-2 flex flex-col'>
      <span>Класс заявки</span>
      <Select value={1} disabled options={[{ value: 1, label: 'Клиентская' }]} />
    </div>
  );
};
