import { DotsEffect } from './dotsAnimation/DotsEffect';

export const Loading = () => {
  return (
    <div className='w-full min-h-screen flex justify-center items-center'>
      <DotsEffect dotsQuantity={20} />
      <span className='text-blue-500 text-4xl italic'>Загрузка</span>
    </div>
  );
};
