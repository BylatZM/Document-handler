import { FC } from 'react';
import { useActions } from '../../../../../../hooks/useActions';
import { Input, Select } from 'antd';
import { IApplication, IError } from '../../../../../../types';
import { defaultAppForm } from '../defaultAppForm';

interface IProps {
  form_id: number;
  data: IApplication;
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
  role: string;
  error: IError | null;
  checkPossessionRequestOnError: (possessionType: string, buildingId: string) => Promise<void>;
}

export const PossessionType: FC<IProps> = ({
  form_id,
  data,
  changeFormData,
  role,
  error,
  checkPossessionRequestOnError,
}) => {
  const { applicationError } = useActions();
  return (
    <div className='flex flex-col gap-2 w-full md:w-[48%]'>
      <span>Тип имущества</span>
      {role === 'dispatcher' && form_id < 1 && (
        <Select
          className='w-full h-[50px]'
          options={[
            { label: 'квартира', value: 1 },
            { label: 'коммерческое помещение', value: 2 },
            { label: 'парковка', value: 3 },
            { label: 'кладовка', value: 4 },
            { label: 'жилищный комплекс', value: 5 },
          ]}
          value={parseInt(data.possession_type)}
          onChange={(e: number) => {
            if (!data.building.id) return;
            if (error) applicationError(null);
            changeFormData((prev) => ({
              ...prev,
              possession_type: e.toString(),
              possession: { ...defaultAppForm.possession },
            }));
            checkPossessionRequestOnError(e.toString(), data.building.id.toString());
          }}
        />
      )}
      {(form_id > 0 || role === 'citizen') && (
        <Input disabled className='w-full h-[50px] text-base' value={data.possession.type} />
      )}
    </div>
  );
};
