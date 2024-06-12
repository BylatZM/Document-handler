import { Select } from 'antd';
import { FC } from 'react';
import { IAppLoading, IError, IGisApplication, ISubtype, IType } from '../../../../../../types';
import { useActions } from '../../../../../../hooks/useActions';

interface IProps {
  role: string;
  data: IGisApplication;
  types: IType[];
  changeFormData: React.Dispatch<React.SetStateAction<IGisApplication>>;
  getSubtypes: (type_id: string, complex_id: string) => Promise<ISubtype[] | void>;
  error: IError | null;
  applicationLoadingField: IAppLoading;
}

export const Type: FC<IProps> = ({
  role,
  data,
  types,
  changeFormData,
  getSubtypes,
  error,
  applicationLoadingField,
}) => {
  const { subtypesSuccess, applicationError } = useActions();

  const getSubtypesRequest = async (newType: IType) => {
    if (!data.complex) {
      applicationError({ type: 'complex', error: 'Не задан ЖК' });
      return;
    }
    const subtypes = await getSubtypes(newType.id.toString(), data.complex.id.toString());

    if (subtypes && subtypes.length) subtypesSuccess(subtypes);
    changeFormData((prev) => ({
      ...prev,
      type: { ...newType },
      subtype: null,
      employee: null,
    }));
  };

  return (
    <div className='w-full md:w-[48%] gap-2 flex flex-col'>
      <span>Тип заявки</span>
      {role === 'dispatcher' && data.status.name !== 'Закрыта' && (
        <>
          <Select
            className='h-[50px]'
            value={!data.type ? undefined : data.type.id}
            disabled={
              !types.length ||
              !data.complex ||
              (data.status.name !== 'Новая' &&
                data.status.name !== 'Назначена' &&
                data.status.name !== 'Возвращена')
                ? true
                : false
            }
            onChange={(e: number) => {
              if (error) applicationError(null);
              const newType = types.filter((el) => el.id === e);
              if (!newType.length) return;
              getSubtypesRequest(newType[0]);
            }}
            loading={applicationLoadingField === 'types' ? true : false}
            status={error && error.type === 'type' ? 'error' : undefined}
            options={types.map((el) => ({
              value: el.id,
              label: el.name,
            }))}
          />
          {error && error.type === 'type' && <span className='errorText'>{error.error}</span>}
        </>
      )}
      {(role === 'executor' || data.status.name === 'Закрыта') && (
        <Select
          className='h-[50px]'
          value={!data.type ? undefined : data.type.id}
          disabled
          options={data.type ? [{ value: data.type.id, label: data.type.name }] : []}
        />
      )}
    </div>
  );
};
