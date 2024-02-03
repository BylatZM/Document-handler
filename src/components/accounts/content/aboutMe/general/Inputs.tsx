import { Input } from 'antd';
import { IError, IUser } from '../../../../types';
import { FC } from 'react';
import { useActionType } from '../../../../hooks/useActions';
import clsx from 'clsx';

interface IProps {
  user: IUser;
  isLoading: boolean;
  error: IError | null;
  setUser: Pick<useActionType, 'userSuccess'>;
}

export const Inputs: FC<IProps> = ({ user, isLoading, error, setUser }) => {
  const getRole = (): string => {
    if (user.role.role === 'citizen') return 'житель';
    if (user.role.role === 'dispatcher') return 'диспетчер';
    if (user.role.role === 'executor') return 'исполнитель';
    return '';
  };
  return (
    <>
      <div className='text-sm'>
        <span>Почта</span>
        <Input disabled={true} value={user.email} />
      </div>
      <div className='text-sm'>
        <span>Роль</span>
        <Input value={getRole()} disabled={true} />
      </div>
      <div className='text-sm'>
        <span>Имя</span>
        <Input
          maxLength={30}
          disabled={isLoading}
          status={error && error.type === 'first_name' ? 'error' : undefined}
          value={user.first_name}
          onChange={(e) => setUser.userSuccess({ ...user, first_name: e.target.value })}
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
          onChange={(e) => setUser.userSuccess({ ...user, last_name: e.target.value })}
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
          onChange={(e) => setUser.userSuccess({ ...user, patronymic: e.target.value })}
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
          onChange={(e) => setUser.userSuccess({ ...user, phone: e.target.value })}
        />
        {error && error.type === 'phone' && <div className='errorText'>{error.error}</div>}
      </div>
    </>
  );
};
