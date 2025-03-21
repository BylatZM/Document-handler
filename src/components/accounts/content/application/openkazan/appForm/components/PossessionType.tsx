import { Input } from 'antd';

export const PossessionType = () => {
  return (
    <div className='flex flex-col gap-2 w-full md:w-[48%]'>
      <span>Тип имущества</span>
      <Input
        className='w-full h-[50px] text-base'
        disabled
        value="квартира"
      />
    </div>
  );
};
