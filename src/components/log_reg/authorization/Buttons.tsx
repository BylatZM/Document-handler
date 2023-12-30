import { Button, Form } from 'antd';
import { FC } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { ImSpinner9 } from 'react-icons/im';

interface IButtonsProps {
  isAgrChecked: boolean;
  changeActiveForm: (activeForm: null | 'password' | 'help') => void;
}

export const Buttons: FC<IButtonsProps> = ({ isAgrChecked, changeActiveForm }) => {
  const { isLoading } = useTypedSelector((state) => state.AuthReducer);
  return (
    <>
      <button
        type='button'
        className='text-blue-700 text-base mb-2'
        onClick={() => changeActiveForm('password')}
      >
        Забыл пароль?
      </button>
      <Form.Item>
        <Button
          disabled={isAgrChecked}
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
