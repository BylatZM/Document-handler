import { Button, Popover } from 'antd';
import { FC } from 'react';
import { helpFormRequest } from '../../api/requests/Main';
import { useActions } from '../hooks/useActions';
import { useTypedSelector } from '../hooks/useTypedSelector';

interface IButtonsProps {
  changeActiveForm: (activeForm: null | 'help') => void;
  isAgrChecked: boolean;
}

export const Buttons: FC<IButtonsProps> = ({ changeActiveForm, isAgrChecked }) => {
  const { helpFormError, helpFormClear } = useActions();
  const { info, processed_possessions } = useTypedSelector((state) => state.HelpFormReducer);

  const onFinish = async () => {
    const { address } = info;
    if (info.description.length > 200 || info.description === '') {
      helpFormError({
        type: 'description',
        error: 'Поле "описание проблемы" не может быть пустым или содержать более 200 символов!',
      });
      return;
    }
    if (info.title === '') {
      helpFormError({
        type: 'title',
        error: 'Поле "заголовок" не может быть пустым',
      });
      return;
    }
    if (info.name === '') {
      helpFormError({
        type: 'name',
        error: 'Поле "имя заявителя" не может быть пустым',
      });
      return;
    }
    if (info.email === '') {
      helpFormError({
        type: 'email',
        error: 'Поле "адрес электронной почты" не может быть пустым',
      });
      return;
    }
    let result_address = !address ? '' : address;
    if (processed_possessions && /^[0-9]$/.test(result_address)) {
      result_address = processed_possessions[parseInt(result_address)];
    }
    changeActiveForm(null);
    helpFormClear();
    await helpFormRequest({
      ...info,
      address: result_address,
    });
  };

  return (
    <div className='flex justify-end m-0 px-5 py-2'>
      <Button
        className='border-[1px] border-blue-700 text-blue-700 h-[40px] mr-4'
        onClick={() => {
          changeActiveForm(null);
          helpFormClear();
        }}
      >
        Закрыть
      </Button>
      <Popover content={'Ответ от тех.поддержки придет на почту, которую вы указали'}>
        <Button
          className='bg-blue-700 text-white h-[40px] border-blue-700'
          disabled={isAgrChecked}
          type='primary'
          htmlType='submit'
          onClick={() => {
            onFinish();
          }}
        >
          Отправить
        </Button>
      </Popover>
    </div>
  );
};
