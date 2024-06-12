import { Select } from 'antd';
import { FC } from 'react';
import { IComplex, IEmailApplication, IError, IType } from '../../../../../../types';
import { useActions } from '../../../../../../hooks/useActions';

interface IProps {
  role: string;
  data: IEmailApplication;
  complexes: IComplex[];
  changeFormData: React.Dispatch<React.SetStateAction<IEmailApplication>>;
  error: IError | null;
  getTypes: (complex_id: string) => Promise<IType[] | void>;
}

export const Complex: FC<IProps> = ({ role, data, complexes, changeFormData, error, getTypes }) => {
  const { applicationError } = useActions();

  const changeType = async (complex_id: string) => {
    await getTypes(complex_id);
    changeFormData((prev) => ({
      ...prev,
      type: null,
      subtype: null,
    }));
  };

  return (
    <div className='flex flex-col gap-2 w-full md:w-[48%]'>
      <span>Жилой комплекс</span>
      {role === 'dispatcher' && (
        <Select
          className='h-[50px]'
          value={!data.complex ? undefined : data.complex.id}
          onChange={(e: number) => {
            if (error) applicationError(null);
            const newComplex = complexes.filter((el) => el.id === e);
            if (!newComplex.length) return;
            changeFormData((prev) => ({
              ...prev,
              complex: { ...newComplex[0] },
              employee: null,
            }));
            changeType(e.toString());
          }}
          disabled={data.status.name !== 'Новая' ? true : false}
          options={
            data.status.name !== 'Новая' && data.complex
              ? [{ label: data.complex.name, value: data.complex.id }]
              : complexes.map((el) => ({
                  label: el.name,
                  value: el.id,
                }))
          }
        />
      )}
      {role === 'executor' && data.complex && (
        <Select
          className='h-[50px]'
          value={data.complex.id}
          disabled
          options={[{ label: data.complex.name, value: data.complex.id }]}
        />
      )}
    </div>
  );
};
