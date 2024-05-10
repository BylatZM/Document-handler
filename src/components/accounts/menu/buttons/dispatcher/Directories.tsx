import clsx from 'clsx';
import { FC } from 'react';
import { BsBuildingFill } from 'react-icons/bs';
import { GoFileDirectoryFill } from 'react-icons/go';
import { GrNext } from 'react-icons/gr';
import { IAccordionState } from '../../../../types';

interface IProps {
  activeAccordion: IAccordionState;
  changeActiveAccordion: React.Dispatch<React.SetStateAction<IAccordionState>>;
  changeNeedShowCreatePossessionForm: React.Dispatch<React.SetStateAction<boolean>>;
  changeIsMenuOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Directories: FC<IProps> = ({
  changeActiveAccordion,
  activeAccordion,
  changeNeedShowCreatePossessionForm,
  changeIsMenuOpened,
}) => {
  return (
    <>
      <button
        onClick={() => {
          changeActiveAccordion((prev) => {
            if (prev.directories) return { ...prev, directories: false };
            else return { ...prev, directories: true };
          });
        }}
        className='flex items-center justify-between py-2 rounded-md text-lg bg-gray-300 mb-4 h-[45px] overflow-hidden'
      >
        <div className='flex ml-4 items-center'>
          <GoFileDirectoryFill className='mr-4' />
          <span>Справочники</span>
        </div>
        <GrNext
          className={clsx('transitionFast mr-6', activeAccordion.directories && 'rotate-90')}
        />
      </button>
      <div
        className={clsx(
          'transitionFast flex flex-col gap-y-4 overflow-hidden',
          activeAccordion.directories ? 'h-[60px]' : 'h-0',
        )}
      >
        <button
          onClick={() => {
            changeNeedShowCreatePossessionForm(true);
            changeIsMenuOpened(false);
          }}
          className={clsx('flex items-center py-2 rounded-md text-lg bg-gray-300')}
        >
          <BsBuildingFill className='mr-4 ml-5' />
          <span>Собственность</span>
        </button>
      </div>
    </>
  );
};
