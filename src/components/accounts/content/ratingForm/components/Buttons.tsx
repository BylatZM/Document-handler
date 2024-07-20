import { Button, ConfigProvider, Form } from 'antd';
import { FC } from 'react';
import { HiOutlineCheck } from 'react-icons/hi';
import { ImCross, ImSpinner9 } from 'react-icons/im';
import { IRatingFormLoading } from '../../../../types';

interface IProps {
  isRequestSuccess: boolean;
  isRequestBad: boolean;
  isLoading: IRatingFormLoading;
  exitFromForm: () => void;
}

export const Buttons: FC<IProps> = ({
  isRequestBad,
  isRequestSuccess,
  isLoading,
  exitFromForm,
}) => {
  return (
    <div className='flex sm:gap-x-4 max-sm:gap-x-2 justify-center'>
      <Button
        className='border-[1px] border-blue-700 text-blue-700 h-[40px]'
        onClick={exitFromForm}
      >
        Закрыть
      </Button>
      <Form.Item>
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
            disabled={isLoading !== null || isRequestSuccess}
            className='text-white h-[40px] bg-blue-700'
            type='primary'
            htmlType='submit'
          >
            {isLoading === 'form' && (
              <div className='inline-flex items-center'>
                <ImSpinner9 className='animate-spin mr-2' />
                <span>Обработка</span>
              </div>
            )}
            {isRequestBad && !isLoading && !isRequestSuccess && (
              <div className='inline-flex items-center'>
                <ImCross className='mr-2' />
                <span>Ошибка</span>
              </div>
            )}
            {!isLoading && !isRequestBad && isRequestSuccess && (
              <div className='inline-flex items-center'>
                <HiOutlineCheck className='mr-2 font-bold text-lg' />
                <span>Успешно</span>
              </div>
            )}
            {isLoading !== 'form' && !isRequestBad && !isRequestSuccess && <>Отправить</>}
          </Button>
        </ConfigProvider>
      </Form.Item>
    </div>
  );
};
