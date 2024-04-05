import { FC } from 'react';
import { IoDocuments } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

interface IProps {
  pathname: string;
}

export const GisApplications: FC<IProps> = ({ pathname }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/account/applications/gis')}
      className={clsx(
        'flex items-center py-2 rounded-md text-lg mb-4 h-[45px] overflow-hidden',
        pathname === '/account/applications/gis' ? 'text-blue-700 bg-blue-300' : 'bg-gray-300',
      )}
    >
      <IoDocuments className='mr-4 ml-4' />
      <span>Заявки с ГИС ЖКХ</span>
    </button>
  );
};
