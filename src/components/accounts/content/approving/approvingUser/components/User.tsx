import { Button, Carousel } from 'antd';
import clsx from 'clsx';
import { GrCaretNext } from 'react-icons/gr';
import { FC, useRef } from 'react';
import { BaseInfo } from './BaseInfo';
import { Possessions } from './Possessions';
import { IUserDetailsInfo } from '../../../../../types';

interface IProps {
  isFormActive: boolean;
  changeIsFormActive: (isFormActive: boolean) => void;
  selectedUserInfo: IUserDetailsInfo | null;
  changeUserInfo: React.Dispatch<React.SetStateAction<IUserDetailsInfo | null>>;
}

export const User: FC<IProps> = ({
  isFormActive,
  changeIsFormActive,
  selectedUserInfo,
  changeUserInfo,
}) => {
  const CarouselMethods = useRef<any>(null);

  return (
    <div
      className={clsx(
        'transitionGeneral fixed inset-0 overflow-hidden min-h-screen bg-blue-700 bg-opacity-10 backdrop-blur-xl z-50 flex justify-center items-center',
        isFormActive ? 'w-full' : 'w-0',
      )}
    >
      <div className='flex w-fit h-fit'>
        <button className='bg-none' onClick={() => CarouselMethods.current.prev()}>
          <GrCaretNext className='text-3xl rotate-180 hover:scale-150' />
        </button>
        <div
          className={clsx(
            'flex flex-col justify-between rounded-md bg-blue-700 p-[5px] sm:p-[20px] bg-opacity-10 backdrop-blur-xl w-[270px] h-[500px] sm:w-[600px] sm:h-[500px]',
          )}
        >
          <span className='font-bold text-lg sm:text-2xl mb-2'>Информация о жителе</span>
          <Carousel
            autoplay={false}
            dots={false}
            ref={CarouselMethods}
            className='overflow-hidden w-[260px] h-[400px] sm:w-[560px] sm:h-[380px]'
          >
            <BaseInfo data={selectedUserInfo} />
            <Possessions selectedUserInfo={selectedUserInfo} />
          </Carousel>
          <div className='text-end'>
            <Button
              className='border-[1px] border-black text-black h-[40px]'
              onClick={() => {
                changeUserInfo(null);
                changeIsFormActive(false);
              }}
            >
              Закрыть
            </Button>
          </div>
        </div>
        <button className='bg-none' onClick={() => CarouselMethods.current.next()}>
          <GrCaretNext className='text-3xl hover:scale-150' />
        </button>
      </div>
    </div>
  );
};
