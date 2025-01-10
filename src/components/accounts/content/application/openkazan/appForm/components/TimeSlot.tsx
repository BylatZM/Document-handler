import { Input } from 'antd';
import { FC } from 'react';
import { IOpenKazanApplication } from '../../../../../../types';

interface IProps {
  data: IOpenKazanApplication;
}

export const TimeSlot: FC<IProps> = ({ data }) => {

  return (
    <div className='flex flex-col gap-y-2'>
      <span className='font-bold text-lg mt-2'>Промежутки времени</span>
      <div className='flex max-md:flex-col max-md:flex-nowrap flex-wrap gap-y-2 justify-between'>
        <div className='flex flex-col gap-2 max-md:w-full w-[48%]'>
          <span>Плановая дата поступления заявки</span>
          <Input
            className='h-[50px] text-base'
            value={!data.created_date ? '' : data.created_date}
            disabled
          />
        </div>
        <div className='flex flex-col gap-2 max-md:w-full w-[48%]'>
          <span>Фактическая дата исполнения</span>
          <Input
            className='h-[50px] text-base'
            value={data.due_date ?? ''}
            disabled
          />
        </div>
        <div className='flex flex-col gap-2 w-[48%] max-md:w-full'>
          <span>Плановая дата исполнения</span>
          <Input
            className='h-[50px] text-base'
            value={!data.deadline ? '' : data.deadline}
            disabled
          />
        </div>
      </div>
    </div>
  );
};
