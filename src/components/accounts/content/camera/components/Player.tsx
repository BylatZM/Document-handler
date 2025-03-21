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
  const [videoSlices, setVideoSlices] = useState<string[] | null>(null);
  const [playingVideoURL, setPlayingVideoURL] = useState<string | null>(null);
  const [canGetVideo, setCanGetVideo] = useState<boolean | null>(null);
  const [isPlayerLoading, setPlayerLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onHandleClosePlayer = () => {
    changeSelectedCamUrl(null);
    setCanGetVideo(null);
    setVideoSlices(null);
    setPlayerLoading(false);
  };

  const getLastSlice = async (): Promise<void | string[]> => {
    if (!selectedCamUrl) return;
    return await getSlicesInfoRequest(selectedCamUrl);
  };

  const startPlaying = () => {
    setPlayerLoading(false);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const setNewPlayerVideo = async () => {
    let vSlices = videoSlices

    if (!vSlices || vSlices.length === 0) {
      setPlayerLoading((prev) => !prev);
      const response = await getLastSlice();
      setPlayerLoading((prev) => !prev);
      if (!Array.isArray(response)) return setCanGetVideo(false);

      if (response.length === 0) return setCanGetVideo(false);

      if (!canGetVideo) {
        setCanGetVideo(true)
      }

      vSlices = response
    }

    const videoURL = vSlices.shift()
    if (!videoURL) return setCanGetVideo(false);

    setVideoSlices(vSlices);
    setPlayingVideoURL(videoURL);
  }

  const handlerVideoEnd = () => {
    setNewPlayerVideo()
  };

  const onError = () => {
    console.log("error")
    setNewPlayerVideo()
  };

  useEffect(() => {
    if (selectedCamUrl) {
      setNewPlayerVideo();
    }
  }, [selectedCamUrl]);

  return (
    <div
      className={clsx(
        'z-20 fixed inset-0 w-full h-full m-auto flex justify-center items-center bg-black backdrop-blur-sm bg-opacity-30 overflow-hidden',
        selectedCamUrl ? 'block' : 'hidden',
      )}
    >
      <div
        className={clsx(
          'max-sm:w-full sm:w-[630px] md:w-[760px] lg:w-[1020px] xl:w-[1275px] aspect-[2/0.85] bg-black relative',
        )}
      >
        <button
          type='button'
          className='absolute right-5 top-5 p-5 z-50'
          onClick={onHandleClosePlayer}
        >
          <IoClose className='md:text-lg lg:text-2xl xl:text-3xl text-white' />
        </button>
        {canGetVideo !== null && selectedCamUrl !== null && playingVideoURL !== null && <video
          ref={videoRef}
          muted
          autoPlay
          className='w-full h-full'
          controls
          onError={onError}
          onPlay={startPlaying}
          onEnded={handlerVideoEnd}
          src={playingVideoURL}
        ></video>}
      </div>
      {canGetVideo && selectedCamUrl && isPlayerLoading && (
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
