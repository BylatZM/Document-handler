import { Button, Form } from 'antd';
import { FC } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { ImSpinner9 } from 'react-icons/im';

interface IButtonsProps {
  isAgrChecked: boolean;
}

export const Buttons: FC<IButtonsProps> = ({ isAgrChecked }) => {
  const { isLoading } = useTypedSelector((state) => state.AuthReducer);
  return (
    <Form.Item>
      <span className='block text-blue-700 mb-2 cursor-pointer'>Забыл пароль?</span>

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
  );
};
