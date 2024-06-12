import { Select } from 'antd';
import { FC } from 'react';
import { IAppLoading, IApplication, IError, ISubtype, IType } from '../../../../../../types';
import { useActions } from '../../../../../../hooks/useActions';

interface IProps {
  form_id: number;
  role: string;
  data: IApplication;
  types: IType[];
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
  getSubtypes: (type_id: string, complex_id: string) => Promise<ISubtype[] | void>;
  error: IError | null;
  applicationLoadingField: IAppLoading;
  defaultSubtype: ISubtype;
}

export const Type: FC<IProps> = ({
  form_id,
  role,
  data,
  types,
  changeFormData,
  getSubtypes,
  error,
  applicationLoadingField,
  defaultSubtype,
}) => {
  const { subtypesSuccess, applicationError } = useActions();

  const getSubtypesRequest = async (type_id: string) => {
    const subtypes = await getSubtypes(type_id, data.complex.id.toString());

    if (subtypes && subtypes.length) subtypesSuccess(subtypes);
  };

  return (
    <div className='w-full md:w-[48%] gap-2 flex flex-col'>
      <span>Тип заявки</span>
      {role !== 'executor' &&
        data.status.name !== 'Закрыта' &&
        data.status.name !== 'Заведена неверно' && (
          <>
            <Select
              className='h-[50px]'
              value={!data.type.id ? undefined : data.type.id}
              disabled={
                !types.length ||
                role === 'executor' ||
                (role === 'citizen' && form_id > 0) ||
                (form_id > 0 &&
                  data.status.name !== 'Новая' &&
                  data.status.name !== 'Назначена' &&
                  data.status.name !== 'Возвращена')
                  ? true
                  : false
              }
              onChange={(e: number) => {
                if (error) applicationError(null);
                const newType = types.filter((el) => el.id === e);
                if (!newType.length) return;
                changeFormData((prev) => ({
                  ...prev,
                  type: { ...newType[0] },
                  subtype: { ...defaultSubtype },
                  employee: null,
                }));
                getSubtypesRequest(e.toString());
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
      {(role === 'executor' ||
        data.status.name === 'Закрыта' ||
        data.status.name === 'Заведена неверно') && (
        <Select
          className='h-[50px]'
          value={!data.type.id ? undefined : data.type.id}
          disabled
          options={data.type.id ? [{ value: data.type.id, label: data.type.name }] : []}
        />
      )}
    </div>
  );
};
