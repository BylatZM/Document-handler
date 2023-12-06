import { Form, Checkbox, ConfigProvider } from 'antd';
import { FC, useState } from 'react';
import clsx from 'clsx';
import { Buttons } from './Buttons';
import { Inputs } from './Inputs';
import { useActions } from '../../hooks/useActions';

interface IHelpFormProps {
  IsHidden: boolean;
  IsCurtainActive: boolean;
  changeIsHidden: (IsHidden: boolean) => void;
}

interface IFinishProps {
  userName: string;
  email: string;
  title: string;
  address: string;
  reason: string;
}

export const HelpForm: FC<IHelpFormProps> = ({ IsHidden, changeIsHidden, IsCurtainActive }) => {
  const { helpFormReducerStart, helpFormReducerSuccess } = useActions();
  const [isAgrChecked, changeIsAgr] = useState(true);

  const onFinish = (props: IFinishProps) => {
    helpFormReducerStart();
    setTimeout(() => {
      helpFormReducerSuccess({ ...props, address: !props.address ? null : props.address });
    }, 3000);
  };

  return (
    <div
      className={clsx(
        'bg-blue-700 p-5 bg-opacity-10 backdrop-blur-xl z-[21] fixed inset-0 m-auto rounded-md w-[500px] h-[500px] overflow-y-auto border-solid border-blue-500 border-2',
        'transitionOpacity',
        IsCurtainActive && 'hidden',
        IsHidden ? 'opacity-0' : 'opacity-100',
      )}
    >
      <div className='text-center'>
        <span className='text-xl font-bold'>Обратная связь</span>
      </div>

      <Form
        name='HelpForm'
        className='flex flex-col justify-between h-5/6'
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete='off'
      >
        <div className=''>
          <Inputs />
        </div>
        <ConfigProvider
          theme={{
            components: {
              Checkbox: {
                colorBorder: '#9fa6b1',
                fontSize: 0.75,
                lineHeight: 1,
              },
            },
          }}
        >
          <Checkbox
            className='text-left text-gray-400 py-2'
            onClick={() => changeIsAgr(!isAgrChecked)}
          >
            Я принимаю пользовательское соглашение и даю разрешение порталу на обработку моих
            персональных данных в соотвествии с Федеральным законом №152-ФЗ от 27.07.2006 года “О
            персональных данных”"
          </Checkbox>
        </ConfigProvider>
        <Buttons changeIsHidden={changeIsHidden} isAgrChecked={isAgrChecked} />
      </Form>
    </div>
  );
};
