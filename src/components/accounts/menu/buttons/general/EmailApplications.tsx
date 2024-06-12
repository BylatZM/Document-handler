import { FC } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { MdOutlineEmail } from 'react-icons/md';

interface IProps {
  pathname: string;
  changeIsMenuOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EmailApplications: FC<IProps> = ({ pathname, changeIsMenuOpened }) => {
  return (
    <Link
      to={'/account/applications/email'}
      onClick={() => changeIsMenuOpened(false)}
      className={clsx(
        'flex items-center py-2 rounded-md text-lg mb-4 h-[45px] overflow-hidden',
        pathname === '/account/applications/email' ? 'text-blue-700 bg-blue-300' : 'bg-gray-300',
      )}
    >
      <MdOutlineEmail className='mr-4 ml-4' />
      <span>Заявки с почты</span>
    </Link>
  );
};
