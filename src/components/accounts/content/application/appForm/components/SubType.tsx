import { Select } from 'antd';
import { FC } from 'react';
import { IApplication, IRole, ISubtype } from '../../../../../types';

interface IProps {
  data: IApplication;
  changeData: React.Dispatch<React.SetStateAction<IApplication>>;
  subtypes: ISubtype[];
  form_id: number;
  role: IRole;
}

export const Subtype: FC<IProps> = ({ data, changeData, subtypes, form_id, role }) => {
  return (
    <div className='w-full md:w-[48%] gap-2 flex flex-col'>
      <span>Подтип заявки</span>
      {role === 'executor' && data.subtype && (
        <Select
          className='h-[50px]'
          disabled
          value={data.subtype.id}
          options={[
            {
              value: data.subtype.id,
              label: data.subtype.subtype,
            },
          ]}
        />
      )}
      {role === 'dispatcher' && (
        <Select
          className='h-[50px]'
          disabled={
            !subtypes.length ||
            (data.status &&
              form_id > 0 &&
              (data.status.appStatus === 'В работе' || data.status.appStatus === 'Закрыта'))
              ? true
              : false
          }
          value={!data.subtype ? undefined : data.subtype.id}
          onChange={(e: number) => {
            if (!subtypes.length) return;
            const subtype = subtypes.filter((el) => el.id === e)[0];
            changeData((prev) => ({ ...prev, subtype: { ...subtype } }));
          }}
          options={
            form_id > 0 &&
            data.subtype &&
            (data.status.appStatus === 'В работе' || data.status.appStatus === 'Закрыта')
              ? [{ value: data.subtype.id, label: data.subtype.subtype }]
              : subtypes.map((el) => ({
                  value: el.id,
                  label: el.subtype,
                }))
          }
        />
      )}
      {role === 'citizen' && (
        <Select
          className='h-[50px]'
          disabled={!subtypes.length || form_id > 0 ? true : false}
          value={!data.subtype ? undefined : data.subtype.id}
          onChange={(e: number) => {
            if (!subtypes.length) return;
            const subtype = subtypes.filter((el) => el.id === e)[0];
            changeData((prev) => ({ ...prev, subtype: { ...subtype } }));
          }}
          options={
            form_id > 0 && data.subtype
              ? [{ value: data.subtype.id, label: data.subtype.subtype }]
              : subtypes.map((el) => ({
                  value: el.id,
                  label: el.subtype,
                }))
          }
        />
      )}
    </div>
  );
};
