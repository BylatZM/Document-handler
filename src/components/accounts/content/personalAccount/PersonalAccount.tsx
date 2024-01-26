import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Input, Form, Button, ConfigProvider } from 'antd';
import { useActions } from '../../../hooks/useActions';
import { ImCross, ImSpinner9 } from 'react-icons/im';
import { updateUserRequest } from '../../../../api/requests/Person';
import { Main } from './citizen/Main';
import { useLogout } from '../../../hooks/useLogout';
import { useState } from 'react';
import { HiOutlineCheck } from 'react-icons/hi';
import clsx from 'clsx';

interface IGenFormData {
  first_name: string | undefined;
  last_name: string | undefined;
  patronymic: string | undefined;
  phone: string | undefined;
}

export const PersonalAccount = () => {
  const { user, isLoading, error } = useTypedSelector((state) => state.UserReducer);
  const { userSuccess, userLoading, userError } = useActions();
  const [isRequestSuccess, changeIsRequestSuccess] = useState(false);
  const logout = useLogout();

  const onFinish = async ({ first_name, last_name, patronymic, phone }: IGenFormData) => {
    if (first_name && !/^[А-Яа-я]+$/.test(first_name)) {
      userError({
        type: 'first_name',
        error: 'Имя может состоять только из букв русского алфавита или быть незаполненным',
      });
      return;
    }
    if (last_name && !/^[А-Яа-я]+$/.test(last_name)) {
      userError({
        type: 'last_name',
        error: 'Фамилия может состоять только из букв русского алфавита или быть незаполненным',
      });
      return;
    }
    if (patronymic && !/^[А-Яа-я]+$/.test(patronymic)) {
      userError({
        type: 'patronymic',
        error: 'Отчество может состоять только из букв русского алфавита или быть незаполненным',
      });
      return;
    }
    if (phone && (!/^\d+$/.test(phone) || phone.length !== 11)) {
      userError({
        type: 'phone',
        error:
          'Номер телефона может состоять только из 11 цифр, пожалуйста, введите телефон исходя из примера: 89372833608',
      });
      return;
    }

    userLoading(true);
    if (error) userError(null);

    const response = await updateUserRequest(
      {
        first_name: !first_name ? '' : first_name,
        last_name: !last_name ? '' : last_name,
        patronymic: !patronymic ? null : patronymic,
        phone: !phone ? null : phone,
      },
      logout,
    );
    if (response === 200) {
      changeIsRequestSuccess((prev) => !prev);
      userSuccess({
        ...user,
        first_name: !first_name ? '' : first_name,
        last_name: !last_name ? '' : last_name,
        patronymic: !patronymic ? null : patronymic,
        phone: !phone ? null : phone,
      });
      setTimeout(() => {
        changeIsRequestSuccess((prev) => !prev);
      }, 2000);
    }
    userLoading(false);
  };

  return (
    <>
      <div className='w-[500px] flex flex-col gap-4 m-auto p-2'>
        <Form
          initialValues={{
            remember: true,
          }}
          name='GeneralForm'
          onFinish={onFinish}
          autoComplete='off'
        >
          <span className='text-xl'>Основная информация</span>
          <div className='mt-2 mb-6 text-sm'>
            <span>Почта</span>
            <Input disabled={true} value={user.email} />
          </div>
          <div className='mt-2 mb-6 text-sm'>
            <span>Роль</span>
            <Input value={user.role.role} disabled={true} />
          </div>
          <div className='mt-2 mb-2 text-sm'>
            <span>Имя</span>
            <Form.Item
              name='first_name'
              initialValue={user.first_name}
              validateStatus={error && error.type === 'first_name' ? 'error' : undefined}
              help={
                error &&
                error.type === 'first_name' && <div className='errorText'>{error.error}</div>
              }
            >
              <Input maxLength={30} disabled={isLoading} />
            </Form.Item>
          </div>
          <div className='mt-2 mb-2 text-sm'>
            <span>Фамилия</span>
            <Form.Item
              name='last_name'
              initialValue={user.last_name}
              validateStatus={error && error.type === 'last_name' ? 'error' : undefined}
              help={
                error &&
                error.type === 'last_name' && <div className='errorText'>{error.error}</div>
              }
            >
              <Input maxLength={30} disabled={isLoading} />
            </Form.Item>
          </div>
          <div className='mt-2 mb-2 text-sm'>
            <span>Отчество</span>
            <Form.Item
              name='patronymic'
              initialValue={!user.patronymic ? '' : user.patronymic}
              validateStatus={error && error.type === 'patronymic' ? 'error' : undefined}
              help={
                error &&
                error.type === 'patronymic' && <div className='errorText'>{error.error}</div>
              }
            >
              <Input maxLength={30} disabled={isLoading} />
            </Form.Item>
          </div>
          <div className='mt-2 mb-2 text-sm'>
            <span>Номер телефона</span>
            <Form.Item
              name='phone'
              initialValue={!user.phone ? '' : user.phone}
              validateStatus={error && error.type === 'phone' ? 'error' : undefined}
              help={
                error && error.type === 'phone' && <div className='errorText'>{error.error}</div>
              }
            >
              <Input maxLength={11} disabled={isLoading} placeholder='89372833608' />
            </Form.Item>
          </div>
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
              type='primary'
              className={clsx(
                'inline text-white',
                !error && !isRequestSuccess && 'bg-blue-700',
                error && !isRequestSuccess && !isLoading && 'bg-red-500',
                !error && isRequestSuccess && !isLoading && 'bg-green-500',
              )}
              htmlType='submit'
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
              {!isLoading && !error && !isRequestSuccess && <>Обновить</>}
            </Button>
          </ConfigProvider>
        </Form>
        {user.role.role === 'citizen' && <Main />}
      </div>
    </>
  );
};
