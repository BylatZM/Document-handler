import { Button, ConfigProvider } from 'antd';
import { HiOutlineCheck } from 'react-icons/hi';
import { ImCross, ImSpinner9 } from 'react-icons/im';
import { IError } from '../../../types';
import { FC } from 'react';
import clsx from 'clsx';

interface IProps {
  isLoading: boolean;
  changeNeedShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  error: IError | null;
  isRequestSuccess: boolean;
}

export const Buttons: FC<IProps> = ({ isLoading, changeNeedShowForm, error, isRequestSuccess }) => {
  return (
    <div className='flex justify-center max-sm:gap-x-2 gap-x-4'>
      <Button
        className='inline mr-1 sm:mr-4 border-[1px] border-blue-700 text-blue-700'
        disabled={isLoading}
        onClick={() => changeNeedShowForm(false)}
      >
        Закрыть
      </Button>
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
          className={clsx('inline text-white bg-blue-700')}
          disabled={!isRequestSuccess && !isLoading ? false : true}
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
          {!isLoading && !error && !isRequestSuccess && <>Отправить</>}
        </Button>
      </ConfigProvider>
    </div>
  );
};
