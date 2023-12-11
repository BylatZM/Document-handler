import './Loading.scss';

export const Loading = () => {
  return (
    <div className='w-full min-h-screen flex justify-center items-center bg-blue-700 bg-opacity-10 backdrop-blur-xl'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='w-1/4 h-1/4 animate-pulse'
        fill='none'
        fillRule='nonzero'
        clipRule='evenodd'
        strokeLinecap='round'
        strokeLinejoin='round'
        viewBox='0 0 476 381'
      >
        <path
          className='svg'
          stroke='#D00404'
          fillOpacity='0'
          d='M184 0S.27 278.06 0 278.85l61 89.65c357.1-1.48 355 0 355 0l14.58-21.19c7.75-11.21 14.95-21.9 16.02-23.48 1.07-1.71 4-5.93 6.54-9.36 10.81-15.3 22.83-33.5 22.83-34.83 0-.79-6.14-10.28-13.62-21.23a967.72 967.72 0 0 1-15.21-22.43 39.2 39.2 0 0 0-3.47-4.75c-1.07-1.32-10.55-14.9-20.83-30.07-10.4-15.3-20.82-30.34-23.09-33.64-2.4-3.3-43.38-62.65-43.38-62.65l-117.59.66L307 0H184Zm54.78 105.53s92.9 137.7 117.06 173.45c0 .4 0-.4 0 0s0 .4 0 0c-64.6 0-235.84.4-235.84 0l118.78-173.45Z'
        />
      </svg>
    </div>
  );
};
