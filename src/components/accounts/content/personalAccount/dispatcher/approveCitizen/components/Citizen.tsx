import { Button, Carousel } from 'antd';
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector';
import clsx from 'clsx';
import { GrNext } from 'react-icons/gr';
import { FC, useRef } from 'react';
import { INotApproved } from '../../../../../../types';
import { CitizenBaseInfo } from './CitizenBaseInfo';
import { CitizenPossessions } from './CitizenPossessions';

interface CitizenProps {
  isFormActive: boolean;
  changeIsFormActive: (isFormActive: boolean) => void;
  selectedUserInfo: INotApproved | null;
  changeUserInfo: React.Dispatch<React.SetStateAction<INotApproved | null>>;
}

export const Citizen: FC<CitizenProps> = ({
  isFormActive,
  changeIsFormActive,
  selectedUserInfo,
  changeUserInfo,
}) => {
  const { isLoading } = useTypedSelector((state) => state.CitizenReducer);
  const CarouselMethods = useRef<any>(null);

  return (
    <div
      className={clsx(
        'transitionGeneral fixed inset-0 overflow-hidden min-h-screen bg-blue-700 bg-opacity-10 backdrop-blur-xl z-[20] flex justify-center items-center',
        isFormActive ? 'w-full' : 'w-0',
      )}
    >
      <div className='flex inset-0 m-auto'>
        <button className='bg-none' onClick={() => CarouselMethods.current.prev()}>
          <GrNext className='text-3xl rotate-180 hover:scale-150' />
        </button>
        <div
          className={clsx(
            'transitionGeneral flex flex-col justify-between rounded-md bg-blue-700 p-[20px] bg-opacity-10 backdrop-blur-xl w-[600px] h-[500px] border-solid border-blue-500 border-[1px]',
            !isLoading.isLoading ? 'opacity-100' : 'opacity-0',
          )}
        >
          <span className='font-bold text-2xl mb-2'>Информация о жителе</span>
          <Carousel
            autoplay={false}
            dots={false}
            ref={CarouselMethods}
            className='overflow-y-auto w-[558px] h-[370px]'
          >
            <CitizenBaseInfo citizenInfo={selectedUserInfo} />
            <CitizenPossessions />
          </Carousel>
          <div className='flex w-full justify-end'>
            <Button
              className='border-[1px] border-blue-700 text-blue-700 h-[40px]'
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
          <GrNext className='text-3xl hover:scale-150' />
        </button>
      </div>
    </div>
  );
};
