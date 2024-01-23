import clsx from 'clsx';
import { FC } from 'react';
import { FaUserCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const AboutMe: FC<{ pathname: string }> = ({ pathname }) => {
  return (
    <Link
      to={'/account/aboutMe'}
      className={clsx(
        'flex items-center min-w-full rounded-md py-2 text-lg mb-4 h-[45px] overflow-hidden',
        pathname.includes('/account/aboutMe') ? 'text-blue-700 bg-blue-300' : 'bg-gray-300',
      )}
    >
      <FaUserCog className='mr-4 ml-4' />
      <span>Обо мне</span>
    </Link>
  );
};
