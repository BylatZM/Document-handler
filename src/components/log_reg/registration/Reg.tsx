import { Link } from 'react-router-dom';
import { Inputs } from './Inputs';
import { Buttons } from './Buttons';
import { Form } from 'antd';
import { FC, useState } from 'react';
import { useActions } from '../../hooks/useActions';

interface IRegProps {
  changeAnimState: (animState: boolean) => void;
  isAgrChecked: boolean;
}

interface IFinishProps {
  name: string;
  surName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Reg: FC<IRegProps> = ({ changeAnimState, isAgrChecked }) => {
  const { regError, regStart, regSuccess } = useActions();
  const [isPassEquals, changeIsEquals] = useState(true);

  const onFinish = (props: IFinishProps) => {
    const { name, surName, email, password, confirmPassword } = props;

    if (password === confirmPassword) {
      changeIsEquals(true);

      regStart();

      setTimeout(() => {
        regSuccess({
          name: name,
          surName: surName,
          email: email,
          password: password,
          phone: null,
          patronymic: null,
        });
      }, 3000);
    } else changeIsEquals(false);
  };

  return (
    <div className='flex flex-col w-11/12 mx-auto'>
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
        <Inputs isPassEquals={isPassEquals} />
        <Buttons isAgrChecked={isAgrChecked} />
      </Form>
    </div>
  );
};
