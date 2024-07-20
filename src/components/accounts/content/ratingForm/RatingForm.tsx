import { Form } from 'antd';
import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import { Inputs } from './components/Inputs';
import {
  IBuilding,
  ICitizenFio,
  IError,
  IPossession,
  IRatingForm,
  IRatingFormLoading,
} from '../../../types';
import { Buttons } from './components/Buttons';
import { FakeForm } from './components/FakeForm';
import { AddCitizenMarkRequest } from '../../../../api/requests/User';
import { useLogout } from '../../../hooks/useLogout';

interface IProps {
  needShowForm: boolean;
  changeNeedShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const formItemLayout = {
  labelCol: {
    span: 24,
  },
};

export const RatingForm: FC<IProps> = ({ needShowForm, changeNeedShowForm }) => {
  const [form] = Form.useForm<IRatingForm>();
  const [error, changeError] = useState<IError | null>(null);
  const [isLoading, changeIsLoading] = useState<IRatingFormLoading>(null);
  const [isRequestSuccess, changeIsRequestSuccess] = useState(false);
  const [citizens, setCitizens] = useState<ICitizenFio[]>([]);
  const [buildings, setBuildings] = useState<IBuilding[]>([]);
  const [possessions, setPossessions] = useState<IPossession[]>([]);
  const logout = useLogout();

  useEffect(() => {
    if (!needShowForm) return;
    form.setFieldsValue({
      complex: undefined,
      building: undefined,
      possessionType: undefined,
      possession: undefined,
      citizen: undefined,
      mark: undefined,
    });
  }, [needShowForm]);

  const onFinish = async (info: IRatingForm) => {
    if (!info.citizen || !info.mark) return;
    changeIsLoading((prev) => 'form');
    await AddCitizenMarkRequest(
      {
        citizen: info.citizen,
        mark: info.mark,
      },
      logout,
    );
    changeIsLoading((prev) => null);
    changeIsRequestSuccess((prev) => !prev);
    setTimeout(() => {
      changeIsRequestSuccess((prev) => !prev);
      exitFromForm();
    }, 2000);
  };

  const exitFromForm = () => {
    setCitizens([]);
    setBuildings([]);
    setPossessions([]);
    changeNeedShowForm(false);
  };

  return (
    <div
      className={clsx(
        'transitionGeneral bg-blue-500 bg-opacity-10 backdrop-blur-xl z-50 fixed inset-0 mx-auto flex justify-center items-center overflow-hidden',
        needShowForm ? 'w-full' : 'w-0',
      )}
    >
      <div
        className='flex flex-col bg-blue-700 p-4 max-sm:p-2 bg-opacity-10 backdrop-blur-xl rounded-md min-w-[280px] max-w-[280px] sm:min-w-[600px] sm:max-w-[600px] overflow-x-hidden overflow-y-auto relative'
        style={{ maxHeight: 'calc(100vh - 20px)' }}
      >
        <div className='fixed inset-0 flex justify-center items-center z-[-1] m-auto sm:max-w-[280px]'>
          <svg className='w-full h-auto aspect-square' viewBox='0 0 60 47'>
            <g id='surface1'>
              <path
                fill='#d69a9a'
                d='M 23.199219 0.109375 C 23.199219 0.109375 0.0390625 35.429688 0.00390625 35.53125 L 7.691406 46.917969 C 52.707031 46.730469 52.441406 46.917969 52.441406 46.917969 L 54.28125 44.226562 C 55.253906 42.800781 56.164062 41.445312 56.296875 41.242188 C 56.433594 41.027344 56.804688 40.488281 57.121094 40.054688 C 58.484375 38.109375 60 35.796875 60 35.628906 C 60 35.53125 59.226562 34.324219 58.285156 32.933594 C 57.324219 31.542969 56.46875 30.25 56.367188 30.085938 C 56.265625 29.917969 56.0625 29.632812 55.929688 29.480469 C 55.792969 29.3125 54.597656 27.585938 53.304688 25.660156 C 51.992188 23.71875 50.679688 21.808594 50.394531 21.386719 C 50.089844 20.96875 44.925781 13.429688 44.925781 13.429688 L 30.101562 13.511719 L 38.703125 0.109375 Z M 30.101562 13.511719 C 30.101562 13.511719 41.8125 31.007812 44.859375 35.546875 C 44.859375 35.597656 44.859375 35.496094 44.859375 35.546875 C 44.859375 35.597656 44.859375 35.597656 44.859375 35.546875 C 36.714844 35.546875 15.128906 35.597656 15.128906 35.546875 Z M 30.101562 13.511719 '
              />
            </g>
          </svg>
        </div>
        <div className='text-center text-xl font-bold mb-4 max-sm:mb-2'>
          Выставить оценку собственнику
        </div>
        {needShowForm && (
          <Form {...formItemLayout} onFinish={onFinish} form={form} name='set_citizen_rating_form'>
            <Inputs
              form={form}
              error={error}
              changeError={changeError}
              citizens={citizens}
              setCitizens={setCitizens}
              buildings={buildings}
              setBuildings={setBuildings}
              possessions={possessions}
              setPossessions={setPossessions}
              isLoading={isLoading}
              changeIsLoading={changeIsLoading}
              logout={logout}
            />
            <div className='text-left my-4 max-sm:my-2 p-2 text-gray-600 text-sm bg-blue-300 rounded-md backdrop-blur-md bg-opacity-50 '>
              На данной форме вы можете выставить оценку собственнику имущества. Данный показатель
              не будет показан ему.
            </div>
            <Buttons
              isLoading={isLoading}
              isRequestBad={error ? true : false}
              isRequestSuccess={isRequestSuccess}
              exitFromForm={exitFromForm}
            />
          </Form>
        )}
        {!needShowForm && <FakeForm />}
      </div>
    </div>
  );
};
