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
          'fixed inset-0 overflow-y-auto flex mt-[68px] max-sm:mt-[96px] flex-wrap sm:p-5',
        )}
      >
        <Video changeNeedShow={changeNeedShow} title='Видеокамера' />
      </div>
    </>
  );
};
