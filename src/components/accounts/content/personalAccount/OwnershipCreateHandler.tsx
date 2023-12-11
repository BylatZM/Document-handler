import { Button, ConfigProvider, Form, Input, Select } from 'antd';
import { useState, FC } from 'react';
import { clsx } from 'clsx';

interface IFinishProps {
  complex: string | undefined;
  buildingAddress: string | undefined;
  flatAddress: string | undefined;
}

interface IProps {
  IsHidden: boolean;
  IsCurtainActive: boolean;
  changeIsHidden: (IsHidden: boolean) => void;
}

export const OwnershipCreateHandler: FC<IProps> = ({
  IsHidden,
  changeIsHidden,
  IsCurtainActive,
}) => {
  const [ErrorComponent, changeErrorComponent] = useState<'complex' | 'building' | 'flat' | null>(
    null,
  );

  const getFormData = (props: IFinishProps) => {
    if (!props.complex) {
      changeErrorComponent('complex');
      return;
    }
    if (!props.buildingAddress) {
      changeErrorComponent('building');
      return;
    }
    if (!props.flatAddress) {
      changeErrorComponent('flat');
      return;
    }
  };

  return (
    <div
      className={clsx(
        'transitionOpacity',
        'w-[500px] h-[500px] fixed inset-0 m-auto z-[21] bg-blue-700 bg-opacity-10 backdrop-blur-xl border-solid border-2 border-blue-500 rounded-md p-5',
        IsCurtainActive && 'hidden',
        IsHidden ? 'opacity-0' : 'opacity-100',
      )}
    >
      <Form
        initialValues={{
          remember: true,
        }}
        name='DefineOwnershipForm'
        onFinish={getFormData}
        autoComplete='off'
      >
        <div className='text-xl font-bold text-center'>Запрос для администрации</div>
        <div className='mt-2 mb-2 text-sm'>
          <span className='primaryField'>Жилищный комплекс</span>
          <Form.Item
            name='complex'
            validateStatus={ErrorComponent === 'complex' ? 'error' : undefined}
            help={
              ErrorComponent === 'complex' && (
                <div className='errorText'>Пожалуйста, укажите жилищный комплекс</div>
              )
            }
          >
            <Select />
          </Form.Item>
        </div>
        <div className='mt-2 mb-2 text-sm'>
          <span className='primaryField'>Адресс здания</span>
          <Form.Item
            name='buildingAddress'
            validateStatus={ErrorComponent === 'building' ? 'error' : undefined}
            help={
              ErrorComponent === 'building' && (
                <div className='errorText'>Пожалуйста, укажите адрес здания</div>
              )
            }
          >
            <Select />
          </Form.Item>
        </div>
        <div className='mt-2 mb-2 text-sm'>
          <span className='primaryField'>Введите вашу квартиру</span>
          <Form.Item
            name='flatAddress'
            validateStatus={ErrorComponent === 'flat' ? 'error' : undefined}
            help={
              ErrorComponent === 'flat' && (
                <div className='errorText'>Пожалуйста, укажите номер квартиры</div>
              )
            }
          >
            <Input maxLength={5} />
          </Form.Item>
        </div>
        <div className='flex justify-center gap-4'>
          <Button type='primary' className=' text-white bg-blue-700' htmlType='submit'>
            Отправить
          </Button>
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimaryTextHover: '#fff',
                  colorPrimaryHover: '#eb5e5e',
                },
              },
            }}
          >
            <Button
              type='primary'
              className='text-white bg-red-500 border-none'
              onClick={() => changeIsHidden(true)}
            >
              Отмена
            </Button>
          </ConfigProvider>
        </div>
      </Form>
    </div>
  );
};
