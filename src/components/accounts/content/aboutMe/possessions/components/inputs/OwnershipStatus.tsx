import { Select } from 'antd';
import { FC } from 'react';
import { ICitizen, ICitizenLoading } from '../../../../../../types';

interface IProps {
  data: ICitizen;
  form_id: number;
  updatingFormId: number | null;
  loadingForm: ICitizenLoading | null;
  changeFormData: React.Dispatch<React.SetStateAction<ICitizen>>;
}

export const OwnershipStatus: FC<IProps> = ({
  data,
  form_id,
  updatingFormId,
  loadingForm,
  changeFormData,
}) => {
  return (
    <div className='mt-2 mb-2 text-sm'>
      <span>Статус собственника</span>
      <Select
        className='w-full'
        options={[
          { label: 'арендатор', value: '1' },
          { label: 'владелец', value: '2' },
        ]}
        disabled={
          (loadingForm && loadingForm.form_id === form_id) || updatingFormId !== form_id
            ? true
            : false
        }
        value={data.ownershipStatus}
        onChange={(e) => changeFormData((prev) => ({ ...prev, ownershipStatus: e }))}
      />
    </div>
  );
};
