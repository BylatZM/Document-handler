import clsx from 'clsx';
import { FC } from 'react';
import { BsBuildingFill, BsFillBuildingsFill } from 'react-icons/bs';
import { FaUserCheck } from 'react-icons/fa6';
import { GrNext, GrStatusGood } from 'react-icons/gr';
import { Link } from 'react-router-dom';

interface IProps {
  activeAccordion: string | null;
  changeActiveAccordion: React.Dispatch<React.SetStateAction<string | null>>;
  pathname: string;
}

export const Confirmations: FC<IProps> = ({ changeActiveAccordion, activeAccordion, pathname }) => {
  return (
    <>
      <button
        onClick={() => changeActiveAccordion((prev) => (!prev ? 'confirmations' : null))}
        className='flex items-center justify-between py-2 rounded-md text-lg bg-gray-300 mb-4 h-[45px] overflow-hidden'
      >
        <div className='flex ml-4 items-center'>
          <GrStatusGood className='mr-4' />
          <span>Подтверждение</span>
        </div>
        <GrNext
          className={clsx(
            'transitionGeneral mr-6',
            activeAccordion === 'confirmations' && 'rotate-90',
          )}
        />
      </button>
      <div
        className={clsx(
          'transitionGeneral flex flex-col overflow-hidden',
          activeAccordion === 'confirmations' ? 'h-[120px]' : 'h-0',
        )}
      >
        <Link
          to={'/account/approve/citizen_possession'}
          className={clsx(
            'flex items-center py-2 rounded-md text-lg mb-4',
            pathname.includes('/account/approve/citizen_possession')
              ? 'text-blue-700 blue-300 bg-blue-300'
              : 'bg-gray-300',
          )}
        >
          <BsBuildingFill className='mr-4 ml-4' />
          <span>Имущество жителя</span>
        </Link>
        <Link
          to={'/account/approve/living_space'}
          className={clsx(
            'flex items-center py-2 rounded-md text-lg mb-4',
            pathname.includes('/account/approve/living_space')
              ? 'text-blue-700 blue-300 bg-blue-300'
              : 'bg-gray-300',
          )}
        >
          <BsFillBuildingsFill className='mr-4 ml-4' />
          <span>Адрес жил. площади</span>
        </Link>
      </div>
    </>
  );
};
