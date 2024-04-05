import { FC } from 'react';
import { DotsEffect } from './dotsAnimation/DotsEffect';

interface IProps {
  message: string;
}

export const ErrorPage: FC<IProps> = ({ message }) => {
  return (
    <div className='w-full h-full flex items-center justify-center text-center mt-[68px] z-10 relative'>
      <DotsEffect dotsQuantity={10} />
      <span className='text-2xl z-20 backdrop-blur-lg bg-opacity-20 bg-gray-100'>{message}</span>
    </div>
  );
};
