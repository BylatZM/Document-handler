import { Button, ConfigProvider } from 'antd';
import { FC, useState } from 'react';
import { requestFromHelpForm } from '../../../../api/requests/Main';
import { useActions } from '../../../hooks/useActions';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Logo } from '../../../../assets/svg';
import { ImSpinner9, ImCross } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';

interface IButtonsProps {
  changeNeedShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  isAgreementChecked: boolean;
}

export const Buttons: FC<IButtonsProps> = ({ changeNeedShowForm, isAgreementChecked }) => {
  const { helpFormError, helpFormClear, helpFormLoading } = useActions();
  const { info, processedPossessions, isLoading, error } = useTypedSelector(
    (state) => state.HelpFormReducer,
  );
  const [isRequestSuccess, changeIsRequestSuccess] = useState(false);

  const onFinish = async () => {
    const { address } = info;

    if (info.description.length > 200 || !info.description) {
      helpFormError({
        type: 'description',
        error: 'Поле "описание проблемы" не может быть пустым или содержать более 200 символов!',
      });
      return;
    }
    if (!info.title) {
      helpFormError({
        type: 'title',
        error: 'Поле "заголовок" не может быть пустым',
      });
      return;
    }
    if (
      !/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/.test(info.contact) &&
      !/\+\d{11}/.test(info.contact)
    ) {
      helpFormError({
        type: 'contact',
        error:
          'Поле "Контактные данные" не может быть незаполненным, пожалуйста, укажите корректный номер телефона или корректную почту',
      });
      return;
    }
    if (!/^[а-яА-Я]+$/.test(info.name)) {
      helpFormError({
        type: 'name',
        error:
          'Поле "имя заявителя" не может быть незаполненным и должно состоять только из букв русского алфавита',
      });
      return;
    }
    let result_address = !address ? '' : address;
    if (processedPossessions && /^[0-9]$/.test(result_address)) {
      result_address = processedPossessions[parseInt(result_address)];
    }

    helpFormLoading(true);
    await requestFromHelpForm({
      ...info,
      address: result_address,
    });
    helpFormLoading(false);
    changeIsRequestSuccess((prev) => !prev);
    setTimeout(() => {
      changeIsRequestSuccess((prev) => !prev);
      changeNeedShowForm(false);
      helpFormClear();
    }, 2000);
  };

  return (
    <div className='flex justify-between m-0 py-2 sm:flex-row sm:items-center gap-y-2 items-start flex-col'>
      <Logo />
      <div className='flex gap-x-4'>
        <Button
          className='border-[1px] border-blue-700 text-blue-700 h-[40px] mr-4'
          disabled={isLoading || isRequestSuccess}
          onClick={() => {
            changeNeedShowForm(false);
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
          <Button
            className='text-white h-[40px] bg-blue-700'
            disabled={!isAgreementChecked && !isRequestSuccess && !isLoading ? false : true}
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
                <span>Ошибка</span>
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
        </ConfigProvider>
      </div>
    </div>
  );
};
