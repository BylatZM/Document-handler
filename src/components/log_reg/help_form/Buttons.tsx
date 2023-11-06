import { Form, Button, ConfigProvider } from 'antd';
import { FC } from 'react';
import { ImSpinner9 } from 'react-icons/im';
import { useTypedSelector } from '../../hooks/useTypedSelector';

interface IButtonsProps {
  changeShowForm: (showHelpForm: boolean) => void;
  showHelpForm: boolean;
  isAgrChecked: boolean;
}

export const Buttons: FC<IButtonsProps> = ({ changeShowForm, showHelpForm, isAgrChecked }) => {
  const { isLoading } = useTypedSelector((state) => state.HelpFormReducer);

  return (
    <Form.Item className='flex justify-end m-0 px-5 py-2'>
      <Button
        className='border-[1px] border-blue-700 text-blue-700 h-[40px] mr-4'
        onClick={() => changeShowForm(!showHelpForm)}
      >
        Отмена
      </Button>

      <Button
        className='bg-blue-700 text-white h-[40px] border-blue-700'
        disabled={isAgrChecked}
        type='primary'
        htmlType='submit'
      >
        {isLoading && (
          <div className='inline-flex items-center'>
            <ImSpinner9 className='text-white animate-spin mr-4' />
            <span>Обработка</span>
          </div>
        )}
        {!isLoading && <>Отправить</>}
      </Button>
    </Form.Item>
  );
};
