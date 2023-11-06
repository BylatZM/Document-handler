import { Button, Form } from 'antd';
import { FC } from 'react';
import { ImSpinner9 } from 'react-icons/im';
import { useTypedSelector } from '../../hooks/useTypedSelector';

interface IButtonsProps {
  isAgrChecked: boolean;
}

export const Buttons: FC<IButtonsProps> = ({ isAgrChecked }) => {
  const { isLoading } = useTypedSelector((state) => state.RegReducer);

  return (
    <Form.Item>
      <Button
        disabled={isAgrChecked}
        type='primary'
        htmlType='submit'
        className='text-white bg-blue-700 w-full h-[45px] text-lg'
      >
        {isLoading && (
          <div className='inline-flex items-center'>
            <ImSpinner9 className='text-white mr-4 animate-spin' />
            <span>Обработка</span>
          </div>
        )}
        {!isLoading && <>Зарегистрироваться</>}
      </Button>
    </Form.Item>
  );
};
