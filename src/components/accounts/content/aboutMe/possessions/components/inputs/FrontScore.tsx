import { FC } from 'react';
import { Input } from 'antd';
import { ICitizenPossession, ICitizenError, ICitizenLoading } from '../../../../../../types';
import { useActions } from '../../../../../../hooks/useActions';

interface IProps {
  data: ICitizenPossession;
  form_id: number;
  error: ICitizenError | null;
  updatingFormId: number | null;
  changeFormData: React.Dispatch<React.SetStateAction<ICitizenPossession>>;
  loadingForm: ICitizenLoading | null;
}

export const FrontScore: FC<IProps> = ({
  data,
  form_id,
  error,
  updatingFormId,
  changeFormData,
  loadingForm,
}) => {
  const { citizenErrors } = useActions();
  return (
    <div className='mt-2 mb-2 text-sm'>
      <span>Лицевой счет</span>
      <Input
        value={data.personal_account}
        maxLength={15}
        disabled={
          (loadingForm && loadingForm.form_id === form_id) || updatingFormId !== form_id
            ? true
            : false
        }
        status={
          error && error.form_id === form_id && error.error.type === 'personal_account'
            ? 'error'
            : undefined
        }
        onChange={(e) => {
          if (error && error.error.type === 'personal_account') citizenErrors(null);
          changeFormData((prev) => ({ ...prev, personal_account: e.target.value }));
        }}
      />
      {error && error.form_id === form_id && error.error.type === 'personal_account' && (
        <div className='errorText'>{error.error.error}</div>
      )}
    </div>
  );
};
