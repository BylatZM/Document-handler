import { Form } from 'antd';
import { Inputs } from './Inputs';
import { Buttons } from './Buttons';
import { Link, useNavigate } from 'react-router-dom';
import { FC } from 'react';
import { useActions } from '../../hooks/useActions';
import { loginRequest } from '../../../store/creators/MainCreators';
import { IAuthRequest } from '../../types';

interface IAuthProps {
  changeAnimState: (animState: boolean) => void;
  isAgrChecked: boolean;
}

export const Auth: FC<IAuthProps> = ({ changeAnimState, isAgrChecked }) => {
  const navigate = useNavigate();
  const { loginStart, loginSuccess, loginError } = useActions();

  const onFinish = async (Props: IAuthRequest) => {
    loginStart();
    const auth_response = await loginRequest(Props);
    if ('user_id' in auth_response) {
      loginSuccess(auth_response);
      navigate('/account/aboutMe');
    } else loginError(auth_response);
  };

  return (
    <div className='flex self-center flex-col w-full'>
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
