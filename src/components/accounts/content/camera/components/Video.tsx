import { FaPlay } from 'react-icons/fa';
import { IoPause } from 'react-icons/io5';
import { clsx } from 'clsx';
import { FC } from 'react';
import './style.css';

interface IProps {
  changeNeedShow: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
}

export const Video: FC<IProps> = ({ changeNeedShow, title }) => {
  return (
    <div className='flex flex-col gap-y-1 items-center text-center'>
      <button
        onClick={() => changeNeedShow(true)}
        className={clsx(
          'aspect-square rounded-sm justify-self-center bg-blue-700 bg-opacity-30 flex justify-center video',
          'max-sm:w-[80px] sm:w-[110px] md:w-[130px] lg:w-[150px]',
        )}
      >
        <div className='flex frame relative aspect-square justify-center self-center items-center border-[1px] border-solid border-white rounded-sm text-white'>
          <FaPlay className='play sm:text-xl lg:text-3xl max-sm:text-base absolute inset-0 m-auto' />
          <IoPause className='pause sm:text-2xl lg:text-4xl max-sm:text-base absolute inset-0 m-auto' />
        </div>
      </button>
      <span className='max-sm:text-sm lg:text-lg'>Камера {title}</span>
    </div>
  );
};
