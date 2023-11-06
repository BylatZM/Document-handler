import { Form, Checkbox, ConfigProvider } from 'antd';
import Styles from './HelpForm.module.scss';
import { FC, useState } from 'react';
import clsx from 'clsx';
import { Buttons } from './Buttons';
import { Inputs } from './Inputs';
import { useActions } from '../../hooks/useActions';

interface IHelpFormProps {
  showHelpForm: boolean;
  changeShowForm: (state: boolean) => void;
}

interface IFinishProps {
  userName: string;
  email: string;
  title: string;
  address: string;
  reason: string;
}

export const HelpForm: FC<IHelpFormProps> = ({ showHelpForm, changeShowForm }) => {
  const { helpFormReducerError, helpFormReducerStart, helpFormReducerSuccess } = useActions();
  const [isAgrChecked, changeIsAgr] = useState(true);

  const onFinish = (props: IFinishProps) => {
    helpFormReducerStart();
    setTimeout(() => {
      helpFormReducerSuccess({ ...props, address: !props.address ? null : props.address });
    }, 3000);
  };

  return (
    <div className={clsx(Styles.main, showHelpForm && Styles.main_active)}>
      <h1 className={Styles.title}>Обратная связь</h1>

      <Form
        name='form'
        className={Styles.form}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete='off'
      >
        <div className={Styles.inputs}>
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
            className='text-left text-gray-400 px-5 py-2'
            onClick={() => changeIsAgr(!isAgrChecked)}
          >
            Я принимаю пользовательское соглашение и даю разрешение порталу на обработку моих
            персональных данных в соотвествии с Федеральным законом №152-ФЗ от 27.07.2006 года “О
            персональных данных”"
          </Checkbox>
        </ConfigProvider>
        <Buttons
          changeShowForm={changeShowForm}
          isAgrChecked={isAgrChecked}
          showHelpForm={showHelpForm}
        />
      </Form>
    </div>
  );
};
