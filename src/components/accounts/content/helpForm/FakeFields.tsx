import { Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';

export const FakeFields = () => {
  return (
    <div className='flex flex-col gap-y-6 max-sm:gap-y-2'>
      <div className='flex flex-col gap-y-4'>
        <span>Имя заявителя</span>
        <Input className='h-[40px]' disabled />
      </div>
      <div className='flex flex-col gap-y-4'>
        <span>Контактные данные (номер телефона \ почта)</span>
        <Input className='h-[40px]' disabled />
      </div>
      <div className='flex flex-col gap-y-4'>
        <span>Тема обращения</span>
        <Input className='h-[40px]' disabled />
      </div>
      <div className='flex flex-col gap-y-4'>
        <span>Описание проблемы</span>
        <TextArea
          rows={3}
          maxLength={200}
          disabled
          placeholder='Описание проблемы'
          style={{ resize: 'none' }}
        />
        <Input className='h-[40px]' disabled />
      </div>
      <div className='flex flex-col gap-y-4'>
        <span>Прикрепить изображение</span>
        <div className='ant-input ant-input-disabled css-dev-only-do-not-override-2i2tap flex flex-col items-center justify-center w-[100px] aspect-square bg-none'>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Загрузить</div>
        </div>
      </div>
      <div className='flex flex-col gap-y-4'>
        <span>Адрес имущества</span>
        <Input className='h-[40px]' disabled />
      </div>
      <div className='flex sm:gap-x-4 max-sm:gap-x-2 justify-center'>
        <Button className='border-[1px] border-blue-700 text-blue-700 h-[40px]' disabled>
          Закрыть
        </Button>
        <Button className='text-white h-[40px] bg-blue-700' disabled type='primary'>
          Отправить
        </Button>
      </div>
    </div>
  );
};
