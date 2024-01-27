import clsx from 'clsx';
import { FC } from 'react';
import { BsBuildingFill } from 'react-icons/bs';
import { GoFileDirectoryFill } from 'react-icons/go';
import { GrNext } from 'react-icons/gr';

interface IProps {
  activeAccordion: string | null;
  changeActiveAccordion: React.Dispatch<React.SetStateAction<string | null>>;
  changeNeedShowPossessionCreateForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Directories: FC<IProps> = ({
  changeActiveAccordion,
  activeAccordion,
  changeNeedShowPossessionCreateForm,
}) => {
  return (
    <>
      <button
        onClick={() => changeActiveAccordion((prev) => (!prev ? 'directories' : null))}
        className='flex items-center justify-between py-2 rounded-md text-lg bg-gray-300 mb-4 h-[45px] overflow-hidden'
      >
        <div className='flex ml-4 items-center'>
          <GoFileDirectoryFill className='mr-4' />
          <span>Справочники</span>
        </div>
        <GrNext
          className={clsx(
            'transitionGeneral mr-6',
            activeAccordion === 'directories' && 'rotate-90',
          )}
        />
      </button>
      <div
        className={clsx(
          'transitionGeneral flex flex-col gap-y-4 overflow-hidden',
          activeAccordion === 'directories' ? 'h-[60px]' : 'h-0',
        )}
      >
        <button
          onClick={() => changeNeedShowPossessionCreateForm(true)}
          className={clsx('flex items-center py-2 rounded-md text-lg bg-gray-300')}
        >
          <BsBuildingFill className='mr-4 ml-5' />
          <span>Собственность</span>
        </button>
      </div>
    </>
  );
};
