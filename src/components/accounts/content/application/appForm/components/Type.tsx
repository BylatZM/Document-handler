import { Select } from 'antd';
import { FC } from 'react';
import { IApplication, IRole, IType } from '../../../../../types';

interface IProps {
  form_id: number;
  role: IRole;
  data: IApplication;
  types: IType[] | null;
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
}

export const Type: FC<IProps> = ({ form_id, role, data, types, changeFormData }) => {
  return (
    <div className='w-[48%] gap-2 flex flex-col'>
      <span>Тип заявки</span>
      {types && (
        <Select
          value={!data.type.id ? undefined : data.type.id}
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
          onChange={(e: number) =>
            changeFormData((prev) => ({
              ...prev,
              type: { id: e, appType: types.filter((el) => el.id === e)[0].appType },
            }))
          }
          options={types.map((el) => ({
            value: el.id,
            label: el.appType,
          }))}
        />
      )}
    </div>
  );
};
