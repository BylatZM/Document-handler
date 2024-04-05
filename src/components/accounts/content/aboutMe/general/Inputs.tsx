import { Input } from 'antd';
import { IError, IUser } from '../../../../types';
import { FC } from 'react';
import { useActionType, useActions } from '../../../../hooks/useActions';
import clsx from 'clsx';

interface IProps {
  user: IUser;
  isLoading: boolean;
  error: IError | null;
  setUser: Pick<useActionType, 'userSuccess'>;
}

export const Inputs: FC<IProps> = ({ user, isLoading, error, setUser }) => {
  const getRole = (): string => {
    if (user.role === 'citizen') return 'житель';
    if (user.role === 'dispatcher') return 'диспетчер';
    if (user.role === 'executor') return 'исполнитель';
    return '';
  };
  const { userError } = useActions();
  return (
    <>
      <div className='text-sm flex justify-between'>
        <span>Статус аккаунта</span>
        {!user.email && <span className=' underline text-sm font-bold text-blue-500'>Новый</span>}
        {user.email && (
          <span
            className={clsx(
              'underline text-sm font-bold',
              user.account_status === 'На подтверждении' && ' text-amber-500',
              user.account_status === 'Отклонен' && ' text-red-500',
              user.account_status === 'Подтвержден' && ' text-green-500',
            )}
          >
            {user.account_status}
          </span>
        )}
      </div>
      <div className='text-sm'>
        <span>Почта</span>
        <Input disabled value={user.email} />
      </div>
      <div className='text-sm'>
        <span>Роль</span>
        <Input value={getRole()} disabled />
      </div>
      <div className='text-sm'>
        <span>Имя</span>
        <Input
          maxLength={30}
          disabled={isLoading}
          status={error && error.type === 'first_name' ? 'error' : undefined}
          value={user.first_name}
          onChange={(e) => {
            if (error && error.type === 'first_name') userError(null);
            setUser.userSuccess({ ...user, first_name: e.target.value });
          }}
        />
        {error && error.type === 'first_name' && <div className='errorText'>{error.error}</div>}
      </div>
      <div className='text-sm'>
        <span>Фамилия</span>
        <Input
          maxLength={30}
          disabled={isLoading}
          status={error && error.type === 'last_name' ? 'error' : undefined}
          value={user.last_name}
          onChange={(e) => {
            if (error && error.type === 'last_name') userError(null);
            setUser.userSuccess({ ...user, last_name: e.target.value });
          }}
        />
        {error && error.type === 'last_name' && <div className='errorText'>{error.error}</div>}
      </div>
      <div className='text-sm'>
        <span>Отчество</span>
        <Input
          maxLength={30}
          disabled={isLoading}
          status={error && error.type === 'patronymic' ? 'error' : undefined}
          value={!user.patronymic ? '' : user.patronymic}
          onChange={(e) => {
            if (error && error.type === 'patronymic') userError(null);
            setUser.userSuccess({ ...user, patronymic: e.target.value });
          }}
        />
        {error && error.type === 'patronymic' && <div className='errorText'>{error.error}</div>}
      </div>
      <div className='text-sm'>
        <span>Номер телефона</span>
        <Input
          maxLength={12}
          disabled={isLoading}
          placeholder='+79372833608'
          status={error && error.type === 'phone' ? 'error' : undefined}
          value={
            !user.phone || (user.phone && user.phone.length < 3 && user.phone !== '+7')
              ? '+7'
              : user.phone
          }
          onChange={(e) => {
            if (error && error.type === 'phone') userError(null);
            setUser.userSuccess({ ...user, phone: e.target.value });
          }}
        />
        {error && error.type === 'phone' && <div className='errorText'>{error.error}</div>}
      </div>
    </>
  );
};
