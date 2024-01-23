import { Select } from 'antd';
import { FC } from 'react';
import { ICitizen, ICitizenError, ICitizenLoading } from '../../../../../../types';

interface IProps {
  data: ICitizen;
  form_id: number;
  updatingFormId: number | null;
  changeFormData: React.Dispatch<React.SetStateAction<ICitizen>>;
  citizenErrors: (error: ICitizenError | null) => void;
  getPossessions: (type: string, building_id: string) => void;
  loadingForm: ICitizenLoading | null;
}

export const PossessionType: FC<IProps> = ({
  data,
  form_id,
  updatingFormId,
  changeFormData,
  loadingForm,
  getPossessions,
  citizenErrors,
}) => {
  return (
    <div className='mt-2 mb-2 text-sm'>
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
        disabled={
          (loadingForm && loadingForm.form_id === form_id) || updatingFormId !== form_id
            ? true
            : false
        }
        onChange={(e: number) => {
          citizenErrors(null);
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
