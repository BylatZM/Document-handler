import { Form, Input } from 'antd';
import { FC } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';

interface IInputsProps {
  isPassEquals: boolean;
}

export const Inputs: FC<IInputsProps> = ({ isPassEquals }) => {
  const { error } = useTypedSelector((state) => state.RegReducer);

  return (
    <>
      <Form.Item
        name='name'
        style={{ marginBottom: 25 }}
        validateStatus={
          error !== null && error.some((el) => el.type === 'name') ? 'error' : undefined
        }
        help={
          error !== null &&
          error.filter((el) => el.type === 'name').map((el) => <div>{el.error}</div>)
        }
      >
        <Input
          className='rounded-sm h-[50px] text-lg'
          maxLength={50}
          type='text'
          required
          size='large'
          placeholder='Имя'
        />
      </Form.Item>
      <Form.Item
        name='surName'
        style={{ marginBottom: 25 }}
        validateStatus={
          error !== null && error.some((el) => el.type === 'surName') ? 'error' : undefined
        }
        help={
          error !== null &&
          error.filter((el) => el.type === 'surName').map((el) => <div>{el.error}</div>)
        }
      >
        <Input
          className='rounded-sm h-[50px] text-lg'
          maxLength={50}
          type='text'
          required
          size='large'
          placeholder='Фамилия'
        />
      </Form.Item>
      <Form.Item
        name='email'
        style={{ marginBottom: 25 }}
        validateStatus={
          error !== null && error.some((el) => el.type === 'email') ? 'error' : undefined
        }
        help={
          error !== null &&
          error.filter((el) => el.type === 'email').map((el) => <div>{el.error}</div>)
        }
      >
        <Input
          className='rounded-sm h-[50px] text-lg'
          maxLength={50}
          type='email'
          required
          size='large'
          placeholder='Почта'
        />
      </Form.Item>
      <Form.Item
        name='password'
        style={{ marginBottom: 25 }}
        validateStatus={
          error !== null && error.some((el) => el.type === 'password') ? 'error' : undefined
        }
        help={
          error !== null &&
          error.filter((el) => el.type === 'password').map((el) => <div>{el.error}</div>)
        }
      >
        <Input.Password
          className='rounded-sm h-[50px] text-lg'
          maxLength={50}
          required
          size='large'
          placeholder='Пароль'
        />
      </Form.Item>
      <Form.Item
        name='confirmPassword'
        validateStatus={!isPassEquals ? 'error' : undefined}
        help={!isPassEquals && <span className='errorText'>Пароли должны совпадать</span>}
      >
        <Input.Password
          className='rounded-sm h-[50px] text-lg'
          maxLength={50}
          required
          size='large'
          placeholder='Повторите пароль'
        />
      </Form.Item>
    </>
  );
};
