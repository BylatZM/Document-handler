import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Input, Form, Button } from 'antd';
import { CitizenForm } from './citizenForm/CitizenForm';
import { useActions } from '../../../hooks/useActions';
import { useEffect, useState } from 'react';
import { DefineOwnership } from './DefineOwnership';
import { ImSpinner9 } from 'react-icons/im';
import { clsx } from 'clsx';
import { getCitizenRequest, updateUserRequest } from '../../../../store/creators/PersonCreators';

interface IGenFormData {
  first_name: string | undefined;
  last_name: string | undefined;
  patronymic: string | undefined;
  phone: string | undefined;
}

export const PersonalAccount = () => {
  const [IsCurtainHidden, changeCurtainHidden] = useState(true);
  const [IsFormHidden, changeIsFormHidden] = useState(true);
  const { user, isLoading, error } = useTypedSelector((state) => state.UserReducer);
  const { userSuccess, userStart, addCitizenForm, citizenSuccess } = useActions();
  const citizens = useTypedSelector((state) => state.CitizenReducer.citizen);
  const [needUpdateCitizen, changeNeedUpdate] = useState(false);

  const changeFormVisibility = (status: boolean) => {
    setTimeout(() => changeIsFormHidden(status), 100);
    if (status) setTimeout(() => changeCurtainHidden(true), 1400);
    else changeCurtainHidden(false);
  };

  useEffect(() => {
    if (user.role.role === 'житель' && needUpdateCitizen) getCitizenData();
  }, [needUpdateCitizen]);

  const onFinish = async ({ first_name, last_name, patronymic, phone }: IGenFormData) => {
    userStart();
    const response = await updateUserRequest({
      first_name: !first_name ? '' : first_name,
      last_name: !last_name ? '' : last_name,
      patronymic: !patronymic ? null : patronymic,
      phone: !phone ? null : phone,
    });
    if (response === 200 && user) {
      userSuccess({
        ...user,
        first_name: !first_name ? '' : first_name,
        last_name: !last_name ? '' : last_name,
        patronymic: !patronymic ? null : patronymic,
        phone: !phone ? null : phone,
      });
    }
  };

  const getCitizenData = async () => {
    const response = await getCitizenRequest();
    if (response !== 403) citizenSuccess(response);
  };

  return (
    <>
      <div
        className={clsx(
          'transitionOpacity fixed inset-0 w-full h-screen bg-black bg-opacity-30 z-[10] backdrop-blur-md',
          IsCurtainHidden && 'hidden',
          IsFormHidden ? 'opacity-0' : 'opacity-100',
        )}
      ></div>
      <DefineOwnership
        IsHidden={IsFormHidden}
        changeIsHidden={changeFormVisibility}
        IsCurtainActive={IsCurtainHidden}
      />
      <div className='w-[500px] flex flex-col gap-4 m-auto p-2'>
        <Form
          initialValues={{
            remember: true,
          }}
          name='GeneralForm'
          onFinish={onFinish}
          autoComplete='off'
        >
          <span className='text-xl'>Основная информация</span>
          <div className='mt-2 mb-6 text-sm'>
            <span>Почта</span>
            <Input disabled={true} value={user.email} />
          </div>
          <div className='mt-2 mb-6 text-sm'>
            <span>Роль</span>
            <Input value={user.role.role} disabled={true} />
          </div>
          <div className='mt-2 mb-2 text-sm'>
            <span>Имя</span>
            <Form.Item
              name='first_name'
              initialValue={user.first_name}
              validateStatus={error && error.type === 'first_name' ? 'error' : undefined}
              help={
                error &&
                error.type === 'first_name' && <div className='errorText'>{error.error}</div>
              }
            >
              <Input maxLength={30} disabled={isLoading} />
            </Form.Item>
          </div>
          <div className='mt-2 mb-2 text-sm'>
            <span>Фамилия</span>
            <Form.Item
              name='last_name'
              initialValue={user.last_name}
              validateStatus={error && error.type === 'last_name' ? 'error' : undefined}
              help={
                error &&
                error.type === 'last_name' && <div className='errorText'>{error.error}</div>
              }
            >
              <Input maxLength={30} disabled={isLoading} />
            </Form.Item>
          </div>
          <div className='mt-2 mb-2 text-sm'>
            <span>Отчество</span>
            <Form.Item
              name='patronymic'
              initialValue={!user.patronymic ? '' : user.patronymic}
              validateStatus={error && error.type === 'patronymic' ? 'error' : undefined}
              help={
                error &&
                error.type === 'patronymic' && <div className='errorText'>{error.error}</div>
              }
            >
              <Input maxLength={30} disabled={isLoading} />
            </Form.Item>
          </div>
          <div className='mt-2 mb-2 text-sm'>
            <span>Номер телефона</span>
            <Form.Item
              name='phone'
              initialValue={!user.phone ? '' : user.phone}
              validateStatus={error && error.type === 'phone' ? 'error' : undefined}
              help={
                error && error.type === 'phone' && <div className='errorText'>{error.error}</div>
              }
            >
              <Input maxLength={15} disabled={isLoading} />
            </Form.Item>
          </div>
          <Button type='primary' className=' text-white bg-blue-700' htmlType='submit'>
            {!isLoading && 'Сохранить'}
            {isLoading && (
              <div className='inline-flex items-center'>
                <ImSpinner9 className='text-white animate-spin mr-4' />
                <span>Обработка</span>
              </div>
            )}
          </Button>
        </Form>
        {user.role.role === 'житель' && (
          <>
            <span className='text-xl'>Информация роли "житель"</span>
            <div className='flex gap-4'>
              <Button
                className='bg-blue-700 text-white w-min'
                type='primary'
                onClick={() => addCitizenForm()}
              >
                Добавить собственность
              </Button>
              <Button className='w-min' type='link' onClick={() => changeFormVisibility(false)}>
                Не нашли вашу собственность?
              </Button>
            </div>

            {citizens.map((el, index) => (
              <CitizenForm
                data={{
                  key: !el.id ? -1 * citizens.length : el.id,
                  info: el,
                  isFirstItem: index === 0 ? true : false,
                  isNew: el.id < 1 ? true : false,
                }}
                changeNeedUpdate={changeNeedUpdate}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
};
