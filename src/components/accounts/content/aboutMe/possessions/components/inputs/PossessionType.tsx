import { Select } from 'antd';
import { FC } from 'react';
import {
  ICitizenPossession,
  ICitizenError,
  ICitizenLoading,
  IPossession,
} from '../../../../../../types';

interface IProps {
  data: ICitizenPossession;
  form_id: number;
  updatingFormId: number | null;
  changeFormData: React.Dispatch<React.SetStateAction<ICitizenPossession>>;
  citizenErrors: (error: ICitizenError | null) => void;
  checkPossessionsRequestOnError: (
    form_id: number,
    possession_type: string,
    building_id: string,
  ) => Promise<void>;
  loadingForm: ICitizenLoading | null;
  emptyPossession: IPossession;
  error: ICitizenError | null;
}

export const PossessionType: FC<IProps> = ({
  data,
  form_id,
  updatingFormId,
  changeFormData,
  loadingForm,
  checkPossessionsRequestOnError,
  citizenErrors,
  emptyPossession,
  error,
}) => {
  return (
    <div className='mt-2 mb-2 text-sm'>
      <span>Тип имущества</span>
      <Select
        className='w-full'
        options={[
          { label: 'квартира', value: 1 },
          { label: 'коммерческое помещение', value: 2 },
          { label: 'парковка', value: 3 },
          { label: 'кладовка', value: 4 },
        ]}
        value={parseInt(data.possession_type)}
        disabled={
          (loadingForm && loadingForm.form_id === form_id) || updatingFormId !== form_id
            ? true
            : false
        }
        onChange={(e: number) => {
          if (error && error.error.type === 'possession') citizenErrors(null);
          changeFormData((prev) => ({
            ...prev,
            possession_type: e.toString(),
            possession: { ...emptyPossession },
          }));
          if (data.building.id) {
            checkPossessionsRequestOnError(form_id, e.toString(), data.building.id.toString());
          }
        }}
      />
    </div>
  );
};
