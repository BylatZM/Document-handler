import { FC } from 'react';
import { IoDocuments } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface IProps {
  pathname: string;
}

export const Applications: FC<IProps> = ({ pathname }) => {
  return (
    <Link
      to={'/account/applications'}
      className={clsx(
        'flex items-center py-2 rounded-md text-lg mb-4 h-[45px] overflow-hidden',
        pathname === '/account/applications' ? 'text-blue-700 bg-blue-300' : 'bg-gray-300',
      )}
    >
      <IoDocuments className='mr-4 ml-4' />
      <span>Заявки</span>
    </Link>
  );
};
