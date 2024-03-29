import { Select } from 'antd';
import { FC } from 'react';
import { IApplication, IRole, ISource } from '../../../../../types';

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
          <Select
            className='h-[50px]'
            value={!data.source.id ? undefined : data.source.id}
            disabled={
              role === 'executor' ||
              (data.status &&
                form_id > 0 &&
                data.status.appStatus !== 'Новая' &&
                data.status.appStatus !== 'Назначена' &&
                data.status.appStatus !== 'Возвращена')
                ? true
                : false
            }
            onChange={(e: number) =>
              changeFormData((prev) => ({ ...prev, source: { id: e, appSource: '' } }))
            }
            options={sources.map((el) => ({
              value: el.id,
              label: el.appSource,
            }))}
          />
        </div>
      )}
    </>
  );
};
