import { Select } from 'antd';
import { FC } from 'react';
import { IApplication, IError, IRole, ISubtype } from '../../../../../../types';
import { useActions } from '../../../../../../hooks/useActions';

interface IProps {
  data: IApplication;
  changeData: React.Dispatch<React.SetStateAction<IApplication>>;
  subtypes: ISubtype[];
  form_id: number;
  role: IRole;
  error: IError | null;
}

export const Subtype: FC<IProps> = ({ data, changeData, subtypes, form_id, role, error }) => {
  const { applicationError } = useActions();
  return (
    <div className='w-full md:w-[48%] gap-2 flex flex-col'>
      <span>Подтип заявки</span>
      {role === 'executor' && (
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
        <>
          <Select
            className='h-[50px]'
            disabled={
              !subtypes.length ||
              (form_id > 0 &&
                (data.status.appStatus === 'В работе' || data.status.appStatus === 'Закрыта'))
                ? true
                : false
            }
            value={!data.subtype.id ? undefined : data.subtype.id}
            onChange={(e: number) => {
              if (error) applicationError(null);
              const newSubtype = subtypes.filter((el) => el.id === e);
              if (!newSubtype.length) return;
              changeData((prev) => ({ ...prev, subtype: { ...newSubtype[0] } }));
            }}
            status={error && error.type === 'subtype' ? 'error' : undefined}
            options={
              form_id > 0 &&
              (data.status.appStatus === 'В работе' || data.status.appStatus === 'Закрыта')
                ? [{ value: data.subtype.id, label: data.subtype.subtype }]
                : subtypes.map((el) => ({
                    value: el.id,
                    label: el.subtype,
                  }))
            }
          />
          {error && error.type === 'subtype' && <span className='errorText'>{error.error}</span>}
        </>
      )}
      {role === 'citizen' && (
        <>
          <Select
            className='h-[50px]'
            disabled={!subtypes.length || form_id > 0 ? true : false}
            value={!data.subtype.id ? undefined : data.subtype.id}
            onChange={(e: number) => {
              if (error) applicationError(null);
              const newSubtype = subtypes.filter((el) => el.id === e);
              if (!newSubtype.length) return;
              changeData((prev) => ({ ...prev, subtype: { ...newSubtype[0] } }));
            }}
            status={error && error.type === 'subtype' ? 'error' : undefined}
            options={
              form_id > 0
                ? [{ value: data.subtype.id, label: data.subtype.subtype }]
                : subtypes.map((el) => ({
                    value: el.id,
                    label: el.subtype,
                  }))
            }
          />
          {error && error.type === 'subtype' && <span className='errorText'>{error.error}</span>}
        </>
      )}
    </div>
  );
};
