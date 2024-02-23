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
      <div className='w-full md:w-[48%] gap-2 flex flex-col'>
        <span>Заявитель</span>
        <Input
          className='w-full h-[50px]'
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
