import { Select } from 'antd';
import { FC } from 'react';
import { IApplication, IRole, ISubType } from '../../../../../types';

interface IProps {
  data: IApplication;
  changeData: React.Dispatch<React.SetStateAction<IApplication>>;
  subTypes: ISubType[];
  form_id: number;
  role: IRole;
}

export const SubType: FC<IProps> = ({ data, changeData, subTypes, form_id, role }) => {
  return (
    <div className='w-[48%] gap-2 flex flex-col'>
      <span>Подтип заявки</span>
      {role === 'executor' && data.subType && (
        <Select
          disabled
          value={data.subType.id}
          options={[
            {
              value: data.subType.id,
              label: data.subType.subType,
            },
          ]}
        />
      )}
      {role === 'dispatcher' && (
        <Select
          disabled={
            !subTypes.length ||
            (data.status &&
              form_id > 0 &&
              data.status.appStatus !== 'Новая' &&
              data.status.appStatus !== 'Назначена' &&
              data.status.appStatus !== 'Возвращена')
              ? true
              : false
          }
          value={!data.subType ? undefined : data.subType.id}
          onChange={(e: number) => {
            if (!subTypes.length) return;
            const subType = subTypes.filter((el) => el.id === e)[0];
            changeData((prev) => ({ ...prev, subType: { ...subType } }));
          }}
          options={
            !subTypes
              ? []
              : subTypes.map((el) => ({
                  value: el.id,
                  label: el.subType,
                }))
          }
        />
      )}
      {role === 'citizen' && (
        <Select
          disabled={
            !subTypes.length ||
            (role === 'citizen' && form_id > 0) ||
            (data.status &&
              form_id > 0 &&
              data.status.appStatus !== 'Новая' &&
              data.status.appStatus !== 'Назначена' &&
              data.status.appStatus !== 'Возвращена')
              ? true
              : false
          }
          value={!data.subType ? undefined : data.subType.id}
          onChange={(e: number) => {
            if (!subTypes.length) return;
            const subType = subTypes.filter((el) => el.id === e)[0];
            changeData((prev) => ({ ...prev, subType: { ...subType } }));
          }}
          options={
            !subTypes
              ? []
              : subTypes.map((el) => ({
                  value: el.id,
                  label: el.subType,
                }))
          }
        />
      )}
    </div>
  );
};
