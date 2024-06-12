import { Input } from 'antd';
import { IAboutMeGeneralSteps, IError, IUser } from '../../../../types';
import { FC } from 'react';
import { useActionType, useActions } from '../../../../hooks/useActions';
import clsx from 'clsx';

interface IProps {
  user: IUser;
  isLoading: boolean;
  error: IError | null;
  setUser: Pick<useActionType, 'userSuccess'>;
  setPersonalSteps: React.Dispatch<React.SetStateAction<IAboutMeGeneralSteps>>;
  personalSteps: IAboutMeGeneralSteps;
}

export const Inputs: FC<IProps> = ({
  user,
  isLoading,
  error,
  setUser,
  setPersonalSteps,
  personalSteps,
}) => {
  const getRole = (): string => {
    if (user.role === 'citizen') return 'житель';
    if (user.role === 'dispatcher') return 'диспетчер';
    if (user.role === 'executor') return 'исполнитель';
    return '';
  };
  const { userError } = useActions();
  return (
    <>
      <div className='text-sm'>
        <span>Почта</span>
        <Input className='max-sm:h-[30px] h-[40px]' disabled value={user.email} />
      </div>
      <div className='text-sm'>
        <span>Роль</span>
        <Input className='max-sm:h-[30px] h-[40px]' value={getRole()} disabled />
      </div>
      <div className='text-sm'>
        <span>Имя</span>
        <div className='relative'>
          <div
            className={clsx(
              !user.first_name && localStorage.getItem('citizen_registered')
                ? 'heartbeat absolute inset-0 bg-blue-700 rounded-md'
                : 'hidden',
            )}
          ></div>
          <Input
            maxLength={30}
            disabled={isLoading}
            className={clsx('max-sm:h-[30px] h-[40px]')}
            status={error && error.type === 'first_name' ? 'error' : undefined}
            value={user.first_name}
            onChange={(e) => {
              if (
                e.target.value &&
                !personalSteps.first_name &&
                localStorage.getItem('citizen_registered')
              )
                setPersonalSteps((prev) => ({ ...prev, first_name: true }));
              if (error && error.type === 'first_name') userError(null);
              setUser.userSuccess({ ...user, first_name: e.target.value });
            }}
          />
        </div>
        {error && error.type === 'first_name' && <div className='errorText'>{error.error}</div>}
      </div>
      <div className='text-sm'>
        <span>Фамилия</span>
        <div className='relative'>
          <div
            className={clsx(
              !user.last_name && localStorage.getItem('citizen_registered')
                ? 'heartbeat absolute inset-0 bg-blue-700 rounded-md'
                : 'hidden',
            )}
          ></div>
          <Input
            maxLength={30}
            disabled={isLoading}
            status={error && error.type === 'last_name' ? 'error' : undefined}
            value={user.last_name}
            className='max-sm:h-[30px] h-[40px]'
            onChange={(e) => {
              if (
                e.target.value &&
                !personalSteps.last_name &&
                localStorage.getItem('citizen_registered')
              )
                setPersonalSteps((prev) => ({ ...prev, last_name: true }));
              if (error && error.type === 'last_name') userError(null);
              setUser.userSuccess({ ...user, last_name: e.target.value });
            }}
          />
        </div>
        {error && error.type === 'last_name' && <div className='errorText'>{error.error}</div>}
      </div>
      <div className='text-sm'>
        <span>Отчество</span>
        <Input
          maxLength={30}
          disabled={isLoading}
          status={error && error.type === 'patronymic' ? 'error' : undefined}
          value={!user.patronymic ? '' : user.patronymic}
          className='max-sm:h-[30px] h-[40px]'
          onChange={(e) => {
            if (error && error.type === 'patronymic') userError(null);
            setUser.userSuccess({ ...user, patronymic: e.target.value });
          }}
        />
        {error && error.type === 'patronymic' && <div className='errorText'>{error.error}</div>}
      </div>
      <div className='text-sm'>
        <span>Номер телефона</span>
        <div className='relative'>
          <div
            className={clsx(
              !user.phone && localStorage.getItem('citizen_registered')
                ? 'heartbeat absolute inset-0 bg-blue-700 rounded-md'
                : 'hidden',
            )}
          ></div>
          <Input
            maxLength={12}
            disabled={isLoading}
            placeholder='+79372833608'
            className='max-sm:h-[30px] h-[40px]'
            status={error && error.type === 'phone' ? 'error' : undefined}
            value={
              !user.phone || (user.phone && user.phone.length < 3 && user.phone !== '+7')
                ? '+7'
                : user.phone
            }
            onChange={(e) => {
              if (
                e.target.value &&
                !personalSteps.phone &&
                localStorage.getItem('citizen_registered')
              )
                setPersonalSteps((prev) => ({ ...prev, phone: true }));
              if (error && error.type === 'phone') userError(null);
              setUser.userSuccess({ ...user, phone: e.target.value });
            }}
          />
        </div>
        {error && error.type === 'phone' && <div className='errorText'>{error.error}</div>}
      </div>
    </>
  );
};
