import clsx from 'clsx';
import { FC } from 'react';
import { IoClose } from 'react-icons/io5';

interface IProps {
  needShow: boolean;
  changeNeedShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Player: FC<IProps> = ({ needShow, changeNeedShow }) => {
  return (
    <div
      className={clsx(
        'transitionGeneral z-20 fixed inset-0 m-auto flex justify-center items-center bg-black backdrop-blur-sm bg-opacity-30 overflow-hidden',
        needShow ? 'w-full h-full' : 'w-0 h-0',
      )}
    >
      <button
        className={clsx(
          'absolute right-5 top-5 text-black',
          needShow ? 'player opacity-100' : 'opacity-0',
        )}
        onClick={() => changeNeedShow(false)}
      >
        <IoClose className='text-3xl' />
      </button>
      <div className='max-sm:w-full max-sm:h-3/4 sm:w-[640px] sm:h-[480px]'>
        <iframe
          title='player'
          allowFullScreen
          className={clsx('w-full h-full', needShow ? 'player opacity-100' : 'opacity-0')}
          src='https://rtsp.me/embed/kBdTSZei/'
        ></iframe>
      </div>
    </div>
  );
};
