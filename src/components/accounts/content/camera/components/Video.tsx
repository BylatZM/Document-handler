import { FC } from 'react';

interface IProps {
  changeSelectedCamUrl: React.Dispatch<React.SetStateAction<string | null>>;
  description: string;
  preview: string;
  camera: string;
}

export const Video: FC<IProps> = ({ changeSelectedCamUrl, description, preview, camera }) => {
  return (
    <button
      onClick={() => changeSelectedCamUrl(camera)}
      className='flex flex-col gap-y-1 items-center justify-center text-center'
    >
      <img
        className='max-sm:w-full max-md:w-[80%] md:w-[350px] lg:w-[450px]'
        src={preview}
        alt=''
      />
      <span className='max-sm:text-sm lg:text-lg'>{description}</span>
    </button>
  );
};
