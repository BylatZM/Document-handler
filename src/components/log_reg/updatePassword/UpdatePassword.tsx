import { FC, useState } from 'react';
import { clsx } from 'clsx';
import { updateUserPasswordRequest } from '../../../api/requests/User';
import { IError, IUpdatePassword } from '../../types';
import { Inputs } from './components/Inputs';
import { Buttons } from './components/Buttons';
import { GoQuestion } from 'react-icons/go';
import { Popover } from 'antd';

interface IUpdatePassProps {
  needShowForm: boolean;
  changeNeedShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialState: IUpdatePassword = {
  email: '',
  phone: '',
};

export const UpdatePassword: FC<IUpdatePassProps> = ({ needShowForm, changeNeedShowForm }) => {
  const [formData, changeFormData] = useState<IUpdatePassword>(initialState);
  const [isApproved, changeIsApproved] = useState(false);
  const [isRequestSuccess, changeIsRequestSuccess] = useState(false);
  const [isLoading, changeIsLoading] = useState(false);

  const [error, changeError] = useState<IError | null>(null);

  const onFinish = async () => {
    if (!formData) return;
    const { email, phone } = formData;
    if (!/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      changeError({
        type: 'email',
        error:
          'Адрес электронной почты задан некорректно, пожалуйста, укажите корректные данные исходя из примера: applications@dltex.ru',
      });
      return;
    }
    if (phone && !/\+\d{11}/.test(phone)) {
      changeError({
        type: 'phone',
        error: 'Пожалуйста, укажите корректный номер телефона исходя из примера: +79372833608',
      });
      return;
    }
    changeIsLoading((prev) => !prev);
    const response = await updateUserPasswordRequest(formData);
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
        if (isApproved) changeIsApproved(false);
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
      <div className='bg-blue-700 bg-opacity-10 backdrop-blur-xl rounded-md max-sm:max-w-[250px] max-sm:min-w-[250px] min-w-[500px] max-w-[500px] h-fit p-4 max-sm:p-2 flex flex-col gap-y-4 max-sm:gap-y-2'>
        <div className='text-xl font-bold sm:text-center'>Обновление пароля</div>
        <Popover
          className='animate-bounce'
          placement='left'
          content={
            <div className='w-[250px] overflow-y-auto aspect-square'>
              <span>
                Если Вы являетесь диспетчером или исполнителем укажите только адрес электронной
                почты
              </span>
              <br />
              <br />
              <span>
                Если Ваш аккаунт имеет хотя бы одну подтвержденную собственность, то, чтобы сбросить
                пароль, укажите почту, на который был зарегистрирован аккаунт, кликните на текст
                "Мой аккаунт подтвержден", введите номер телефона, указанный в личном кабинете.
              </span>
              <br />
              <br />
              <span>
                Если Ваш аккаунт не имеет подтвержденных собственностей, укажите только адрес
                электронной почты, на который был зарегистрирован аккаунт.
              </span>
              <br />
              <br />
              <span>
                При успешном сбросе пароля на Вашу почту будет выслано письмо с логином и паролем
                для входа
              </span>
            </div>
          }
        >
          <GoQuestion className='absolute top-4 right-4 text-black inline text-lg inset-y-0' />
        </Popover>
        <Inputs
          error={error}
          changeError={changeError}
          data={formData}
          changeFormData={changeFormData}
          isApproved={isApproved}
          changeIsApproved={changeIsApproved}
        />
        <div className='text-left mt-4 max-sm:mt-2 text-gray-600 text-sm bg-blue-300 rounded-md backdrop-blur-md bg-opacity-50'>
          <span className='text-red-500'>Внимание! </span>Чтобы восстановить пароль вам нужно иметь
          доступ к почте, на который был зарегистрирован аккаунт.
        </div>
        <Buttons
          isLoading={isLoading}
          changeNeedShowForm={changeNeedShowForm}
          initialState={initialState}
          changeFormData={changeFormData}
          error={error}
          changeError={changeError}
          isRequestSuccess={isRequestSuccess}
          data={formData}
          onFinish={onFinish}
          isApproved={isApproved}
          changeIsApproved={changeIsApproved}
        />
      </div>
    </div>
  );
};
