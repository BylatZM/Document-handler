import { Form, Input } from 'antd';

import { useTypedSelector } from '../../hooks/useTypedSelector';

export const Inputs = () => {
  const { error } = useTypedSelector((state) => state.HelpFormReducer);
  const { TextArea } = Input;

  return (
    <>
      <span className='primaryField'>Ваше имя</span>
      <Form.Item
        name='userName'
        style={{ marginBottom: 25 }}
        validateStatus={error !== null && error.type === 'userName' ? 'error' : undefined}
        help={error !== null && error.type === 'userName' && <div>{error.error}</div>}
      >
        <Input className='rounded-md h-[40px]' maxLength={50} type='text' required size='large' />
      </Form.Item>
      <span className='primaryField'>Адресс электронной почты</span>
      <Form.Item
        name='email'
        style={{ marginBottom: 25 }}
        validateStatus={error !== null && error.type === 'email' ? 'error' : undefined}
        help={error !== null && error.type === 'email' && <div>{error.error}</div>}
      >
        <Input className='rounded-md h-[40px]' maxLength={50} type='text' required size='large' />
      </Form.Item>
      <span className='primaryField'>Заголовок</span>
      <Form.Item
        name='title'
        style={{ marginBottom: 25 }}
        validateStatus={error !== null && error.type === 'title' ? 'error' : undefined}
        help={error !== null && error.type === 'title' && <div>{error.error}</div>}
      >
        <Input className='rounded-md h-[40px]' maxLength={50} type='text' required size='large' />
      </Form.Item>
      <span className='primaryField'>Причина</span>
      <Form.Item
        name='reason'
        style={{ marginBottom: 25 }}
        validateStatus={error !== null && error.type === 'reason' ? 'error' : undefined}
        help={error !== null && error.type === 'reason' && <div>{error.error}</div>}
      >
        <TextArea
          className='rounded-md h-[60px]'
          maxLength={100}
          showCount
          required
          style={{ resize: 'none' }}
        />
      </Form.Item>
      <span>Адрес</span>
      <Form.Item
        name='address'
        style={{ marginBottom: 25 }}
        validateStatus={error !== null && error.type === 'address' ? 'error' : undefined}
        help={error !== null && error.type === 'address' && <div>{error.error}</div>}
      >
        <Input className='rounded-md h-[40px]' maxLength={50} type='text' size='large' />
      </Form.Item>
    </>
  );
};
