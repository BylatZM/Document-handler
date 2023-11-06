import { Form } from 'antd';
import { Inputs } from './Inputs';
import { Buttons } from './Buttons';
import { Link } from 'react-router-dom';
import { FC } from 'react';
import { useActions } from '../../hooks/useActions';

interface IAuthProps {
  changeAnimState: (animState: boolean) => void;
  isAgrChecked: boolean;
}

interface IFinishProps {
  email: string;
  password: string;
}

export const Auth: FC<IAuthProps> = ({ changeAnimState, isAgrChecked }) => {
  const { loginStart, loginSuccess } = useActions();

  const onFinish = (Props: IFinishProps) => {
    loginStart();
    setTimeout(() => {
      loginSuccess(Props);
    }, 3000);
  };

  return (
    <div className='flex self-center flex-col w-11/12 mx-auto'>
      <h1 className='text-2xl font-semibold mb-2'>Вход в кабинет</h1>
      <p className='mb-4'>
        <span className='mr-2'>Нет аккаунта?</span>
        <Link
          to={'/registration'}
          className='text-blue-700'
          onClick={() => {
            changeAnimState(false);
          }}
        >
          Зарегистрироваться
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
        <Inputs />
        <Buttons isAgrChecked={isAgrChecked} />
      </Form>
    </div>
  );
};
