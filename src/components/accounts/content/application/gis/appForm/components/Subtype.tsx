import { Select } from 'antd';
import { FC } from 'react';
import { IAppLoading, IGisApplication, IEmployee, IError, ISubtype } from '../../../../../../types';
import { useActions } from '../../../../../../hooks/useActions';

interface IProps {
  data: IGisApplication;
  changeData: React.Dispatch<React.SetStateAction<IGisApplication>>;
  subtypes: ISubtype[];
  role: string;
  error: IError | null;
  getEmploys: (complex_id: string, subtype_id: string) => Promise<IEmployee[] | void>;
  applicationLoadingField: IAppLoading;
}

export const Subtype: FC<IProps> = ({
  data,
  changeData,
  subtypes,
  role,
  error,
  getEmploys,
  applicationLoadingField,
}) => {
  const { applicationError } = useActions();
  return (
    <div className='w-full md:w-[48%] gap-2 flex flex-col'>
      <span>Подтип заявки</span>
      {role === 'executor' && data.subtype && (
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
              !data.type ||
              !subtypes.length ||
              data.status.name === 'В работе' ||
              data.status.name === 'Закрыта'
                ? true
                : false
            }
            value={!data.subtype || !subtypes.length ? undefined : data.subtype.id}
            onChange={(e: number) => {
              if (error) applicationError(null);
              const newSubtype = subtypes.filter((el) => el.id === e);
              if (!newSubtype.length) return;
              if (!data.complex) {
                applicationError({ type: 'complex', error: 'Не указан ЖК' });
                return;
              }
              changeData((prev) => ({
                ...prev,
                subtype: { ...newSubtype[0] },
                employee: null,
              }));
              getEmploys(data.complex.id.toString(), e.toString());
            }}
            status={error && error.type === 'subtype' ? 'error' : undefined}
            loading={applicationLoadingField === 'subtypes' ? true : false}
            options={
              data.subtype && (data.status.name === 'В работе' || data.status.name === 'Закрыта')
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
