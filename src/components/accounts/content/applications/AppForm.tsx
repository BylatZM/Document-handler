import { Input, Button, ConfigProvider, Select, Checkbox, DatePicker } from 'antd';
import ruPicker from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import clsx from 'clsx';
import { FC, useState } from 'react';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { IApplication } from '../../../types';
import {
  createApplicationsRequest,
  getApplicationsRequest,
  updateApplicationsRequest,
} from '../../../../store/creators/ApplicationCreators';
import { useActions } from '../../../hooks/useActions';

const { TextArea } = Input;

interface IProps {
  IsHidden: boolean;
  IsCurtainActive: boolean;
  changeIsHidden: (IsHidden: boolean) => void;
  id: number;
}

const initialApplication: IApplication = {
  building: {
    id: 0,
    address: '',
  },
  complex: {
    id: 0,
    name: '',
  },
  creatingDate: '',
  description: '',
  dispatcherComment: null,
  dueDate: null,
  employee: null,
  grade: 0,
  id: 0,
  isAppeal: false,
  possession: {
    id: 0,
    address: '',
  },
  priority: null,
  source: 0,
  status: null,
  type: 0,
};

export const AppForm: FC<IProps> = ({ IsHidden, IsCurtainActive, changeIsHidden, id }) => {
  dayjs.locale('ru');
  const role = useTypedSelector((state) => state.UserReducer.user.role);
  const citizen = useTypedSelector((state) => state.CitizenReducer.citizen);
  const { complex, building, possession } = useTypedSelector((state) => state.PossessionReducer);
  const { employs, types, sources, statuses, priorities, grades, userApplication } =
    useTypedSelector((state) => state.ApplicationReducer);
  const { applicationSuccess, updateApplication } = useActions();
  const [FormData, changeFormData] = useState<IApplication>(
    !userApplication.filter((el) => el.id === id).length
      ? initialApplication
      : userApplication.filter((el) => el.id === id)[0],
  );

  const get_applications = async () => {
    const applications = await getApplicationsRequest();
    if (applications !== 403) applicationSuccess(applications);
  };

  const update_application = async () => {
    const response = await updateApplicationsRequest(id, {
      employee: !FormData.employee ? 1 : FormData.employee.id,
      creatingDate: FormData.creatingDate,
      dueDate: FormData.dueDate,
      dispatcherComment: FormData.dispatcherComment,
      grade: FormData.grade,
      priority: FormData.priority,
      status: FormData.status,
    });
    if (response === 200) {
      updateApplication({ app_id: id, application: FormData });
    }
    if (typeof response !== 'number' && 'type' in response) console.log(response);
  };

  const create_application = async () => {
    const response = await createApplicationsRequest({
      source: FormData.source,
      type: FormData.type,
      description: FormData.description,
      isAppeal: FormData.isAppeal,
      complex: FormData.complex.id,
      building: FormData.building.id,
      possession: FormData.possession.id,
    });
    if (response === 201) await get_applications();
    if (typeof response !== 'number' && 'type' in response) console.log(response);
  };

  const getDaysDiff = (date1: string, date2: string) => {
    const firstDate = Date.parse(date1);
    const secondDate = Date.parse(date2);

    const timeDiff = secondDate - firstDate;

    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return daysDiff;
  };

  return (
    <div
      className={clsx(
        'transitionOpacity',
        'w-[700px] h-full fixed inset-0 m-auto z-[21] bg-blue-700 bg-opacity-10 backdrop-blur-xl border-solid border-2 border-blue-500 rounded-md p-5 overflow-y-auto',
        IsCurtainActive && 'hidden',
        IsHidden ? 'opacity-0' : 'opacity-100',
      )}
    >
      <div className='flex justify-center gap-4 flex-col'>
        <span className='font-bold text-lg'>Сведения</span>
        <div className='flex flex-wrap justify-between mt-8'>
          <div className='w-[48%] gap-2 flex flex-col'>
            <span>Класс заявки</span>
            <Select
              value={!FormData.grade ? undefined : FormData.grade}
              onChange={(e: number) => changeFormData((prev) => ({ ...prev, grade: e }))}
              disabled={role.role === 'житель' ? true : false}
              options={
                !grades
                  ? []
                  : grades.map((el) => ({
                      value: el.id,
                      label: el.appClass,
                    }))
              }
            />
          </div>
          <div className='w-[48%] gap-2 flex flex-col'>
            <span>Статус заявки</span>
            <Select
              value={!FormData.status ? undefined : FormData.status}
              onChange={(e: number) => changeFormData((prev) => ({ ...prev, status: e }))}
              disabled={role.role === 'житель' ? true : false}
              options={
                !statuses
                  ? []
                  : statuses.map((el) => ({
                      value: el.id,
                      label: el.appStatus,
                    }))
              }
            />
          </div>
          <div className='w-[48%] gap-2 flex flex-col'>
            <span className='primaryField'>Тип заявки</span>
            <Select
              value={!FormData.type ? undefined : FormData.type}
              disabled={role.role === 'диспетчер' ? true : false}
              onChange={(e: number) => changeFormData((prev) => ({ ...prev, type: e }))}
              options={
                !types
                  ? []
                  : types.map((el) => ({
                      value: el.id,
                      label: el.appType,
                    }))
              }
            />
          </div>
        </div>

        <Checkbox
          className='mt-2'
          checked={!FormData.isAppeal ? false : true}
          disabled={role.role === 'диспетчер' ? true : false}
          onChange={(e) => changeFormData((prev) => ({ ...prev, isAppeal: e.target.checked }))}
        >
          Обращение
        </Checkbox>

        <div className='mt-2 gap-2 flex flex-col'>
          <span className='primaryField'>Описание заявки</span>
          <TextArea
            value={FormData.description}
            onChange={(e) => changeFormData((prev) => ({ ...prev, description: e.target.value }))}
            className='rounded-md h-[60px]'
            disabled={role.role === 'диспетчер' ? true : false}
            maxLength={500}
            style={{ resize: 'none' }}
          />
        </div>
        <div className='w-[48%] mt-2 gap-2 flex flex-col'>
          <span className='primaryField'>Источник</span>
          <Select
            value={!FormData.source ? undefined : FormData.source}
            disabled={role.role === 'диспетчер' ? true : false}
            onChange={(e: number) => changeFormData((prev) => ({ ...prev, source: e }))}
            options={
              !sources
                ? []
                : sources.map((el) => ({
                    value: el.id,
                    label: el.appSource,
                  }))
            }
          />
        </div>
        <div className='w-[48%] mt-2 gap-2 flex flex-col'>
          <span>Приоритет исполнения</span>
          <Select
            disabled={role.role === 'житель' ? true : false}
            value={!FormData.priority ? undefined : FormData.priority}
            onChange={(e: number) => changeFormData((prev) => ({ ...prev, priority: e }))}
            options={
              !priorities
                ? []
                : priorities.map((el) => ({
                    value: el.id,
                    label: el.appPriority,
                  }))
            }
          />
        </div>
        <span className='font-bold text-lg mt-4'>Объект исполнения</span>
        <div className='flex flex-wrap gap-2 justify-between mt-2'>
          <div className='flex flex-col gap-2 w-[48%]'>
            <span className='primaryField'>Жилой комплекс</span>
            <Select
              value={!FormData.complex.id ? undefined : FormData.complex.id}
              onChange={(e: number) =>
                changeFormData((prev) => ({
                  ...prev,
                  complex: { id: e, name: '' },
                  building: {
                    id: citizen.filter((el) => el.complex.id === e)[0].building.id,
                    address: citizen.filter((el) => el.complex.id === e)[0].building.address,
                  },
                  possession: {
                    id: citizen.filter((el) => el.complex.id === e)[0].possession.id,
                    address: citizen.filter((el) => el.complex.id === e)[0].possession.address,
                  },
                }))
              }
              disabled={role.role === 'диспетчер' ? true : false}
              options={
                role.role === 'диспетчер'
                  ? [{ value: FormData.complex.id, label: FormData.complex.name }]
                  : citizen.map((el) => ({
                      value: el.complex.id,
                      label: el.complex.name,
                    }))
              }
            />
          </div>
          <div className='flex flex-col gap-2 w-[48%]'>
            <span className='primaryField'>Здание</span>
            <Select
              value={!FormData.building.id ? undefined : FormData.building.id}
              onChange={(e: number) =>
                changeFormData((prev) => ({
                  ...prev,
                  building: { id: e, address: '' },
                  complex: {
                    id: citizen.filter((el) => el.building.id === e)[0].complex.id,
                    name: citizen.filter((el) => el.building.id === e)[0].complex.name,
                  },
                  possession: {
                    id: citizen.filter((el) => el.building.id === e)[0].possession.id,
                    address: citizen.filter((el) => el.building.id === e)[0].possession.address,
                  },
                }))
              }
              disabled={role.role === 'диспетчер' ? true : false}
              options={
                role.role === 'диспетчер'
                  ? [{ label: FormData.building.address, value: FormData.building.id }]
                  : citizen.map((el) => ({
                      value: el.building.id,
                      label: el.building.address,
                    }))
              }
            />
          </div>
          <div className='flex flex-col gap-2 w-[48%]'>
            <span className='primaryField'>Собственность</span>
            <Select
              value={!FormData.possession.id ? undefined : FormData.possession.id}
              onChange={(e: number) =>
                changeFormData((prev) => ({
                  ...prev,
                  possession: { id: e, address: '' },
                  complex: {
                    id: citizen.filter((el) => el.possession.id === e)[0].complex.id,
                    name: citizen.filter((el) => el.possession.id === e)[0].complex.name,
                  },
                  building: {
                    id: citizen.filter((el) => el.possession.id === e)[0].building.id,
                    address: citizen.filter((el) => el.possession.id === e)[0].building.address,
                  },
                }))
              }
              disabled={role.role === 'диспетчер' ? true : false}
              options={
                role.role === 'диспетчер'
                  ? [{ label: FormData.possession.address, value: FormData.possession.id }]
                  : citizen.map((el) => ({
                      value: el.possession.id,
                      label: el.possession.address,
                    }))
              }
            />
          </div>
        </div>
        <span className='font-bold text-lg mt-2'>Таймслот</span>
        <div className='flex flex-wrap gap-2 mt-2 justify-between'>
          <div className='flex flex-col gap-2 w-[48%]'>
            <span>Плановое время начала работ</span>
            <ConfigProvider locale={ruPicker}>
              <DatePicker
                value={!FormData.creatingDate ? null : dayjs(FormData.creatingDate, 'YYYY-MM-DD')}
                onChange={(e) =>
                  changeFormData((prev) => ({
                    ...prev,
                    creatingDate: !e ? '' : e.format('YYYY-MM-DD'),
                  }))
                }
                className='w-full'
                disabled={role.role === 'житель' ? true : false}
                placeholder=''
              />
            </ConfigProvider>
          </div>
          <div className='flex flex-col gap-2 w-[48%]'>
            <span>Плановое время окончания работ</span>
            <ConfigProvider locale={ruPicker}>
              <DatePicker
                value={!FormData.dueDate ? null : dayjs(FormData.dueDate, 'YYYY-MM-DD')}
                onChange={(e) =>
                  changeFormData((prev) => ({ ...prev, dueDate: !e ? '' : e.format('YYYY-MM-DD') }))
                }
                className='w-full'
                disabled={role.role === 'житель' ? true : false}
                placeholder=''
              />
            </ConfigProvider>
          </div>
          <div className='flex flex-col gap-2 w-[48%]'>
            <span>Плановая длительность работ (в днях)</span>
            <Input
              disabled={true}
              value={
                FormData.creatingDate && FormData.dueDate
                  ? getDaysDiff(FormData.creatingDate, FormData.dueDate)
                  : ''
              }
            />
          </div>
          <div className='flex flex-col gap-2 w-full mt-6'>
            <span>Комментарий управ. компании</span>
            <TextArea
              value={!FormData.dispatcherComment ? '' : FormData.dispatcherComment}
              onChange={(e) =>
                changeFormData((prev) => ({ ...prev, dispatcherComment: e.target.value }))
              }
              className='rounded-md h-[60px]'
              maxLength={500}
              style={{ resize: 'none' }}
              disabled={role.role === 'житель' ? true : false}
            />
          </div>
        </div>
        <div className='bg-blue-300 p-5 mt-2 rounded-md backdrop-blur-md bg-opacity-50 flex flex-col gap-2'>
          <span className='font-bold text-lg'>Исполнители</span>
          <div className='flex flex-col gap-2 w-full'>
            <span>Исполнитель</span>
            <Select
              value={!FormData.employee ? undefined : FormData.employee.id}
              onChange={(e: number) =>
                changeFormData((prev) => ({
                  ...prev,
                  employee: {
                    id: e,
                    user: {
                      first_name: '',
                      last_name: '',
                      patronymic: '',
                    },
                  },
                }))
              }
              disabled={role.role === 'житель' ? true : false}
              options={
                role.role === 'житель' && FormData.employee
                  ? [
                      {
                        label:
                          FormData.employee.user.last_name +
                          ' ' +
                          FormData.employee.user.first_name +
                          ' ' +
                          FormData.employee.user.patronymic,
                        value: FormData.employee.id,
                      },
                    ]
                  : !employs
                  ? []
                  : employs.map((el) => ({
                      value: el.id,
                      label:
                        el.user.last_name + ' ' + el.user.first_name + ' ' + el.user.patronymic,
                    }))
              }
            />
          </div>
        </div>
        <div className='gap-4 flex justify-center mt-4'>
          {id < 1 && role.role === 'житель' && (
            <Button
              type='primary'
              onClick={create_application}
              className='text-white bg-blue-700 '
              disabled={
                FormData.building &&
                FormData.complex &&
                FormData.possession &&
                FormData.source &&
                FormData.type &&
                FormData.description
                  ? false
                  : true
              }
            >
              Отправить
            </Button>
          )}
          {id !== 0 && role.role === 'диспетчер' && (
            <Button
              type='primary'
              onClick={update_application}
              className=' text-white bg-blue-700 '
              disabled={
                FormData.grade &&
                FormData.creatingDate &&
                FormData.dueDate &&
                FormData.priority &&
                FormData.status &&
                FormData.dispatcherComment &&
                FormData.employee
                  ? false
                  : true
              }
            >
              Обновить
            </Button>
          )}
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
      </div>
    </div>
  );
};
