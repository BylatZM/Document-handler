import { Select } from 'antd';
import { FC } from 'react';
import { IApplication, IRole, ISource } from '../../../../../../types';

interface IProps {
  form_id: number;
  role: IRole;
  data: IApplication;
  sources: ISource[];
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
}

export const Source: FC<IProps> = ({ form_id, role, data, sources, changeFormData }) => {
  return (
    <>
      {role !== 'citizen' && (
        <div className='w-full md:w-[48%] mt-2 gap-2 flex flex-col'>
          <span>Источник</span>
          {role === 'executor' && (
            <Select
              className='h-[50px]'
              value={!data.source.id ? undefined : data.source.id}
              disabled
              options={[{ value: data.source.id, label: data.source.appSource }]}
            />
          )}
          {role === 'dispatcher' && (
            <Select
              className='h-[50px]'
              value={!data.source.id ? undefined : data.source.id}
              disabled={
                form_id > 0 &&
                data.status.appStatus !== 'Новая' &&
                data.status.appStatus !== 'Назначена' &&
                data.status.appStatus !== 'Возвращена'
                  ? true
                  : false
              }
              onChange={(e: number) => {
                const newSource = sources.filter((el) => el.id === e);
                if (!newSource.length) return;
                changeFormData((prev) => ({ ...prev, source: { ...newSource[0] } }));
              }}
              options={sources.map((el) => ({
                value: el.id,
                label: el.appSource,
              }))}
            />
          )}
        </div>
      )}
    </>
  );
};