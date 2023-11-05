import clsx from 'clsx';
import Styles from '../Init.module.scss';
import { AiOutlineCaretLeft, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FC, useState } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';
import { IError, IRegRequest } from '../../types';

interface IRegistrationProps {
  changeSetDuration: (IsSetDuration: boolean) => void;
  IsSetDuration: boolean;
}

export const Registration: FC<IRegistrationProps> = ({ changeSetDuration, IsSetDuration }) => {
  const error = useTypedSelector((state) => state.RegReducer.error);
  const isLoading = useTypedSelector((state) => state.RegReducer.isLoading);
  const [IsRegActive, changeIsActiveReg] = useState<boolean>(false);
  const { regError, regStart, regSuccess } = useActions();
  const [regInputs, changeRegInputs] = useState<IRegRequest>({
    userName: '',
    email: '',
    password: '',
  });

  const stateChanger = () => {
    changeIsActiveReg(!IsRegActive);
    if (!IsSetDuration) {
      setTimeout(() => {
        changeSetDuration(true);
      }, 800);
    } else changeSetDuration(false);
  };

  const regButtonEvent = () => {
    var errorArray: IError[] | null = null;
    regStart();
    setTimeout(() => {
      if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(regInputs.email)) {
        const erObject: IError = { type: 'email', error: 'Неверно указана почта' };
        errorArray = [erObject];
      }
      if (!/^[0-9]{4}$/.test(regInputs.password)) {
        const erObject: IError = { type: 'password', error: 'Неверный пароль' };
        errorArray = errorArray ? [...errorArray, erObject] : [erObject];
      }
      if (
        !/^[а-яА-Я]*$/.test(regInputs.userName) ||
        regInputs.userName.length > 50 ||
        regInputs.userName === ''
      ) {
        const erObject: IError = {
          type: 'userName',
          error: 'Неверно задано имя пользователя',
        };
        errorArray = errorArray ? [...errorArray, erObject] : [erObject];
      }

      if (!errorArray) regSuccess(regInputs);
      else regError(errorArray);
    }, 2000);
  };

  return (
    <section className={clsx(Styles.reg, IsRegActive && Styles.reg_active)}>
      <div
        className={clsx('flex h-full items-center justify-center cursor-pointer w-[25px]')}
        onClick={stateChanger}
      >
        <AiOutlineCaretLeft className={clsx(Styles.arrow, IsRegActive && 'rotate-180')} />
      </div>
      <div
        className={clsx(
          Styles.reg_box,
          IsRegActive && Styles.box_active_duration,
          IsSetDuration && Styles.reg_box_active,
          !IsRegActive && 'hidden',
        )}
      >
        <span className={clsx(Styles.mainText, IsRegActive && 'text-white')}>Регистрация</span>
        <div className={Styles.inputBlock}>
          <input
            type='text'
            placeholder='Имя пользователя'
            maxLength={8}
            value={regInputs.userName}
            onChange={(e) => changeRegInputs({ ...regInputs, userName: e.target.value })}
          />
          <span
            className={clsx(
              'transition-opacity text-red-300',
              error !== null && error.some((el) => el.type === 'userName')
                ? 'opacity-100'
                : 'opacity-0',
            )}
          >
            {error !== null && error.some((el) => el.type === 'userName')
              ? error.filter((el) => el.type === 'userName')[0].error
              : ''}
          </span>
          <input
            type='text'
            placeholder='Почта'
            value={regInputs.email}
            onChange={(e) => changeRegInputs({ ...regInputs, email: e.target.value })}
          />
          <span
            className={clsx(
              'transition-opacity text-red-300',
              error !== null && error.some((el) => el.type === 'email')
                ? 'opacity-100'
                : 'opacity-0',
            )}
          >
            {error !== null && error.some((el) => el.type === 'email')
              ? error.filter((el) => el.type === 'email')[0].error
              : ''}
          </span>
          <input
            type='password'
            placeholder='Пароль'
            maxLength={4}
            value={regInputs.password}
            onChange={(e) => changeRegInputs({ ...regInputs, password: e.target.value })}
          />
          <span
            className={clsx(
              'transition-opacity text-red-300',
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
          onClick={regButtonEvent}
          className={clsx(
            Styles.button,
            'bg-white border-blue-300 border-t-white hover:border-white hover:border-t-blue-300',
          )}
        >
          {isLoading && (
            <div className='flex justify-center items-center'>
              <AiOutlineLoading3Quarters className='animate-spin mr-2 text-blue-500' />
              <span className='leading-1 mb-1 text-blue-500'>вход в систему</span>
            </div>
          )}
          {!isLoading && <span className='text-blue-500'>Зарегистрироваться</span>}
        </button>
      </div>
    </section>
  );
};
