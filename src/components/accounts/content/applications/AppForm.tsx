import { Input, Button, ConfigProvider, Select, Checkbox } from 'antd';
import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { IApplication, IApplicationRequest, ICar } from '../../../types';
import {
  createApplicationsRequest,
  getApplicationsRequest,
  updateApplicationsRequest,
} from '../../../../api/requests/Application';
import { useActions } from '../../../hooks/useActions';
import { useLogout } from '../../../hooks/useLogout';
import { getBuildingsRequest, getPossessionsRequest } from '../../../../api/requests/Possession';

const { TextArea } = Input;

interface IProps {
  IsFormActive: boolean;
  changeIsFormActive: (IsFormActive: boolean) => void;
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
  citizenComment: '',
  dispatcherComment: null,
  dueDate: null,
  employee: null,
  grade: 1,
  id: 0,
  isAppeal: false,
  possession: {
    id: 0,
    address: '',
    car: null,
  },
  priority: null,
  source: 0,
  status: 1,
  type: 0,
  user: 0,
  possessionType: '1',
};

export const AppForm: FC<IProps> = ({ IsFormActive, changeIsFormActive, id }) => {
  const logout = useLogout();
  const role = useTypedSelector((state) => state.UserReducer.user.role);
  const citizen = useTypedSelector((state) => state.CitizenReducer.citizen);
  const { employs, types, sources, statuses, priorities, grades, userApplication } =
    useTypedSelector((state) => state.ApplicationReducer);
  const { complex, possession, building } = useTypedSelector((state) => state.PossessionReducer);
  const [carInfo, changeCarInfo] = useState<ICar | null>(null);
  const { error } = useTypedSelector((state) => state.CitizenReducer);
  const {
    applicationSuccess,
    updateApplication,
    buildingSuccess,
    possessionSuccess,
    citizenErrors,
  } = useActions();
  const formInfo = !userApplication.filter((el) => el.id === id).length
    ? []
    : userApplication.filter((el) => el.id === id);

  const [FormData, changeFormData] = useState<IApplication>(
    !formInfo.length ? initialApplication : formInfo[0],
  );

  const get_applications = async () => {
    const applications = await getApplicationsRequest(logout);
    if (applications) applicationSuccess(applications);
  };

  const getBuildings = async (complex_id: string) => {
    const response = await getBuildingsRequest(complex_id, logout);
    if (response) buildingSuccess(response);
    citizenErrors(null);
  };

  const getPossessions = async (type: string, building_id: string) => {
    const response = await getPossessionsRequest(0, type, building_id, logout);

    if (!response) return;

    if ('form_id' in response) {
      citizenErrors(response);
    } else {
      possessionSuccess(response);
      citizenErrors(null);
    }
  };

  useEffect(() => {
    if (userApplication.filter((el) => el.id === id).length && IsFormActive) {
      const application = userApplication.filter((el) => el.id === id)[0];
      changeFormData(application);
      if (application.possession.car) {
        changeCarInfo(application.possession.car);
      }
    }
  }, [IsFormActive]);

  const exitFromForm = () => {
    changeFormData(initialApplication);
    changeIsFormActive(false);
  };

  const update_application = async () => {
    let data: IApplicationRequest = {
      grade: FormData.grade,
      status: FormData.status,
      priority: FormData.priority,
      source: FormData.source,
      type: FormData.type,
      dispatcherComment: FormData.dispatcherComment,
      citizenComment: FormData.citizenComment,
      isAppeal: FormData.isAppeal,
      complex: FormData.complex.id,
      building: FormData.building.id,
      possession: FormData.possession.id,
      employee: !FormData.employee ? 1 : FormData.employee.id,
    };
    if (role.role === 'executor') {
      data = {
        status: FormData.status,
        employeeComment: FormData.employeeComment,
      };
    }
    const response = await updateApplicationsRequest(id, logout, data);
    if (response === 200) {
      updateApplication({ app_id: id, application: FormData });
      if (FormData.status === 10) await get_applications();
    }
  };

  const create_application = async () => {
    let data: IApplicationRequest = {
      source: FormData.source,
      type: FormData.type,
      citizenComment: FormData.citizenComment,
      isAppeal: FormData.isAppeal,
      complex: FormData.complex.id,
      building: FormData.building.id,
      possession: FormData.possession.id,
    };
    if (role.role === 'dispatcher') {
      data = {
        grade: FormData.grade,
        status: FormData.status,
        priority: FormData.priority,
        source: FormData.source,
        type: FormData.type,
        citizenComment: FormData.citizenComment,
        isAppeal: FormData.isAppeal,
        complex: FormData.complex.id,
        building: FormData.building.id,
        possession: FormData.possession.id,
        employee: !FormData.employee ? 1 : FormData.employee.id,
      };
      if (FormData.dispatcherComment)
        data = {
          ...data,
          dispatcherComment: FormData.dispatcherComment,
        };
    }

    const response = await createApplicationsRequest(logout, data);
    if (response === 201) await get_applications();
  };

  return (
    <div
      className={clsx(
        'transitionGeneral w-[700px] h-full fixed inset-0 m-auto z-[21] bg-blue-700 bg-opacity-10 backdrop-blur-xl border-solid border-2 border-blue-500 rounded-md p-5 overflow-y-auto',
        IsFormActive ? 'translate-x-0' : 'translate-x-[-100vw]',
      )}
    >
      <div className='flex justify-center gap-4 flex-col'>
        <span className='font-bold text-lg'>Сведения</span>
        <div className='flex flex-wrap justify-between mt-8'>
          <div className='w-[48%] gap-2 flex flex-col'>
            <span>Класс заявки</span>
            <Select
              value={!FormData.grade ? 1 : FormData.grade}
              disabled
              options={
                !grades
                  ? [{ value: 1, label: 'Клиентская' }]
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
              disabled={
                role.role === 'citizen' || (formInfo.length > 0 && formInfo[0].status !== 1)
                  ? true
                  : false
              }
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
            <span>Тип заявки</span>
            <Select
              value={!FormData.type ? undefined : FormData.type}
              disabled={
                role.role === 'executor' ||
                (role.role === 'citizen' && id > 0) ||
                (formInfo.length > 0 && formInfo[0].status !== 1)
                  ? true
                  : false
              }
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
          disabled={
            role.role === 'executor' ||
            (role.role === 'citizen' && id > 0) ||
            (formInfo.length > 0 && formInfo[0].status !== 1)
              ? true
              : false
          }
          onChange={(e) => changeFormData((prev) => ({ ...prev, isAppeal: e.target.checked }))}
        >
          Обращение
        </Checkbox>

        <div className='mt-2 gap-2 flex flex-col'>
          <span>Описание заявки</span>
          <TextArea
            value={FormData.citizenComment}
            onChange={(e) =>
              changeFormData((prev) => ({ ...prev, citizenComment: e.target.value }))
            }
            className='rounded-md h-[60px]'
            disabled={
              role.role === 'executor' ||
              (role.role === 'citizen' && id > 0) ||
              (formInfo.length > 0 && formInfo[0].status !== 1)
                ? true
                : false
            }
            showCount
            maxLength={500}
            style={{ resize: 'none' }}
          />
        </div>
        <div className='w-[48%] mt-2 gap-2 flex flex-col'>
          <span>Источник</span>
          <Select
            value={!FormData.source ? undefined : FormData.source}
            disabled={
              role.role === 'executor' ||
              (role.role === 'citizen' && id > 0) ||
              (formInfo.length > 0 && formInfo[0].status !== 1)
                ? true
                : false
            }
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
            disabled={
              ['executor', 'citizen'].some((el) => el === role.role) ||
              (formInfo.length > 0 && formInfo[0].status !== 1)
                ? true
                : false
            }
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
            <span>Жилой комплекс</span>
            {role.role !== 'dispatcher' && (
              <Select
                value={!FormData.complex.id ? undefined : FormData.complex.id}
                onChange={(e: number) => {
                  changeCarInfo(null);
                  if (
                    citizen.filter(
                      (el) =>
                        el.possession.id ===
                        citizen.filter((el) => el.complex.id === e)[0].possession.id,
                    )[0].possession.car
                  )
                    changeCarInfo(
                      citizen.filter(
                        (el) =>
                          el.possession.id ===
                          citizen.filter((el) => el.complex.id === e)[0].possession.id,
                      )[0].possession.car,
                    );
                  changeFormData((prev) => ({
                    ...prev,
                    complex: { id: e, name: '' },
                    building: {
                      id: citizen.filter((el) => el.complex.id === e)[0].building.id,
                      address: citizen.filter((el) => el.complex.id === e)[0].building.address,
                    },
                    possession: {
                      ...prev.possession,
                      id: citizen.filter((el) => el.complex.id === e)[0].possession.id,
                      address: citizen.filter((el) => el.complex.id === e)[0].possession.address,
                    },
                  }));
                }}
                disabled={id !== 0 ? true : false}
                options={
                  id !== 0
                    ? [{ value: FormData.complex.id, label: FormData.complex.name }]
                    : citizen
                        .filter((el, index, array) => {
                          const prevIndex = array.findIndex((prevItem, prevIndex) => {
                            return prevIndex < index && prevItem.complex.id === el.complex.id;
                          });

                          return prevIndex === -1;
                        })
                        .map((el) => ({
                          value: el.complex.id,
                          label: el.complex.name,
                        }))
                }
              />
            )}
            {role.role === 'dispatcher' && (
              <Select
                value={!FormData.complex.id ? undefined : FormData.complex.id}
                onChange={(e: number) => {
                  possessionSuccess([]);
                  buildingSuccess([]);
                  changeCarInfo(null);
                  citizenErrors(null);
                  getBuildings(e.toString());
                  changeFormData((prev) => ({
                    ...prev,
                    complex: { id: e, name: '' },
                    building: { id: 0, address: '' },
                    possession: { id: 0, address: '', car: null },
                  }));
                }}
                disabled={id !== 0 ? true : false}
                options={
                  id !== 0
                    ? [{ label: FormData.complex.name, value: FormData.complex.id }]
                    : complex
                    ? complex.map((el) => ({
                        label: el.name,
                        value: el.id,
                      }))
                    : []
                }
              />
            )}
          </div>
          {role.role === 'dispatcher' && id === 0 && (
            <div className='flex flex-col gap-2 w-[48%]'>
              <span>Тип имущества</span>
              <Select
                className='w-full'
                options={[
                  { label: 'квартира', value: 1 },
                  { label: 'офис', value: 2 },
                  { label: 'кладовка', value: 4 },
                  { label: 'парковка', value: 3 },
                ]}
                value={parseInt(FormData.possessionType)}
                disabled={id !== 0 ? true : false}
                onChange={(e: number) => {
                  citizenErrors(null);
                  changeCarInfo(null);
                  changeFormData((prev) => ({
                    ...prev,
                    possessionType: e.toString(),
                    possession: { id: 0, address: '', car: null },
                  }));
                  if (FormData.building.id) {
                    getPossessions(e.toString(), FormData.building.id.toString());
                  }
                }}
              />
            </div>
          )}
          <div className='flex flex-col gap-2 w-[48%]'>
            <span>Здание</span>
            {role.role !== 'dispatcher' && (
              <Select
                value={!FormData.building.id ? undefined : FormData.building.id}
                onChange={(e: number) => {
                  changeCarInfo(null);
                  if (
                    citizen.filter(
                      (el) =>
                        el.possession.id ===
                        citizen.filter((el) => el.building.id === e)[0].possession.id,
                    )[0].possession.car
                  )
                    changeCarInfo(
                      citizen.filter(
                        (el) =>
                          el.possession.id ===
                          citizen.filter((el) => el.building.id === e)[0].possession.id,
                      )[0].possession.car,
                    );
                  changeFormData((prev) => ({
                    ...prev,
                    building: { id: e, address: '' },
                    complex: {
                      id: citizen.filter((el) => el.building.id === e)[0].complex.id,
                      name: citizen.filter((el) => el.building.id === e)[0].complex.name,
                    },
                    possession: {
                      ...prev.possession,
                      id: citizen.filter((el) => el.building.id === e)[0].possession.id,
                      address: citizen.filter((el) => el.building.id === e)[0].possession.address,
                    },
                  }));
                }}
                disabled={id !== 0 ? true : false}
                options={
                  id !== 0
                    ? [{ label: FormData.building.address, value: FormData.building.id }]
                    : citizen
                        .filter((el, index, array) => {
                          const prevIndex = array.findIndex((prevItem, prevIndex) => {
                            return prevIndex < index && prevItem.building.id === el.building.id;
                          });

                          return prevIndex === -1;
                        })
                        .map((el) => ({
                          value: el.building.id,
                          label: el.building.address,
                        }))
                }
              />
            )}
            {role.role === 'dispatcher' && (
              <Select
                value={!FormData.building.id ? undefined : FormData.building.id}
                onChange={(e: number) => {
                  possessionSuccess([]);
                  changeCarInfo(null);
                  citizenErrors(null);
                  getPossessions(FormData.possessionType, e.toString());
                  changeFormData((prev) => ({
                    ...prev,
                    building: { id: e, address: '' },
                    possession: {
                      id: 0,
                      address: '',
                      car: null,
                    },
                  }));
                }}
                disabled={id !== 0 || FormData.complex.id === 0 ? true : false}
                options={
                  id !== 0
                    ? [{ label: FormData.building.address, value: FormData.building.id }]
                    : building
                    ? building.map((el) => ({
                        value: el.id,
                        label: el.address,
                      }))
                    : []
                }
              />
            )}
          </div>
          <div className='flex flex-col gap-2 w-[48%]'>
            <span>Собственность</span>
            {role.role !== 'dispatcher' && (
              <Select
                value={!FormData.possession.id ? undefined : FormData.possession.id}
                onChange={(e: number) => {
                  if (citizen.filter((el) => el.possession.id === e)[0].possession.car)
                    changeCarInfo(citizen.filter((el) => el.possession.id === e)[0].possession.car);
                  changeFormData((prev) => ({
                    ...prev,
                    possession: { ...prev.possession, id: e, address: '' },
                    complex: {
                      id: citizen.filter((el) => el.possession.id === e)[0].complex.id,
                      name: citizen.filter((el) => el.possession.id === e)[0].complex.name,
                    },
                    building: {
                      id: citizen.filter((el) => el.possession.id === e)[0].building.id,
                      address: citizen.filter((el) => el.possession.id === e)[0].building.address,
                    },
                  }));
                }}
                disabled={id !== 0 ? true : false}
                options={
                  id !== 0
                    ? [{ label: FormData.possession.address, value: FormData.possession.id }]
                    : citizen.map((el) => ({
                        value: el.possession.id,
                        label: el.possession.address,
                      }))
                }
              />
            )}
            {role.role === 'dispatcher' && (
              <>
                <Select
                  value={!FormData.possession.id ? undefined : FormData.possession.id}
                  onChange={(e: number) => {
                    if (
                      possession &&
                      possession.some((el) => el.id === e) &&
                      possession.filter((el) => el.id === e)[0].car
                    )
                      changeCarInfo(possession.filter((el) => el.id === e)[0].car);
                    changeFormData((prev) => ({
                      ...prev,
                      possession: { ...prev.possession, id: e, address: '' },
                    }));
                  }}
                  disabled={id !== 0 || FormData.building.id === 0 || error ? true : false}
                  options={
                    id !== 0
                      ? [{ label: FormData.possession.address, value: FormData.possession.id }]
                      : possession
                      ? possession.map((el) => ({
                          value: el.id,
                          label: el.address,
                        }))
                      : []
                  }
                />
                {error && <span className='errorText'>{error.error.error}</span>}
              </>
            )}
          </div>
          {carInfo && (
            <>
              <div className='w-[48%] mt-2 gap-2 flex flex-col'>
                <span>Марка автомобиля</span>
                <Input disabled={true} value={carInfo.car_brand} />
              </div>
              <div className='w-[48%] mt-2 gap-2 flex flex-col'>
                <span>Модель автомобиля</span>
                <Input disabled={true} value={!carInfo.car_model ? '' : carInfo.car_model} />
              </div>
              <div className='w-[48%] mt-2 gap-2 flex flex-col'>
                <span>Гос. номер</span>
                <Input disabled={true} value={!carInfo.state_number ? '' : carInfo.state_number} />
              </div>
            </>
          )}
        </div>
        <span className='font-bold text-lg mt-2'>Таймслот</span>
        <div className='flex flex-wrap gap-2 mt-2 justify-between'>
          <div className='flex flex-col gap-2 w-[48%]'>
            <span>Плановое время начала работ</span>
            <Input value={!FormData.creatingDate ? '' : FormData.creatingDate} disabled={true} />
          </div>
          <div className='flex flex-col gap-2 w-[48%]'>
            <span>Плановое время окончания работ</span>
            <Input value={!FormData.dueDate ? '' : FormData.dueDate} disabled={true} />
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
              showCount
              style={{ resize: 'none' }}
              disabled={['citizen', 'executor'].some((el) => el === role.role) ? true : false}
            />
          </div>
          <div className='flex flex-col gap-2 w-full mt-6'>
            <span>Комментарий исполнителя</span>
            <TextArea
              value={!FormData.employeeComment ? '' : FormData.employeeComment}
              onChange={(e) =>
                changeFormData((prev) => ({ ...prev, employeeComment: e.target.value }))
              }
              className='rounded-md h-[60px]'
              showCount
              maxLength={500}
              style={{ resize: 'none' }}
              disabled={
                ['citizen', 'dispatcher'].some((el) => el === role.role) ||
                (formInfo.length > 0 && formInfo[0].status !== 1)
                  ? true
                  : false
              }
            />
          </div>
        </div>
        <div className='bg-blue-300 p-5 mt-2 rounded-md backdrop-blur-md bg-opacity-50 flex flex-col gap-2'>
          <span className='font-bold text-lg'>Исполнители</span>
          <div className='flex flex-col gap-2 w-full'>
            <span>исполнитель</span>
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
              disabled={['citizen', 'executor'].some((el) => el === role.role) ? true : false}
              options={
                ['citizen', 'executor'].some((el) => el === role.role) && FormData.employee
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
          {id < 1 && ['citizen', 'dispatcher'].some((el) => el === role.role) && (
            <Button
              type='primary'
              onClick={() => {
                exitFromForm();
                create_application();
                citizenErrors(null);
              }}
              className='text-white bg-blue-700 '
              disabled={
                FormData.building &&
                FormData.complex &&
                FormData.possession &&
                FormData.source &&
                FormData.type &&
                FormData.citizenComment &&
                FormData.citizenComment.length < 501 &&
                ((role.role === 'dispatcher' &&
                  ((FormData.dispatcherComment && FormData.dispatcherComment.length < 501) ||
                    !FormData.dispatcherComment) &&
                  FormData.employee &&
                  FormData.status &&
                  FormData.priority &&
                  FormData.grade) ||
                  role.role === 'citizen')
                  ? false
                  : true
              }
            >
              Создать
            </Button>
          )}
          {id !== 0 && ['dispatcher', 'executor'].some((el) => el === role.role) && (
            <Button
              type='primary'
              onClick={() => {
                update_application();
                exitFromForm();
                citizenErrors(null);
              }}
              className=' text-white bg-blue-700 '
              disabled={
                FormData.status &&
                ((role.role === 'dispatcher' &&
                  ((FormData.dispatcherComment && FormData.dispatcherComment.length < 501) ||
                    !FormData.dispatcherComment) &&
                  FormData.employee &&
                  FormData.status &&
                  FormData.priority &&
                  FormData.grade &&
                  FormData.building &&
                  FormData.complex &&
                  FormData.possession &&
                  FormData.source &&
                  FormData.type &&
                  FormData.citizenComment &&
                  FormData.citizenComment.length < 501) ||
                  (role.role === 'executor' &&
                    FormData.employeeComment &&
                    FormData.employeeComment.length < 501 &&
                    formInfo.length > 0 &&
                    formInfo[0].status === 1))
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
              onClick={() => {
                changeFormData(initialApplication);
                changeIsFormActive(false);
                changeCarInfo(null);
                citizenErrors(null);
              }}
            >
              Закрыть
            </Button>
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
};
