import { ConfigProvider, Button } from 'antd';
import { IError } from '../../../../types';
import { FC } from 'react';
import clsx from 'clsx';
import { ImCross, ImSpinner9 } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';

interface IProps {
  error: IError | null;
  isRequestSuccess: boolean;
  isLoading: boolean;
  onFinish: () => Promise<void>;
}

export const ButtonBlock: FC<IProps> = ({ error, isRequestSuccess, isLoading, onFinish }) => {
  return (
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
        type='primary'
        onClick={() => onFinish()}
        className={clsx(
          'text-white w-min',
          !error && !isRequestSuccess && 'bg-blue-700',
          error && !isRequestSuccess && !isLoading && 'bg-red-500',
          !error && isRequestSuccess && !isLoading && 'bg-green-500',
        )}
        htmlType='submit'
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
  );
};
