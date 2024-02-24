import { Button, Form } from 'antd';
import { FC } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { ImSpinner9 } from 'react-icons/im';

interface IButtonsProps {
  isAgreementChecked: boolean;
  changeNeedShowPasswordForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Buttons: FC<IButtonsProps> = ({ isAgreementChecked, changeNeedShowPasswordForm }) => {
  const { isLoading } = useTypedSelector((state) => state.AuthReducer);
  return (
    <>
      <button
        type='button'
        className='text-blue-700 text-base mb-2'
        onClick={() => changeNeedShowPasswordForm(true)}
      >
        Забыл пароль?
      </button>
      <Form.Item>
        <Button
          disabled={!isAgreementChecked && !isLoading ? false : true}
          type='primary'
          htmlType='submit'
          className='text-white bg-blue-700 w-full h-[35px] text-lg'
        >
          {isLoading && (
            <div className='inline-flex items-center'>
              <ImSpinner9 className='text-white animate-spin mr-4' />
              <span>Обработка</span>
            </div>
          )}
          {!isLoading && <span>Войти</span>}
        </Button>
      </Form.Item>
    </>
  );
};
