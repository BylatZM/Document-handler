import { Popover } from 'antd';
import { FC } from 'react';
import { IoDocuments } from 'react-icons/io5';
import { ICitizen, IRole } from '../../../../types';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

interface IProps {
  isApproved: boolean;
  role: IRole;
  citizen: ICitizen[];
  pathname: string;
}

export const Applications: FC<IProps> = ({ isApproved, role, citizen, pathname }) => {
  const navigate = useNavigate();
  return (
    <Popover
      content={
        (!isApproved || !citizen[0].id) &&
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
          (!isApproved || !citizen[0].id) && role.role !== 'dispatcher' && role.role !== 'executor'
            ? true
            : false
        }
        className={clsx(
          'flex items-center py-2 rounded-md text-lg mb-4 h-[45px] overflow-hidden',
          pathname.includes('/account/applications') && isApproved
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
