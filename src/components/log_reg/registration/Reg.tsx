import { Link } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { FC } from 'react';
import { useActions } from '../../hooks/useActions';
import { IRegRequest } from '../../types';
import { registrationRequest } from '../../../api/requests/Main';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { ImSpinner9 } from 'react-icons/im';

interface IRegProps {
  changeAnimState: (animState: boolean) => void;
  isAgreementChecked: boolean;
}

export const Reg: FC<IRegProps> = ({ changeAnimState, isAgreementChecked }) => {
  const { regSuccess, regLoading, regError } = useActions();
  const error = useTypedSelector((state) => state.RegReducer.error);
  const isLoading = useTypedSelector((state) => state.RegReducer.isLoading);

  const onFinish = async (props: IRegRequest) => {
    regLoading(true);
    const response = await registrationRequest(props);

    if (response) {
      if (response === 201) regSuccess(props);
      else regError(response);
    }

    regLoading(false);
  };

  return (
    <div className='flex flex-col w-full'>
      <h1 className='text-2xl font-semibold mb-2'>Регистрация</h1>
      <p className='mb-4'>
        <span className='mr-2'>Уже есть аккаунта?</span>
        <Link to={'/'} className='text-blue-700' onClick={() => changeAnimState(false)}>
          Войти
        </Link>
      </p>
      <Form
        name='form'
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete='off'
      >
        <Form.Item
          name='email'
          style={{ marginBottom: 25 }}
          validateStatus={error && error.type === 'email' ? 'error' : undefined}
          help={
            error !== null &&
            error.type === 'email' && <div className='errorText'>{error.error}</div>
          }
        >
          <Input
            className='rounded-sm h-[40px]'
            maxLength={50}
            type='email'
            required
            size='large'
            placeholder='Почта'
          />
        </Form.Item>
        <Form.Item>
          <Button
            disabled={isAgreementChecked}
            type='primary'
            htmlType='submit'
            className='text-white bg-blue-700 w-full h-[35px] text-lg flex items-center justify-center'
          >
            {isLoading && (
              <div className='inline-flex items-center'>
                <ImSpinner9 className='text-white animate-spin mr-4' />
                <span>Обработка</span>
              </div>
            )}
            {!isLoading && <span>Зарегистрироваться</span>}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
