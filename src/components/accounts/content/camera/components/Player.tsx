import clsx from 'clsx';
import { FC, useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { BiError } from 'react-icons/bi';
import { getSlicesInfoRequest } from '../../../../../api/requests/Camera';
import { AiOutlineLoading } from 'react-icons/ai';

interface IProps {
  selectedCamUrl: string | null;
  changeSelectedCamUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

export const Player: FC<IProps> = ({ changeSelectedCamUrl, selectedCamUrl }) => {
  const [videos, setVideos] = useState<string[] | null>(null);
  const [playingSliceIndex, setPlayingSliceIndex] = useState<number>(0);
  const [canGetVideo, setCanGetVideo] = useState<boolean | null>(null);
  const [isPlayerLoading, setPlayerLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onHandleClosePlayer = () => {
    changeSelectedCamUrl(null);
    setCanGetVideo(null);
    setVideos(null);
    setPlayerLoading(false);
  };

  const getLastSlice = async (): Promise<void | string[]> => {
    if (!selectedCamUrl) return;
    return await getSlicesInfoRequest(selectedCamUrl);
  };

  const startVideoStreaming = async () => {
    const response = await getLastSlice();
    if (!Array.isArray(response)) {
      setCanGetVideo(false);
    } else {
      setCanGetVideo(true);
      setVideos(response);
    }
  };

  const startPlaying = () => {
    setPlayerLoading(false);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const startLoading = () => {
    setPlayerLoading(true);
  };

  const handlerVideoEnd = async () => {
    if (playingSliceIndex + 1 > 4) {
      setPlayerLoading((prev) => !prev);
      const response = await getLastSlice();
      if (!Array.isArray(response)) {
        setCanGetVideo(false);
      } else {
        setCanGetVideo(true);
        setVideos(response);
      }
      setPlayingSliceIndex(0);
      setPlayerLoading((prev) => !prev);
    } else {
      setPlayingSliceIndex((prev) => prev + 1);
    }
  };

  const onError = () => {
    console.log('error');
    setPlayingSliceIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (selectedCamUrl) {
      startVideoStreaming();
    }
  }, [selectedCamUrl]);

  return (
    <div
      className={clsx(
        'transitionFast z-20 fixed inset-0 m-auto flex justify-center items-center bg-black backdrop-blur-sm bg-opacity-30 overflow-hidden',
        selectedCamUrl ? 'w-full h-full' : 'w-0 h-0',
      )}
    >
      <button
        className={clsx(
          'transitionFast absolute right-5 top-5 text-black z-10',
          selectedCamUrl ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onHandleClosePlayer}
      >
        <IoClose className='md:text-lg lg:text-2xl xl:text-3xl 2xl:text-5xl' />
      </button>
      {canGetVideo && selectedCamUrl !== null && videos !== null && (
        <div
          className={clsx(
            'max-sm:w-full sm:w-[630px] md:w-[760px] lg:w-[1020px] xl:w-[1275px] aspect-[2/0.85] bg-black',
            isPlayerLoading ? 'opacity-0 relative z-[-1]' : 'opacity-100',
          )}
        >
          <video
            ref={videoRef}
            autoPlay={true}
            className='w-full h-full'
            onError={onError}
            controlsList='noplaybackrate nodownload'
            onPlay={startPlaying}
            onLoadStart={startLoading}
            onEnded={handlerVideoEnd}
            src={videos[playingSliceIndex]}
          ></video>
        </div>
      )}
      {canGetVideo && selectedCamUrl && (isPlayerLoading || videos === null) && (
        <div className='absolute inset-0 m-auto max-sm:w-full sm:w-[630px] md:w-[760px] lg:w-[1020px] xl:w-[1275px] aspect-[2/0.85] bg-black text-blue-700 flex justify-center items-center gap-x-4'>
          <AiOutlineLoading className='animate-spin text-5xl' />
          <span className='text-xl'>Загрузка</span>
        </div>
      )}
      {selectedCamUrl && canGetVideo === false && (
        <div className='flex w-full h-full gap-y-2 items-center justify-center flex-col text-red-700 text-center'>
          <BiError className='text-5xl' />
          <span className='text-xl'>
            Видео трансляция недоступна, попробуйте подать заявку через форму связи с тех.
            поддержкой
          </span>
        </div>
      )}
    </div>
  );
};
