import { FC } from 'react';
import { useActions } from '../../../../../hooks/useActions';
import { Select } from 'antd';
import { IApplication, ICar } from '../../../../../types';

interface IProps {
  form_id: number;
  data: IApplication;
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
  changeCarInfo: React.Dispatch<React.SetStateAction<ICar | null>>;
  getPossessions: (type: string, building_id: string) => Promise<void>;
}

export const PossessionType: FC<IProps> = ({
  form_id,
  data,
  changeFormData,
  changeCarInfo,
  getPossessions,
}) => {
  const { citizenErrors } = useActions();
  return (
    <div className='flex flex-col gap-2 w-[48%]'>
      <span>Тип имущества</span>
      <Select
        className='w-full'
        options={[
          { label: 'квартира', value: 1 },
          { label: 'офис', value: 2 },
          { label: 'кладовка', value: 4 },
          { label: 'парковка', value: 3 },
        ]}
        value={parseInt(data.possessionType)}
        disabled={form_id !== 0 ? true : false}
        onChange={(e: number) => {
          citizenErrors(null);
          changeCarInfo(null);
          changeFormData((prev) => ({
            ...prev,
            possessionType: e.toString(),
            possession: { id: 0, address: '', car: null },
          }));
          if (data.building.id) {
            getPossessions(e.toString(), data.building.id.toString());
          }
        }}
      />
    </div>
  );
};
