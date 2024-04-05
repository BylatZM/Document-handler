import { FC } from 'react';
import { IApplication } from '../../../../../../types';
import { Input } from 'antd';

interface IProps {
  form_id: number;
  data: IApplication;
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
}

export const Contact: FC<IProps> = ({ data, changeFormData, form_id }) => {
  return (
    <>
      <div className='w-full md:w-[48%] gap-2 flex flex-col'>
        <span>Номер телефона заявителя</span>
        <Input
          className='w-full h-[50px] text-base'
          type='text'
          onChange={(e) => {
            changeFormData((prev) => ({
              ...prev,
              contact:
                !e.target.value || (e.target.value.length < 3 && e.target.value !== '+7')
                  ? '+7'
                  : e.target.value,
            }));
          }}
          maxLength={20}
          placeholder='+79372833608'
          value={data.contact}
          disabled={form_id > 0 ? true : false}
        />
      </div>
    </>
  );
};
