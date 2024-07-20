import { Button, Form, Input } from 'antd';

export const FakeUpdatePassword = () => {
  const formItemLayout = {
    labelCol: {
      span: 24,
    },
  };

  return (
    <Form {...formItemLayout} name='update_password_form' onFinish={() => {}}>
      <Form.Item label='Адрес электронной почты' required className='text-base' name='email'>
        <Input
          type='email'
          className='rounded-md h-[40px]'
          placeholder='applications@dltex.ru'
          disabled
        />
      </Form.Item>
      <Form.Item label='Номер телефона' className='text-base' name='phone'>
        <Input className='rounded-md h-[40px]' placeholder='+79372833608' required disabled />
      </Form.Item>
      <div className='flex justify-center max-sm:gap-x-2 gap-x-4'>
        <Button className='inline mr-1 sm:mr-4 border-[1px] border-blue-700 text-blue-700' disabled>
          Закрыть
        </Button>
        <Button className='inline text-white bg-blue-700' disabled htmlType='submit'>
          Отправить
        </Button>
      </div>
    </Form>
  );
};
