import { Select } from 'antd';
import { FC } from 'react';
import { IAppLoading, IApplication, IEmployee, IError, ISubtype } from '../../../../../../types';
import { useActions } from '../../../../../../hooks/useActions';

interface IProps {
  data: IApplication;
  changeData: React.Dispatch<React.SetStateAction<IApplication>>;
  subtypes: ISubtype[];
  form_id: number;
  role: string;
  error: IError | null;
  getEmploys: (complex_id: string, subtype_id: string) => Promise<IEmployee[] | void>;
  applicationLoadingField: IAppLoading;
}

export const Subtype: FC<IProps> = ({
  data,
  changeData,
  subtypes,
  form_id,
  role,
  error,
  getEmploys,
  applicationLoadingField,
}) => {
  const { applicationError } = useActions();
  return (
    <div className='w-full md:w-[48%] gap-2 flex flex-col'>
      <span>Подтип заявки</span>
      {role === 'executor' && (
        <Select
          className='h-[50px]'
          disabled
          listHeight={350}
          value={data.subtype.id}
          options={[
            {
              value: data.subtype.id,
              label: data.subtype.name,
            },
          ]}
        />
      )}
      {role === 'dispatcher' && (
        <>
          <Select
            className='h-[50px]'
            listHeight={350}
            disabled={
              !subtypes.length ||
              (form_id > 0 && (data.status.name === 'В работе' || data.status.name === 'Закрыта'))
                ? true
                : false
            }
            value={
              data.status.name !== 'Закрыта' && (!data.subtype.id || !subtypes.length)
                ? undefined
                : data.subtype.id
            }
            onChange={(e: number) => {
              if (error) applicationError(null);
              const newSubtype = subtypes.filter((el) => el.id === e);
              if (!newSubtype.length) return;
              if (data.complex.id) {
                changeData((prev) => ({
                  ...prev,
                  subtype: { ...newSubtype[0] },
                  employee: null,
                }));
                getEmploys(data.complex.id.toString(), e.toString());
              } else {
                changeData((prev) => ({ ...prev, subtype: { ...newSubtype[0] } }));
              }
            }}
            status={error && error.type === 'subtype' ? 'error' : undefined}
            loading={applicationLoadingField === 'subtypes' ? true : false}
            options={
              form_id > 0 && (data.status.name === 'В работе' || data.status.name === 'Закрыта')
                ? [{ value: data.subtype.id, label: data.subtype.name }]
                : subtypes.map((el) => ({
                    value: el.id,
                    label: el.name,
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
            listHeight={350}
            value={!data.subtype.id || !subtypes.length ? undefined : data.subtype.id}
            onChange={(e: number) => {
              if (error) applicationError(null);
              const newSubtype = subtypes.filter((el) => el.id === e);
              if (!newSubtype.length) return;
              changeData((prev) => ({ ...prev, subtype: { ...newSubtype[0] } }));
            }}
            status={error && error.type === 'subtype' ? 'error' : undefined}
            loading={applicationLoadingField === 'subtypes' ? true : false}
            options={
              form_id > 0
                ? [{ value: data.subtype.id, label: data.subtype.name }]
                : subtypes.map((el) => ({
                    value: el.id,
                    label: el.name,
                  }))
            }
          />
          {error && error.type === 'subtype' && <span className='errorText'>{error.error}</span>}
        </>
      )}
    </div>
  );
};
