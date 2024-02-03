import { Select } from 'antd';

export const SubType = () => {
  return (
    <div className='w-[48%] gap-2 flex flex-col'>
      <span>Подтип заявки</span>
      <Select disabled options={[]} />
    </div>
  );
};
