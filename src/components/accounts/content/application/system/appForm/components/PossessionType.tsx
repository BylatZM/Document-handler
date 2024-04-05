import { FC } from 'react';
import { useActions } from '../../../../../../hooks/useActions';
import { Input, Select } from 'antd';
import { IApplication, IError, IPossession, IRole } from '../../../../../../types';
import { defaultAppForm } from '../defaultAppForm';

interface IProps {
  form_id: number;
  data: IApplication;
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
  getPossessions: (type: string, building_id: string) => Promise<void | IError | IPossession[]>;
  role: IRole;
  error: IError | null;
}

export const PossessionType: FC<IProps> = ({
  form_id,
  data,
  changeFormData,
  getPossessions,
  role,
  error,
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
          value={parseInt(data.possessionType)}
          onChange={(e: number) => {
            if (!data.building.id) return;
            if (error) applicationError(null);
            changeFormData((prev) => ({
              ...prev,
              possessionType: e.toString(),
              possession: { ...defaultAppForm.possession },
            }));
            getPossessions(e.toString(), data.building.id.toString());
          }}
        />
      )}
      {(form_id > 0 || role === 'citizen') && (
        <Input disabled className='w-full h-[50px] text-base' value={data.possession.type} />
      )}
    </div>
  );
};
