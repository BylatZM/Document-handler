import { Select } from 'antd';
import { FC } from 'react';
import { ICitizen, ICitizenLoading } from '../../../../../../types';

interface IProps {
  data: ICitizen;
  form_id: number;
  updatingFormId: number | null;
  loadingForm: ICitizenLoading | null;
}

export const OwnershipStatus: FC<IProps> = ({ data, form_id, updatingFormId, loadingForm }) => {
  return (
    <div className='mt-2 mb-2 text-sm'>
      <span>Статус собственника</span>
      <Select
        className='w-full'
        options={[
          { label: 'арендодатор', value: 1 },
          { label: 'гражданин', value: 2 },
          { label: 'член семьи', value: 3 },
          { label: 'ребенок', value: 4 },
        ]}
        disabled={
          (loadingForm && loadingForm.form_id === form_id) || updatingFormId !== form_id
            ? true
            : false
        }
        value={parseInt(data.ownershipStatus)}
      />
    </div>
  );
};
