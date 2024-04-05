import { ConfigProvider, Button } from 'antd';
import { IError } from '../../../../types';
import { FC } from 'react';
import { ImCross, ImSpinner9 } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';

interface IProps {
  error: IError | null;
  isRequestSuccess: boolean;
  isLoading: boolean;
  onFinish: () => Promise<void>;
}

export const Buttons: FC<IProps> = ({ error, isRequestSuccess, isLoading, onFinish }) => {
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
        className='text-white w-min bg-blue-700 max-sm:w-full'
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
  );
};
