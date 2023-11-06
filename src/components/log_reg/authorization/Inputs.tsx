import { Form, Input } from 'antd';
import { useTypedSelector } from '../../hooks/useTypedSelector';

export const Inputs = () => {
  const { error } = useTypedSelector((state) => state.AuthReducer);

  return (
    <>
      <Form.Item
        name='email'
        style={{ marginBottom: 25 }}
        validateStatus={error && error.some((el) => el.type === 'email') ? 'error' : undefined}
        help={
          error !== null &&
          error
            .filter((el) => el.type === 'email')
            .map((el) => <div className='errorText'>{el.error}</div>)
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
        validateStatus={error && error.some((el) => el.type === 'password') ? 'error' : undefined}
        help={
          error !== null &&
          error
            .filter((el) => el.type === 'password')
            .map((el) => <div className='errorText'>{el.error}</div>)
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
    </>
  );
};
