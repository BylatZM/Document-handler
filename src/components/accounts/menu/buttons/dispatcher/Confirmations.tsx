import clsx from 'clsx';
import { FC } from 'react';
import { BsBuildingFill, BsFillBuildingsFill } from 'react-icons/bs';
import { GrNext, GrStatusGood } from 'react-icons/gr';
import { Link } from 'react-router-dom';
import { IAccordionState } from '../../../../types';

interface IProps {
  activeAccordion: IAccordionState;
  changeActiveAccordion: React.Dispatch<React.SetStateAction<IAccordionState>>;
  pathname: string;
  changeIsMenuOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Confirmations: FC<IProps> = ({
  changeActiveAccordion,
  activeAccordion,
  pathname,
  changeIsMenuOpened,
}) => {
  return (
    <>
      <button
        onClick={() => {
          changeActiveAccordion((prev) => {
            if (prev.confirmations) return { ...prev, confirmations: false };
            else return { ...prev, confirmations: true };
          });
        }}
        className='flex items-center justify-between py-2 rounded-md text-lg bg-gray-300 mb-4 h-[45px] overflow-hidden'
      >
        <div className='flex ml-4 items-center'>
          <GrStatusGood className='mr-4' />
          <span>Подтверждение</span>
        </div>
        <GrNext
          className={clsx('transitionFast mr-6', activeAccordion.confirmations && 'rotate-90')}
        />
      </button>
      <div
        className={clsx(
          'transitionFast flex flex-col overflow-hidden',
          activeAccordion.confirmations ? 'sm:h-[120px] max-sm:h-[148px]' : 'h-0',
        )}
      >
        <Link
          to={'/account/approve/citizen_possession'}
          onClick={() => changeIsMenuOpened(false)}
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
          onClick={() => changeIsMenuOpened(false)}
          className={clsx(
            'flex items-center py-2 rounded-md text-lg mb-4',
            pathname.includes('/account/approve/living_space')
              ? 'text-blue-700 blue-300 bg-blue-300'
              : 'bg-gray-300',
          )}
        >
          <BsFillBuildingsFill className='mr-4 ml-4' />
          <span>Адрес жилой площади</span>
        </Link>
      </div>
    </>
  );
};
