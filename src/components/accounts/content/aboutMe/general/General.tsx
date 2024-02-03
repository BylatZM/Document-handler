import { useState } from 'react';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { useActions } from '../../../../hooks/useActions';
import { updateUserRequest } from '../../../../../api/requests/Person';
import { useLogout } from '../../../../hooks/useLogout';
import { Inputs } from './Inputs';
import { ButtonBlock } from './ButtonBlock';

export const General = () => {
  const { user, isLoading, error } = useTypedSelector((user) => user.UserReducer);
  const { userSuccess, userLoading, userError } = useActions();
  const [isRequestSuccess, changeIsRequestSuccess] = useState(false);
  const logout = useLogout();

  const onFinish = async () => {
    if (user.first_name && !/^[А-Яа-я]+$/.test(user.first_name)) {
      userError({
        type: 'first_name',
        error: 'Имя может состоять только из букв русского алфавита или быть незаполненным',
      });
      return;
    }
    if (user.last_name && !/^[А-Яа-я]+$/.test(user.last_name)) {
      userError({
        type: 'last_name',
        error: 'Фамилия может состоять только из букв русского алфавита или быть незаполненным',
      });
      return;
    }
    if (user.patronymic && !/^[А-Яа-я]+$/.test(user.patronymic)) {
      userError({
        type: 'patronymic',
        error: 'Отчество может состоять только из букв русского алфавита или быть незаполненным',
      });
      return;
    }
    if ((user.phone && !/^\+\d{11}$/.test(user.phone)) || !user.phone) {
      userError({
        type: 'phone',
        error:
          'Номер телефона задан неверно, пожалуйста, введите телефон исходя из примера: +79372833608',
      });
      return;
    }
    userLoading(true);
    if (error) userError(null);

    const response = await updateUserRequest(
      {
        first_name: user.first_name,
        last_name: user.last_name,
        patronymic: user.patronymic,
        phone: user.phone,
      },
      logout,
    );
    if (response === 200) {
      changeIsRequestSuccess((prev) => !prev);
      userSuccess({
        ...user,
        first_name: user.first_name,
        last_name: user.last_name,
        patronymic: user.patronymic,
        phone: user.phone,
      });
      setTimeout(() => {
        changeIsRequestSuccess((prev) => !prev);
      }, 2000);
    }
    userLoading(false);
  };

  return (
    <div className='flex flex-col gap-y-8'>
      <span className='text-xl'>Основная информация</span>
      <Inputs user={user} isLoading={isLoading} error={error} setUser={{ userSuccess }} />
      <ButtonBlock
        error={error}
        isRequestSuccess={isRequestSuccess}
        isLoading={isLoading}
        onFinish={onFinish}
      />
    </div>
  );
};
