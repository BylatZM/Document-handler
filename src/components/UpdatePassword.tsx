import { FC, useState } from 'react';
import { Button, Input, Checkbox } from 'antd';
import { clsx } from 'clsx';
import { updatePasswordRequest } from '../api/requests/Main';
import { IError } from './types';

interface IUpdatePassProps {
  activeForm: null | 'password' | 'help';
  changeActiveForm: (activeForm: null | 'password' | 'help') => void;
}

export const UpdatePassword: FC<IUpdatePassProps> = ({ activeForm, changeActiveForm }) => {
  const [formData, changeFormData] = useState({
    email: '',
    phone: '',
  });
  const [isApproved, changeIsApproved] = useState(false);
  const [error, changeError] = useState<IError>({
    type: '',
    error: '',
  });

  const onFinish = async () => {
    const response = await updatePasswordRequest(formData);
    if (!response) return;

    if (typeof response !== 'number' && 'type' in response) {
      changeError(response);
    } else {
      changeError({ type: '', error: '' });
      changeActiveForm(null);
      changeFormData({
        email: '',
        phone: '',
      });
    }
  };
  return (
    <div
      className={clsx(
        'transitionGeneral bg-blue-700 p-5 bg-opacity-10 backdrop-blur-xl z-[40] fixed inset-0 m-auto rounded-md w-[500px] h-[500px] overflow-y-auto border-solid border-blue-500 border-2',
        activeForm === 'password' ? 'translate-x-0' : 'translate-x-[-100vw]',
      )}
    >
      <div className='text-center'>
        <span className='text-xl font-bold'>Обновление пароля</span>
      </div>

      <div className='flex flex-col justify-between h-5/6 gap-2'>
        <div className='my-5'>
          <span className='primaryField mb-2'>Адресс электронной почты аккаунта</span>
          <div style={{ marginBottom: 25 }}>
            <Input
              className='rounded-md h-[40px]'
              maxLength={50}
              onChange={(e) => changeFormData({ ...formData, email: e.target.value })}
              value={formData.email}
              type='text'
              required
              size='large'
              placeholder='applications@dltex.ru'
            />
            {error.type === 'email' && <div className='errorText mt-2'>{error.error}</div>}
          </div>
          <Checkbox
            className='text-left text-gray-600 text-sm'
            style={{ marginBottom: 25 }}
            onClick={() => {
              if (!isApproved) changeFormData((prev) => ({ ...prev, phone: '' }));
              if (error.type === 'phone') changeError({ type: '', error: '' });
              changeIsApproved((prev) => !prev);
            }}
          >
            Мой аккаунт подтвержден диспетчером
          </Checkbox>

          {(isApproved || error.type === 'phone') && (
            <div>
              <span className='mb-2'>Номер телефона заданный в аккаунте</span>
              <div style={{ marginBottom: 25 }}>
                <Input
                  className='rounded-md h-[40px]'
                  maxLength={11}
                  onChange={(e) => changeFormData({ ...formData, phone: e.target.value })}
                  value={formData.phone}
                  type='text'
                  required
                  size='large'
                  placeholder='89372833608'
                />
                {error.type === 'phone' && <div className='errorText mt-2'>{error.error}</div>}
              </div>
            </div>
          )}
        </div>
        <div className='flex justify-end m-0 px-5 py-2'>
          <Button
            className='border-[1px] border-blue-700 text-blue-700 h-[40px] mr-4'
            onClick={() => {
              changeActiveForm(null);
              changeError({ type: '', error: '' });
              changeFormData({
                email: '',
                phone: '',
              });
            }}
          >
            Отмена
          </Button>
          <Button
            className='bg-blue-700 text-white h-[40px] border-blue-700'
            disabled={formData.email === ''}
            type='primary'
            htmlType='submit'
            onClick={() => {
              onFinish();
            }}
          >
            Отправить
          </Button>
        </div>
      </div>
    </div>
  );
};
