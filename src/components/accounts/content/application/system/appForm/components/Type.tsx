import { Select } from 'antd';
import { FC } from 'react';
import { IApplication, IError, IRole, ISubtype, IType } from '../../../../../../types';
import { useActions } from '../../../../../../hooks/useActions';

interface IProps {
  form_id: number;
  role: IRole;
  data: IApplication;
  types: IType[];
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
  getSubtypes: (id: string) => Promise<ISubtype[] | void>;
  error: IError | null;
}

export const Type: FC<IProps> = ({
  form_id,
  role,
  data,
  types,
  changeFormData,
  getSubtypes,
  error,
}) => {
  const defaultSubtype: ISubtype = {
    type: '',
    subtype: '',
    id: 0,
    normative: 0,
  };
  const { subTypesSuccess, applicationError } = useActions();

  const getSubtypesRequest = async (id: string) => {
    const subtypes = await getSubtypes(id);

    if (subtypes && subtypes.length) subTypesSuccess(subtypes);
  };

  return (
    <div className='w-full md:w-[48%] gap-2 flex flex-col'>
      <span>Тип заявки</span>
      {role !== 'executor' && (
        <>
          <Select
            className='h-[50px]'
            value={!data.type.id ? undefined : data.type.id}
            disabled={
              !types.length ||
              role === 'executor' ||
              (role === 'citizen' && form_id > 0) ||
              (form_id > 0 &&
                data.status.appStatus !== 'Новая' &&
                data.status.appStatus !== 'Назначена' &&
                data.status.appStatus !== 'Возвращена')
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
                subtype: defaultSubtype,
              }));
              getSubtypesRequest(e.toString());
            }}
            status={error && error.type === 'type' ? 'error' : undefined}
            options={types.map((el) => ({
              value: el.id,
              label: el.appType,
            }))}
          />
          {error && error.type === 'type' && <span className='errorText'>{error.error}</span>}
        </>
      )}
      {role === 'executor' && (
        <Select
          className='h-[50px]'
          value={!data.type.id ? undefined : data.type.id}
          disabled
          options={data.type.id ? [{ value: data.type.id, label: data.type.appType }] : []}
        />
      )}
    </div>
  );
};