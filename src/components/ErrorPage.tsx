import { FC } from 'react';
import { DotsEffect } from './dotsAnimation/DotsEffect';

interface IProps {
  message: string;
}

export const ErrorPage: FC<IProps> = ({ message }) => {
  return (
    <div className='w-full min-h-screen p-10'>
      <DotsEffect dotsQuantity={10} />
      <span className='text-2xl'>{message}</span>
    </div>
  );
};
