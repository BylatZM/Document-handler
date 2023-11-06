import { Form, Input } from 'antd';

import Styles from './HelpForm.module.scss';
import { useTypedSelector } from '../../hooks/useTypedSelector';

export const Inputs = () => {
  const { error } = useTypedSelector((state) => state.HelpFormReducer);
  const { TextArea } = Input;

  return (
    <>
      <span className={Styles.imp}>Ваше имя</span>
      <Form.Item
        name='userName'
        style={{ marginBottom: 25 }}
        validateStatus={
          error !== null && error.some((el) => el.type === 'userName') ? 'error' : undefined
        }
        help={
          error !== null &&
          error.filter((el) => el.type === 'userName').map((el) => <div>{el.error}</div>)
        }
      >
        <Input className='rounded-sm h-[50px]' maxLength={50} type='text' required size='large' />
      </Form.Item>
      <span className={Styles.imp}>Адресс электронной почты</span>
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
        <Input className='rounded-sm h-[50px]' maxLength={50} type='text' required size='large' />
      </Form.Item>
      <span className={Styles.imp}>Заголовок</span>
      <Form.Item
        name='title'
        style={{ marginBottom: 25 }}
        validateStatus={
          error !== null && error.some((el) => el.type === 'email') ? 'error' : undefined
        }
        help={
          error !== null &&
          error.filter((el) => el.type === 'email').map((el) => <div>{el.error}</div>)
        }
      >
        <Input className='rounded-sm h-[50px]' maxLength={50} type='text' required size='large' />
      </Form.Item>
      <span className={Styles.imp}>Причина</span>
      <Form.Item
        name='reason'
        style={{ marginBottom: 25 }}
        validateStatus={
          error !== null && error.some((el) => el.type === 'reason') ? 'error' : undefined
        }
        help={
          error !== null &&
          error.filter((el) => el.type === 'reason').map((el) => <div>{el.error}</div>)
        }
      >
        <TextArea
          className='rounded-sm'
          maxLength={100}
          showCount
          required
          style={{ height: 60, resize: 'none' }}
          size='large'
        />
      </Form.Item>
      <span>Адрес</span>
      <Form.Item
        name='address'
        style={{ marginBottom: 25 }}
        validateStatus={
          error !== null && error.some((el) => el.type === 'address') ? 'error' : undefined
        }
        help={
          error !== null &&
          error.filter((el) => el.type === 'address').map((el) => <div>{el.error}</div>)
        }
      >
        <Input className='rounded-sm h-[50px]' maxLength={50} type='text' size='large' />
      </Form.Item>
    </>
  );
};
