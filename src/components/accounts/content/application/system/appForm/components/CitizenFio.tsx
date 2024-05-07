import { FC } from 'react';
import { IApplication } from '../../../../../../types';
import { Input } from 'antd';

interface IProps {
  form_id: number;
  data: IApplication;
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
}

export const CitizenFio: FC<IProps> = ({ data, changeFormData, form_id }) => {
  return (
    <>
      <div className='w-full md:w-[48%] gap-2 flex flex-col'>
        <span>Заявитель</span>
        <Input
          className='w-full h-[50px] text-base'
          type='text'
          placeholder='Закиров Булат Маратович'
          maxLength={100}
          onChange={(e) => {
            changeFormData((prev) => ({
              ...prev,
              applicant_fio: e.target.value.replace(/[^а-яА-Я\s]/g, '').replace(/\s\s/g, ' '),
            }));
          }}
          value={data.applicant_fio}
          disabled={form_id > 0 ? true : false}
        />
      </div>
    </>
  );
};
