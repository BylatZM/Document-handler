import TextArea from 'antd/es/input/TextArea';
import { FC } from 'react';
import { IApplication, IRole } from '../../../../../types';

interface IProps {
  form_id: number;
  role: IRole;
  data: IApplication;
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
}

export const CitizenComment: FC<IProps> = ({ form_id, role, data, changeFormData }) => {
  return (
    <div className='mt-2 gap-2 flex flex-col'>
      <span>Описание заявки</span>
      <TextArea
        rows={5}
        maxLength={500}
        value={data.citizenComment}
        onChange={(e) => changeFormData((prev) => ({ ...prev, citizenComment: e.target.value }))}
        className='rounded-md h-[60px]'
        disabled={role === 'executor' || form_id > 0 ? true : false}
        style={{ resize: 'none' }}
      />
    </div>
  );
};
