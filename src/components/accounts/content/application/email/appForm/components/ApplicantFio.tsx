import { FC } from 'react';
import { Input } from 'antd';

export const ApplicantFio: FC<{ applicant_fio: string }> = ({ applicant_fio }) => {
  return (
    <>
      <div className='w-full md:w-[48%] gap-2 flex flex-col'>
        <span>Заявитель</span>
        <Input
          className='w-full h-[50px] text-base'
          placeholder='Закиров Булат Маратович'
          value={applicant_fio}
          disabled
        />
      </div>
    </>
  );
};
