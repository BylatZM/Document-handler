import { Form, Input } from 'antd';
import { useTypedSelector } from '../../hooks/useTypedSelector';

export const Inputs = () => {
  const { error } = useTypedSelector((state) => state.AuthReducer);

  return (
    <>
      <Form.Item
        name='email'
        style={{ marginBottom: 25 }}
        validateStatus={error && error.type === 'email' ? 'error' : undefined}
        help={
          error !== null && error.type === 'email' && <div className='errorText'>{error.error}</div>
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
      <Form.Item
        name='password'
        style={{ marginBottom: 25 }}
        validateStatus={error && error.type === 'password' ? 'error' : undefined}
        help={
          error !== null &&
          error.type === 'password' && <div className='errorText'>{error.error}</div>
        }
      >
        <Input.Password
          className='rounded-sm h-[40px]'
          maxLength={50}
          required
          size='large'
          placeholder='Пароль'
        />
      </Form.Item>
    </>
  );
};
