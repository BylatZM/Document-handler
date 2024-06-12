import { ConfigProvider, Button } from 'antd';
import { IAboutMeGeneralSteps, IError } from '../../../../types';
import { FC } from 'react';
import { ImCross, ImSpinner9 } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';
import clsx from 'clsx';

interface IProps {
  error: IError | null;
  isRequestSuccess: boolean;
  isLoading: boolean;
  onFinish: () => Promise<void>;
  personalSteps: IAboutMeGeneralSteps;
}

export const Buttons: FC<IProps> = ({
  error,
  isRequestSuccess,
  isLoading,
  onFinish,
  personalSteps,
}) => {
  return (
    <div className='relative w-fit'>
      <div
        className={clsx(
          personalSteps.first_name &&
            personalSteps.last_name &&
            personalSteps.phone &&
            localStorage.getItem('citizen_registered')
            ? 'heartbeat absolute inset-0 bg-blue-700 rounded-md'
            : 'hidden',
        )}
      ></div>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorPrimaryHover: undefined,
            },
          },
        }}
      >
        <Button
          onClick={() => onFinish()}
          className='text-blue-700 bg-none border-blue-700 w-min max-sm:w-full'
          htmlType='submit'
          disabled={!isRequestSuccess && !isLoading ? false : true}
        >
          {isLoading && (
            <div>
              <ImSpinner9 className='inline animate-spin mr-2' />
              <span>Обработка</span>
            </div>
          )}
          {error && !isLoading && !isRequestSuccess && (
            <div>
              <ImCross className='mr-2 inline' />
              <span>Ошибка</span>
            </div>
          )}
          {!isLoading && !error && isRequestSuccess && (
            <div>
              <HiOutlineCheck className='inline mr-2 font-bold text-lg' />
              <span>Успешно</span>
            </div>
          )}
          {!isLoading && !error && !isRequestSuccess && <>Сохранить</>}
        </Button>
      </ConfigProvider>
    </div>
  );
};
