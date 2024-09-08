import clsx from 'clsx';
import { FC, useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { BiError } from 'react-icons/bi';
import { getVideoFileRequest } from '../../../../../api/requests/Camera';
import { AiOutlineLoading } from 'react-icons/ai';
import { HLSPlayer } from './HLSPlayer';

interface IProps {
  selectedCamUrl: string | null;
  changeSelectedCamUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

export const Player: FC<IProps> = ({ changeSelectedCamUrl, selectedCamUrl }) => {
  const [canGetVideo, setCanGetVideo] = useState<boolean | null>(null);
  const [isRequestLoading, setIsRequestLoading] = useState(false);

  const tryToGetVideo = async (url: string) => {
    setIsRequestLoading((prev) => !prev);
    const response = await getVideoFileRequest(url);
    setIsRequestLoading((prev) => !prev);
    if (!response) setCanGetVideo(false);
    else setCanGetVideo(true);
  };

  useEffect(() => {
    if (selectedCamUrl) tryToGetVideo(selectedCamUrl);
  }, [selectedCamUrl]);

  return (
    <div
      className={clsx(
        'transitionGeneral z-20 fixed inset-0 m-auto flex justify-center items-center bg-black backdrop-blur-sm bg-opacity-30 overflow-hidden',
        selectedCamUrl ? 'w-full h-full' : 'w-0 h-0',
      )}
    >
      <button
        className={clsx(
          'transitionFast absolute right-5 top-5 text-black z-10',
          selectedCamUrl ? 'opacity-100' : 'opacity-0',
        )}
        onClick={() => changeSelectedCamUrl(null)}
      >
        <IoClose className='md:text-lg lg:text-2xl xl:text-3xl 2xl:text-5xl' />
      </button>
      {selectedCamUrl && !isRequestLoading && canGetVideo && (
        <div className='max-sm:w-full sm:w-[630px] md:w-[760px] lg:w-[1020px] xl:w-[1275px] 2xl:w-[1530px] h-[80%]'>
          <HLSPlayer streamUrl={selectedCamUrl} />
        </div>
      )}
      {selectedCamUrl && isRequestLoading && (
        <div className='flex w-full gap-x-4 h-full items-center justify-center text-blue-700'>
          <AiOutlineLoading className='animate-spin text-5xl' />
          <span className='text-xl'>Загрузка</span>
        </div>
      )}
      {selectedCamUrl && !isRequestLoading && canGetVideo === false && (
        <div className='flex w-full h-full gap-y-2 items-center justify-center flex-col text-red-700 text-center'>
          <BiError className='text-5xl' />
          <span className='text-xl'>Видео трансляция недоступна</span>
        </div>
      )}
    </div>
  );
};
