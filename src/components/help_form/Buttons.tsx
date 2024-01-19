import { Button, ConfigProvider, Popover } from 'antd';
import { FC, useState } from 'react';
import { helpFormRequest } from '../../api/requests/Main';
import { useActions } from '../hooks/useActions';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { Logo } from '../../assets/svg';
import { ImSpinner9, ImCross } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';
import clsx from 'clsx';

interface IButtonsProps {
  changeActiveForm: (activeForm: null | 'help') => void;
  isAgrChecked: boolean;
}

export const Buttons: FC<IButtonsProps> = ({ changeActiveForm, isAgrChecked }) => {
  const { helpFormError, helpFormClear, helpFormLoading } = useActions();
  const { info, processed_possessions, isLoading, error } = useTypedSelector(
    (state) => state.HelpFormReducer,
  );
  const [isRequestSuccess, changeIsRequestSuccess] = useState(false);

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
    helpFormLoading(true);
    await helpFormRequest({
      ...info,
      address: result_address,
    });
    helpFormLoading(false);
    changeIsRequestSuccess((prev) => !prev);
    setTimeout(() => {
      changeIsRequestSuccess((prev) => !prev);
      changeActiveForm(null);
      helpFormClear();
    }, 2000);
  };

  return (
    <div className='flex justify-between m-0 py-2 items-center'>
      <Logo />
      <div className='flex gap-x-4'>
        <Button
          className='border-[1px] border-blue-700 text-blue-700 h-[40px] mr-4'
          disabled={isLoading || isRequestSuccess}
          onClick={() => {
            changeActiveForm(null);
            helpFormClear();
          }}
        >
          Закрыть
        </Button>
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimaryHover: undefined,
              },
            },
          }}
        >
          <Popover content={'Если у вас нет почты, пожалуйста, укажите другие контактные данные'}>
            <Button
              className={clsx(
                'text-white h-[40px]',
                !error && !isRequestSuccess && 'bg-blue-700',
                error && !isRequestSuccess && !isLoading && 'bg-red-500',
                !error && isRequestSuccess && !isLoading && 'bg-green-500',
              )}
              disabled={isAgrChecked}
              type='primary'
              htmlType='submit'
              onClick={() => {
                onFinish();
              }}
            >
              {isLoading && (
                <div className='inline-flex items-center'>
                  <ImSpinner9 className='animate-spin mr-2' />
                  <span>Обработка</span>
                </div>
              )}
              {error && !isLoading && !isRequestSuccess && (
                <div className='inline-flex items-center'>
                  <ImCross className='mr-2' />
                  <span>Отказано</span>
                </div>
              )}
              {!isLoading && !error && isRequestSuccess && (
                <div className='inline-flex items-center'>
                  <HiOutlineCheck className='mr-2 font-bold text-lg' />
                  <span>Успешно</span>
                </div>
              )}
              {!isLoading && !error && !isRequestSuccess && <>Отправить</>}
            </Button>
          </Popover>
        </ConfigProvider>
      </div>
    </div>
  );
};
