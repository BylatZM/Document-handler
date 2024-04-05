import { useSearchParams } from 'react-router-dom';
import { IApproveUserByLink, IError } from '../types';
import { useEffect, useState } from 'react';
import { approveUserByLinkRequest } from '../../api/requests/Person';
import { AiOutlineLoading } from 'react-icons/ai';
import { BiError } from 'react-icons/bi';
import { HiOutlineCheck } from 'react-icons/hi';

export const ApprovingByLink = () => {
  const [searchParams] = useSearchParams();
  const [error, changeError] = useState<IError | null>(null);
  const [isLoading, changeIsLoading] = useState(false);
  const [isSuccess, changeIsSuccess] = useState(false);

  const makeRequest = async (data: IApproveUserByLink) => {
    changeError(null);
    changeIsLoading((prev) => true);
    const response = await approveUserByLinkRequest(data);
    changeIsLoading((prev) => false);
    if (!response) return;

    if (response !== 200) changeError(response);
    else changeIsSuccess((prev) => true);
  };
  useEffect(() => {
    if (!searchParams.has('id') || !searchParams.has('key') || !searchParams.has('operation'))
      changeError({ type: 'error', error: 'Неверно указаны параметры' });
    else {
      makeRequest({
        id: searchParams.get('id'),
        key: searchParams.get('key'),
        operation: searchParams.get('operation'),
      });
    }
  }, [searchParams]);
  return (
    <div className='min-h-screen w-full relative inset-0 flex justify-center items-center bg-blue-700 backdrop-blur-md bg-opacity-10 border-blue-500 border-2'>
      {isLoading && (
        <div className='flex flex-col justify-center text-blue-700 items-center'>
          <AiOutlineLoading className='text-8xl mb-6 animate-spin' />
          <span className='text-4xl'>Обработка запроса</span>
        </div>
      )}
      {isSuccess && (
        <div className='flex flex-col justify-center items-center text-green-500'>
          <HiOutlineCheck className='text-8xl mb-6' />
          <span className='text-4xl'>Успешно</span>
        </div>
      )}
      {error && (
        <div className='flex flex-col justify-center items-center text-red-500 w-3/4'>
          <BiError className='text-8xl mb-6' />
          <span className='text-4xl text-center'>{error.error}</span>
        </div>
      )}
    </div>
  );
};
