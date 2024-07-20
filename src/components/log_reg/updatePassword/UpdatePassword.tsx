import { FC, useState } from 'react';
import { clsx } from 'clsx';
import { updateUserPasswordRequest } from '../../../api/requests/User';
import { IError, IUpdatePassword } from '../../types';
import { Inputs } from './components/Inputs';
import { Buttons } from './components/Buttons';
import { Form } from 'antd';
import { Info } from './components/Info';
import { FakeUpdatePassword } from './FakeUpdatePassword';

interface IUpdatePassProps {
  needShowForm: boolean;
  changeNeedShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UpdatePassword: FC<IUpdatePassProps> = ({ needShowForm, changeNeedShowForm }) => {
  const [isApproved, changeIsApproved] = useState(false);
  const [isRequestSuccess, changeIsRequestSuccess] = useState(false);
  const [isLoading, changeIsLoading] = useState(false);

  const [error, changeError] = useState<IError | null>(null);

  const onFinish = async (info: IUpdatePassword) => {
    const { email, phone } = info;
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
    const response = await updateUserPasswordRequest(info);
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
      }, 2000);
    }
  };

  const formItemLayout = {
    labelCol: {
      span: 24,
    },
  };

  return (
    <div
      className={clsx(
        'transitionGeneral bg-blue-500 bg-opacity-10 backdrop-blur-xl z-[30] fixed inset-y-0 left-0 min-h-screen overflow-hidden flex justify-center items-center',
        needShowForm ? 'w-full' : 'w-0',
      )}
    >
      <div className='bg-blue-700 bg-opacity-10 backdrop-blur-xl rounded-md max-sm:max-w-[250px] max-sm:min-w-[250px] min-w-[500px] max-w-[500px] h-fit p-4 max-sm:p-2 flex flex-col gap-y-4 max-sm:gap-y-2 max-h-[90%] overflow-y-auto'>
        <div className='text-xl font-bold text-center'>Обновление пароля</div>
        {needShowForm && (
          <Form {...formItemLayout} name='update_password_form' onFinish={onFinish}>
            <Inputs error={error} />
            <Info />
            <Buttons
              isLoading={isLoading}
              changeNeedShowForm={changeNeedShowForm}
              error={error}
              isRequestSuccess={isRequestSuccess}
            />
          </Form>
        )}
        {!needShowForm && <FakeUpdatePassword />}
      </div>
    </div>
  );
};
