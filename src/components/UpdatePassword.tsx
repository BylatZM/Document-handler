import { FC, useState } from 'react';
import { Button, Input, Checkbox, ConfigProvider } from 'antd';
import { clsx } from 'clsx';
import { updatePasswordRequest } from '../api/requests/Main';
import { IError } from './types';
import { ImCross, ImSpinner9 } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';

interface IUpdatePassProps {
  needShowForm: boolean;
  changeNeedShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IRequest {
  email: string;
  phone: string;
}

const initialState: IRequest = {
  email: '',
  phone: '',
};

export const UpdatePassword: FC<IUpdatePassProps> = ({ needShowForm, changeNeedShowForm }) => {
  const [formData, changeFormData] = useState<IRequest>(initialState);
  const [isApproved, changeIsApproved] = useState(false);
  const [isRequestSuccess, changeIsRequestSuccess] = useState(false);
  const [isLoading, changeIsLoading] = useState(false);

  const [error, changeError] = useState<IError | null>(null);

  const onFinish = async () => {
    if (!formData) return;

    changeIsLoading((prev) => !prev);
    const response = await updatePasswordRequest(formData);
    if (!response) {
      changeIsLoading((prev) => !prev);
      return;
    }

    if (typeof response !== 'number' && 'type' in response) {
      if (response.type === 'phone') changeIsApproved(true);
      changeError(response);
      changeIsLoading((prev) => !prev);
    } else {
      changeIsLoading((prev) => !prev);
      changeIsRequestSuccess((prev) => !prev);
      setTimeout(() => {
        changeIsRequestSuccess((prev) => !prev);
        changeNeedShowForm(false);
        changeFormData(initialState);
      }, 2000);
    }
  };
  return (
    <div
      className={clsx(
        'transitionGeneral bg-blue-500 bg-opacity-10 backdrop-blur-xl z-[30] fixed inset-y-0 left-0 min-h-screen overflow-hidden flex justify-center items-center',
        needShowForm ? 'w-full' : 'w-0',
      )}
    >
      <div className='bg-blue-700 p-5 bg-opacity-10 backdrop-blur-xl z-[40] rounded-md min-w-[500px] max-w-[500px] h-min'>
        <div className='text-center'>
          <span className='text-xl font-bold'>Обновление пароля</span>
        </div>

        <div className='flex flex-col justify-between h-5/6 gap-2'>
          <div className='mt-5'>
            <span className='primaryField'>Адресс электронной почты аккаунта</span>
            <div className='mt-2' style={{ marginBottom: 25 }}>
              <Input
                className='rounded-md h-[40px]'
                maxLength={50}
                onChange={(e) => {
                  if (error && error.type === 'email') changeError(null);
                  changeFormData((prev) => ({ ...prev, email: e.target.value }));
                }}
                value={formData ? formData.email : ''}
                type='text'
                required
                size='large'
                placeholder='applications@dltex.ru'
              />
              {error && error.type === 'email' && (
                <div className='errorText mt-2'>{error.error}</div>
              )}
            </div>
            <Checkbox
              className='text-left text-gray-600 text-sm'
              style={{ marginBottom: 25 }}
              onClick={() => {
                if (!isApproved) changeFormData((prev) => ({ ...prev, phone: '' }));

                if (error && error.type === 'phone') changeError({ type: '', error: '' });
                changeIsApproved((prev) => !prev);
              }}
            >
              Мой аккаунт подтвержден диспетчером/администратором
            </Checkbox>

            {isApproved && (
              <div className='mb-5'>
                <span className='mb-2'>Номер телефона заданный в аккаунте</span>
                <div style={{ marginBottom: 25 }}>
                  <Input
                    className='rounded-md h-[40px]'
                    maxLength={11}
                    onChange={(e) => {
                      if (error && error.type === 'phone') changeError(null);
                      changeFormData((prev) => ({ ...prev, phone: e.target.value }));
                    }}
                    value={formData ? formData.phone : ''}
                    type='text'
                    required
                    size='large'
                    placeholder='89372833608'
                  />
                  {error && error.type === 'phone' && (
                    <span className='errorText mt-2'>{error.error}</span>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className='text-end'>
            <Button
              className='inline mr-4 border-[1px] border-blue-700 text-blue-700'
              disabled={isLoading}
              onClick={() => {
                changeNeedShowForm(false);
                if (error) changeError(null);
                changeFormData(initialState);
              }}
            >
              Закрыть
            </Button>
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorPrimaryHover: undefined,
                  },
                },
              }}
            >
              <Button
                className={clsx(
                  'inline text-white',
                  !error && !isRequestSuccess && 'bg-blue-700',
                  error && !isRequestSuccess && !isLoading && 'bg-red-500',
                  !error && isRequestSuccess && !isLoading && 'bg-green-500',
                )}
                disabled={formData ? !formData.email : true}
                onClick={() => {
                  onFinish();
                }}
              >
                {isLoading && (
                  <div>
                    <ImSpinner9 className='inline animate-spin mr-2' />
                    <span>Обработка</span>
                  </div>
                )}
                {error && !isLoading && !isRequestSuccess && (
                  <div>
                    <ImCross className='mr-2 inline' />
                    <span>Ошибка</span>
                  </div>
                )}
                {!isLoading && !error && isRequestSuccess && (
                  <div>
                    <HiOutlineCheck className='inline mr-2 font-bold text-lg' />
                    <span>Успешно</span>
                  </div>
                )}
                {!isLoading && !error && !isRequestSuccess && <>Отправить</>}
              </Button>
            </ConfigProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
