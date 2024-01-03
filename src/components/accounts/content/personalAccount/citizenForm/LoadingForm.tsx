export const LoadingForm = () => {
  return (
    <div className='flex flex-col gap-4 animate-pulse'>
      <span className='text-xl'>Собственность</span>
      <div className='flex w-full justify-between'>
        <div className='w-[206px] h-[32px] bg-gray-300 rounded-md'></div>
        <div className='w-[206px] h-[32px] bg-gray-300 rounded-md'></div>
      </div>
      <div className='flex flex-col gap-4'>
        <div className='w-full h-[30px] bg-gray-300 rounded-md'></div>
        <div className='w-full h-[30px] bg-gray-300 rounded-md'></div>
        <div className='w-full h-[30px] bg-gray-300 rounded-md'></div>
        <div className='w-full h-[30px] bg-gray-300 rounded-md'></div>
        <div className='w-full h-[30px] bg-gray-300 rounded-md'></div>
        <div className='w-full h-[30px] bg-gray-300 rounded-md'></div>
      </div>
      <div className='bg-gray-300 w-[105px] h-[32px] rounded-md'></div>
    </div>
  );
};
