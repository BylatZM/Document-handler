import { FC } from 'react';
import { RiLogoutBoxFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

export const Logout: FC<{ logout: () => void }> = ({ logout }) => {
  const navigate = useNavigate();
  return (
    <button
      className='flex items-center cursor-pointer py-2 rounded-md text-lg border-none bg-gray-300 h-[45px] overflow-hidden'
      onClick={() => {
        logout();
        navigate('/');
      }}
    >
      <RiLogoutBoxFill className='mr-4 ml-4' />
      <span>Выйти</span>
    </button>
  );
};
