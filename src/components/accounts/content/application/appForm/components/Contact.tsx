import { FC } from 'react';
import { IApplication, IRole } from '../../../../../types';
import { Input } from 'antd';

interface IProps {
  form_id: number;
  data: IApplication;
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
  role: IRole;
}

export const Contact: FC<IProps> = ({ data, changeFormData, role, form_id }) => {
  return (
    <>
      <div className='flex flex-col gap-2 w-[48%]'>
        <span>Номер телефона заявителя</span>
        <Input
          className='w-full'
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
          disabled={role === 'executor' || form_id > 0 ? true : false}
        />
      </div>
    </>
  );
};
