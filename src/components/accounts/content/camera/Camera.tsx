import { clsx } from 'clsx';
import { Video } from './components/Video';
import { useState } from 'react';
import { Player } from './components/Player';

export const Camera = () => {
  const [needShow, changeNeedShow] = useState(false);
  return (
    <>
      <Player needShow={needShow} changeNeedShow={changeNeedShow} />
      <div
        className={clsx(
          'fixed inset-0 overflow-y-auto grid mt-[68px] max-sm:mt-[96px] items-center justify-center',
          'max-sm:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5',
          'max-sm:gap-1 sm:gap-3 lg:gap-4',
          'max-sm:p-1 sm:p-3 lg:p-4',
        )}
      >
        {[...Array(25)].map((_, index) => {
          return (
            <Video key={index + 1} changeNeedShow={changeNeedShow} title={(index + 1).toString()} />
          );
        })}
      </div>
    </>
  );
};
