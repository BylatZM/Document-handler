import clsx from 'clsx';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { IAuthRequest, IError } from '../../types';
import Styles from '../Init.module.scss';
import { useState, FC } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface ILoginProps {
  IsSetDuration: boolean;
}

export const Login: FC<ILoginProps> = ({ IsSetDuration }) => {
  const error = useTypedSelector((state) => state.AuthReducer.error);
  const isLoading = useTypedSelector((state) => state.AuthReducer.isLoading);
  const { loginStart, loginError, loginSuccess } = useActions();
  const [authInputs, changeAuthInputs] = useState<IAuthRequest>({ login: '', password: '' });

  const authButtonEvent = () => {
    var errorArray: IError[] | null = null;
    loginStart();
    setTimeout(() => {
      if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(authInputs.login)) {
        const erObject: IError = { type: 'email', error: 'Неверный логин' };
        errorArray = [erObject];
      }
      if (!/^[0-9]{4}$/.test(authInputs.password)) {
        const erObject: IError = { type: 'password', error: 'Неверный пароль' };
        errorArray = errorArray !== null ? [...errorArray, erObject] : [erObject];
      }

      if (!errorArray) loginSuccess(authInputs);
      else loginError(errorArray);
    }, 2000);
  };

  return (
    <>
      <span className={clsx(Styles.mainText, !IsSetDuration && 'text-blue-500')}>Авторизация</span>
      <div className={Styles.inputBlock}>
        <input
          placeholder='логин'
          type='text'
          value={authInputs.login}
          onChange={(e) => changeAuthInputs({ ...authInputs, login: e.target.value })}
        />
        <span
          className={clsx(
            'transition-opacity text-red-500',
            error !== null && error.some((el) => el.type === 'email') ? 'opacity-100' : 'opacity-0',
          )}
        >
          {error !== null && error.some((el) => el.type === 'email')
            ? error.filter((el) => el.type === 'email')[0].error
            : ''}
        </span>
        <input
          placeholder='пароль'
          type='password'
          maxLength={4}
          value={authInputs.password}
          onChange={(e) => changeAuthInputs({ ...authInputs, password: e.target.value })}
        />
        <span
          className={clsx(
            'transition-opacity text-red-500',
            error !== null && error.some((el) => el.type === 'password')
              ? 'opacity-100'
              : 'opacity-0',
          )}
        >
          {error !== null && error.some((el) => el.type === 'password')
            ? error.filter((el) => el.type === 'password')[0].error
            : ''}
        </span>
      </div>
      <button
        onClick={authButtonEvent}
        className={clsx(
          Styles.button,
          'bg-blue-500 border-blue-100 border-t-blue-500 hover:border-blue-500 hover:border-t-blue-100',
        )}
      >
        {isLoading && (
          <div className='text-white flex justify-center items-center'>
            <AiOutlineLoading3Quarters className='animate-spin mr-2' />
            <span className='leading-1 mb-1'>вход в систему</span>
          </div>
        )}
        {!isLoading && <span className='text-white'>Войти</span>}
      </button>
    </>
  );
};
