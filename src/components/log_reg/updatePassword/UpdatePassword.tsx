import { FC, useState } from 'react';
import { clsx } from 'clsx';
import { updatePasswordRequest } from '../../../api/requests/Main';
import { IError, IUpdatePassword } from '../../types';
import { Inputs } from './components/Inputs';
import { Buttons } from './components/Buttons';
import { Title } from './components/Title';

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
      <div className='bg-blue-700 bg-opacity-10 backdrop-blur-xl z-[40] rounded-md max-sm:max-w-[250px] max-sm:min-w-[250px] max-sm:mx-auto sm:min-w-[500px] sm:max-w-[500px] h-fit p-2 sm:p-5'>
        <Title />
        <Inputs
          error={error}
          changeError={changeError}
          data={formData}
          changeFormData={changeFormData}
          isApproved={isApproved}
          changeIsApproved={changeIsApproved}
        />
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
