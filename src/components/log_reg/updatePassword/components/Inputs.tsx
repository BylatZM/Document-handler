import { Input } from 'antd';
import { FC } from 'react';
import { IError } from '../../../types';
import { Form } from 'antd';

interface IProps {
  error: IError | null;
}

export const Inputs: FC<IProps> = ({ error }) => {
  return (
    <>
      <Form.Item
        label='Адрес электронной почты'
        required
        className='text-base'
        validateStatus={error && error.type === 'email' ? 'error' : undefined}
        help={error && error.type === 'email' && error.error}
        name='email'
      >
        <Input
          type='email'
          className='rounded-md h-[40px]'
          placeholder='applications@dltex.ru'
          required
        />
      </Form.Item>
      <Form.Item
        label='Номер телефона'
        className='text-base'
        validateStatus={error && error.type === 'phone' ? 'error' : undefined}
        help={error && error.type === 'phone' && error.error}
        name='phone'
      >
        <Input className='rounded-md h-[40px]' placeholder='+79372833608' />
      </Form.Item>
    </>
  );
};
