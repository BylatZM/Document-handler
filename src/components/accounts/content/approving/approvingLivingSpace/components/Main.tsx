import { Button } from 'antd';
import clsx from 'clsx';
import { FC } from 'react';
import { Possession } from './Possession';
import { INotApprovedLivingSpace } from '../../../../../types';

interface IProps {
  selectedPossession: INotApprovedLivingSpace | null;
  changeSelectedPossession: React.Dispatch<React.SetStateAction<INotApprovedLivingSpace | null>>;
}

export const Main: FC<IProps> = ({ selectedPossession, changeSelectedPossession }) => {
  return (
    <div
      className={clsx(
        'transitionGeneral fixed inset-0 overflow-hidden min-h-screen bg-blue-700 bg-opacity-10 backdrop-blur-xl z-50 flex justify-center items-center',
        selectedPossession ? 'w-full' : 'w-0',
      )}
    >
      <div
        className={clsx(
          'flex flex-col justify-between rounded-md bg-blue-700 p-[5px] sm:p-[20px] bg-opacity-10 backdrop-blur-xl min-w-[270px] max-w-[270px] h-[600px] sm:min-w-[600px] sm:max-w-[600px] sm:h-[600px] overflow-hidden',
        )}
      >
        <span className='font-bold text-lg sm:text-2xl mb-1'>Информация о жил. площади</span>
        <Possession selectedPossession={selectedPossession} />
        <div className='text-end'>
          <Button
            className='border-[1px] border-black text-black h-[40px]'
            onClick={() => changeSelectedPossession(null)}
          >
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  );
};
