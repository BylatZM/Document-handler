import { Checkbox, Input } from 'antd';
import { FC } from 'react';
import { IError, IUpdatePassword } from '../../../types';
import clsx from 'clsx';

interface IProps {
  error: IError | null;
  changeError: React.Dispatch<React.SetStateAction<IError | null>>;
  data: IUpdatePassword;
  changeFormData: React.Dispatch<React.SetStateAction<IUpdatePassword>>;
  isApproved: boolean;
  changeIsApproved: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Inputs: FC<IProps> = ({
  error,
  changeError,
  data,
  changeFormData,
  isApproved,
  changeIsApproved,
}) => {
  return (
    <>
      <div className='text-sm'>
        <span className='primaryField'>Адрес электронной почты</span>
        <Input
          className='rounded-md h-[40px]'
          maxLength={50}
          status={error && error.type === 'email' ? 'error' : undefined}
          onChange={(e) => {
            if (error && error.type === 'email') changeError(null);
            changeFormData((prev) => ({ ...prev, email: e.target.value }));
          }}
          value={data ? data.email : ''}
          type='text'
          size='large'
          placeholder='applications@dltex.ru'
        />
        {error && error.type === 'email' && <div className='errorText mt-2'>{error.error}</div>}
      </div>
      <Checkbox
        className='text-left text-gray-600 text-sm'
        checked={isApproved}
        onClick={() => {
          if (!isApproved) changeFormData((prev) => ({ ...prev, phone: '' }));

          if (error && error.type === 'phone') changeError({ type: '', error: '' });
          changeIsApproved((prev) => !prev);
        }}
      >
        Мой аккаунт подтвержден
      </Checkbox>

      <div className={clsx('transitionGeneral text-sm', isApproved ? 'opacity-100' : 'opacity-0')}>
        <span>Номер телефона</span>
        <Input
          className='rounded-md h-[40px]'
          maxLength={12}
          onChange={(e) => {
            if (error && error.type === 'phone') changeError(null);
            changeFormData((prev) => ({
              ...prev,
              phone: e.target.value.length < 3 && e.target.value !== '+7' ? '+7' : e.target.value,
            }));
          }}
          value={data && data.phone ? data.phone : '+7'}
          type='text'
          status={error && error.type === 'phone' ? 'error' : undefined}
          size='large'
          placeholder='+79372833608'
        />
        {error && error.type === 'phone' && <span className='errorText mt-2'>{error.error}</span>}
      </div>
    </>
  );
};
