import { Button, ConfigProvider, Form, UploadFile } from 'antd';
import { FC } from 'react';
import { useActions } from '../../../hooks/useActions';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { ImCross, ImSpinner9 } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';

interface IButtonsProps {
  changeNeedShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  isAgreementChecked: boolean;
  isRequestSuccess: boolean;
  isRequestBad: boolean;
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
}

export const Buttons: FC<IButtonsProps> = ({
  changeNeedShowForm,
  isAgreementChecked,
  isRequestSuccess,
  isRequestBad,
  setFileList,
}) => {
  const { helpFormClear } = useActions();
  const { isLoading } = useTypedSelector((state) => state.HelpFormReducer);

  return (
    <div className='flex sm:gap-x-4 max-sm:gap-x-2 justify-center'>
      <Button
        className='border-[1px] border-blue-700 text-blue-700 h-[40px]'
        disabled={isLoading || isRequestSuccess}
        onClick={() => {
          changeNeedShowForm(false);
          helpFormClear();
          setFileList([]);
        }}
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
            className='text-white h-[40px] bg-blue-700'
            disabled={isAgreementChecked && !isRequestSuccess && !isLoading ? false : true}
            type='primary'
            htmlType='submit'
          >
            {isLoading && (
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
            {!isLoading && !isRequestBad && !isRequestSuccess && <>Отправить</>}
          </Button>
        </ConfigProvider>
      </Form.Item>
    </div>
  );
};
