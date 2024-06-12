import { FC } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { HiMiniVideoCamera } from 'react-icons/hi2';

interface IProps {
  pathname: string;
  changeIsMenuOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Camera: FC<IProps> = ({ pathname, changeIsMenuOpened }) => {
  return (
    <Link
      to={'/account/camera'}
      onClick={() => changeIsMenuOpened(false)}
      className={clsx(
        'flex items-center py-2 rounded-md text-lg mb-4 h-[45px] overflow-hidden',
        pathname === '/account/camera' ? 'text-blue-700 bg-blue-300' : 'bg-gray-300',
      )}
    >
      <HiMiniVideoCamera className='mr-4 ml-4' />
      <span>Видео камеры</span>
    </Link>
  );
};
