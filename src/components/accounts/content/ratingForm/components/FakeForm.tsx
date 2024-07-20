import { Button, Form, Rate, Select } from 'antd';

const formItemLayout = {
  labelCol: {
    span: 24,
  },
};

export const FakeForm = () => {
  return (
    <Form {...formItemLayout} name='set_citizen_rating_form'>
      <Form.Item name='complex' className='text-base' label='Название жилого комплекса' required>
        <Select className='h-[40px]' disabled />
      </Form.Item>
      <Form.Item name='building' className='text-base' label='Адрес здания' required>
        <Select className='h-[40px]' disabled />
      </Form.Item>
      <Form.Item name='possessionType' className='text-base' label='Тип собственности' required>
        <Select className='h-[40px]' disabled />
      </Form.Item>
      <Form.Item
        name='possession'
        className='text-base'
        label='Наименование собственности'
        required
      >
        <Select className='h-[40px]' disabled />
      </Form.Item>
      <Form.Item name='citizen' className='text-base' label='ФИО жителя' required>
        <Select className='h-[40px]' disabled />
      </Form.Item>
      <Form.Item name='mark' className='text-base' label='Оценка работы с жителем' required>
        <Rate className='text-3xl cast_stars' disabled />
      </Form.Item>
      <div className='flex sm:gap-x-4 max-sm:gap-x-2 justify-center'>
        <Button disabled>Закрыть</Button>
        <Form.Item>
          <Button disabled type='primary' htmlType='submit'>
            Отправить
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};
