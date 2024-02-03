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
      <span>Описание заявки (по возможности укажите контактные данные)</span>
      <TextArea
        rows={5}
        maxLength={500}
        value={data.citizenComment}
        onChange={(e) => changeFormData((prev) => ({ ...prev, citizenComment: e.target.value }))}
        className='rounded-md h-[60px]'
        disabled={
          role.role === 'executor' ||
          (role.role === 'citizen' && form_id > 0) ||
          (data.status &&
            form_id > 0 &&
            data.status.appStatus !== 'Новая' &&
            data.status.appStatus !== 'Назначена' &&
            data.status.appStatus !== 'Возвращена')
            ? true
            : false
        }
        style={{ resize: 'none' }}
      />
    </div>
  );
};
