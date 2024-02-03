import { Popover } from 'antd';
import { FC } from 'react';
import { IoDocuments } from 'react-icons/io5';
import { IAccStatus, ICitizen, IRole } from '../../../../types';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

interface IProps {
  account_status: IAccStatus;
  role: IRole;
  citizen: ICitizen[];
  pathname: string;
}

export const Applications: FC<IProps> = ({ account_status, role, citizen, pathname }) => {
  const navigate = useNavigate();
  return (
    <Popover
      content={
        (account_status !== 'подтвержден' || !citizen[0].id) &&
        role.role !== 'dispatcher' &&
        role.role !== 'executor' ? (
          <>
            <div>Сперва создайте собственность</div>
            <div>Укажите вашу фамилию, имя, номер телефона, отчество (при наличии)</div>
            <div>Дождитесь подтверждения аккаунта от диспетчера</div>
          </>
        ) : (
          ''
        )
      }
    >
      <button
        onClick={() => navigate('/account/applications')}
        disabled={
          (account_status !== 'подтвержден' || !citizen[0].id) &&
          role.role !== 'dispatcher' &&
          role.role !== 'executor'
            ? true
            : false
        }
        className={clsx(
          'flex items-center py-2 rounded-md text-lg mb-4 h-[45px] overflow-hidden',
          pathname.includes('/account/applications') && account_status === 'подтвержден'
            ? 'text-blue-700 bg-blue-300'
            : 'bg-gray-300',
        )}
      >
        <IoDocuments className='mr-4 ml-4' />
        <span>Заявки</span>
      </button>
    </Popover>
  );
};
