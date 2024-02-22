import { FC } from 'react';
import { IApplication, IRole } from '../../../../../types';
import { Input } from 'antd';

interface IProps {
  form_id: number;
  data: IApplication;
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
  role: IRole;
}

export const CitizenFio: FC<IProps> = ({ data, changeFormData, role, form_id }) => {
  return (
    <>
      <div className='flex flex-col gap-2 w-[48%]'>
        <span>Заявитель</span>
        <Input
          className='w-full'
          type='text'
          placeholder='Закиров Булат Маратович'
          maxLength={100}
          onChange={(e) => {
            changeFormData((prev) => ({
              ...prev,
              citizenFio: e.target.value.replace(/[^а-яА-Я\s]/g, '').replace(/\s\s/g, ' '),
            }));
          }}
          value={data.citizenFio}
          disabled={role === 'executor' || form_id > 0 ? true : false}
        />
      </div>
    </>
  );
};
