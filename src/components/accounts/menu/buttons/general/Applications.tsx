import { FC } from 'react';
import { IoDocuments } from 'react-icons/io5';
import { IRole, IUserAccountStatus } from '../../../../types';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

interface IProps {
  account_status: IUserAccountStatus;
  role: IRole;
  pathname: string;
}

export const Applications: FC<IProps> = ({ account_status, role, pathname }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/account/applications')}
      disabled={role !== 'citizen' && role !== 'dispatcher' && role !== 'executor' ? true : false}
      className={clsx(
        'flex items-center py-2 rounded-md text-lg mb-4 h-[45px] overflow-hidden',
        pathname === '/account/applications' && account_status === 'Подтвержден'
          ? 'text-blue-700 bg-blue-300'
          : 'bg-gray-300',
      )}
    >
      <IoDocuments className='mr-4 ml-4' />
      <span>Заявки</span>
    </button>
  );
};
