import { FC, useEffect, useState } from 'react';
import { Table } from 'antd';
import { IoFunnel } from 'react-icons/io5';
import clsx from 'clsx';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  IApplicationNotCitizenColumns,
  IBuilding,
  IFilterAppFormActivity,
  IFilterAppOptions,
  ISortOptions,
  ITableParams,
} from '../../../../../types';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';
import { FaSort } from 'react-icons/fa';
import { FaSortUp } from 'react-icons/fa';
import { FaSortDown } from 'react-icons/fa6';
import { ImSpinner9 } from 'react-icons/im';
import Search from 'antd/es/input/Search';

interface IProps {
  showForm: (application_id: number) => void;
  notCitizenTable: ColumnsType<IApplicationNotCitizenColumns>;
  handleTableChange: (pagination: TablePaginationConfig) => void;
  tableParams: ITableParams;
  applicationFreshnessStatus: (
    creatingDate: string,
    normative_in_days: number,
  ) => 'fresh' | 'warning' | 'expired';
  sortOptions: ISortOptions;
  setSortOptions: React.Dispatch<React.SetStateAction<ISortOptions>>;
  changeIsNeedToGet: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterOptions: React.Dispatch<React.SetStateAction<IFilterAppOptions>>;
  filterOptions: IFilterAppOptions;
  getAllBuildingsByComplexId: (complex_id: string) => Promise<IBuilding[] | void>;
  getAllBuildings: () => Promise<IBuilding[] | void>;
}

export const NotCitizenTable: FC<IProps> = ({
  showForm,
  notCitizenTable,
  handleTableChange,
  tableParams,
  applicationFreshnessStatus,
  sortOptions,
  setSortOptions,
  changeIsNeedToGet,
  setFilterOptions,
  filterOptions,
  getAllBuildingsByComplexId,
  getAllBuildings,
}) => {
  const { applications, isLoading, statuses } = useTypedSelector(
    (state) => state.ApplicationReducer,
  );
  const { complexes, buildings } = useTypedSelector((state) => state.PossessionReducer);
  const [filterFormActivity, setFilterFormActivity] = useState<IFilterAppFormActivity>({
    complex: false,
    building: false,
    status: false,
    role: false,
    phone: false,
    fio: false,
    possessionName: false,
    possessionType: false,
    applicationType: false,
  });
  const [buildingsInSelect, setBuildingsInSelect] = useState<IBuilding[]>([]);
  const [isBuildingsLoading, setIsBuildingsLoading] = useState(false);

  const initBuildingsInFilter = async () => {
    setIsBuildingsLoading((prev) => !prev);
    const response = await getAllBuildings();
    setIsBuildingsLoading((prev) => !prev);
    if (!response) return;
    setBuildingsInSelect(response);
  };

  useEffect(() => {
    if (buildings.length) {
      setBuildingsInSelect(buildings);
    }
  }, [buildings]);

  const components = {
    header: {
      cell: (props: { children: React.ReactNode }) => {
        if (
          props.children &&
          Array.isArray(props.children) &&
          props.children[1] === 'Дата создания'
        ) {
          return (
            <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
              <div className='flex items-center gap-x-2 justify-center'>
                <span>{props.children}</span>
                <button
                  className='outline-none border-none'
                  onClick={() => {
                    if (sortOptions.creating_date_dec && !sortOptions.creating_date_inc) {
                      setSortOptions((prev) => ({
                        ...prev,
                        creating_date_dec: false,
                        creating_date_inc: true,
                      }));
                    }
                    if (!sortOptions.creating_date_dec && !sortOptions.creating_date_inc) {
                      setSortOptions((prev) => ({
                        ...prev,
                        creating_date_dec: true,
                        creating_date_inc: false,
                      }));
                    }
                    if (!sortOptions.creating_date_dec && sortOptions.creating_date_inc) {
                      setSortOptions((prev) => ({
                        ...prev,
                        creating_date_dec: false,
                        creating_date_inc: false,
                      }));
                    }
                    changeIsNeedToGet(true);
                  }}
                >
                  {sortOptions.creating_date_dec && <FaSortDown className='text-lg text-white' />}
                  {sortOptions.creating_date_inc && <FaSortUp className='text-lg text-white' />}
                  {!sortOptions.creating_date_dec && !sortOptions.creating_date_inc && (
                    <FaSort className='text-lg text-white' />
                  )}
                </button>
              </div>
            </th>
          );
        }
        if (props.children && Array.isArray(props.children) && props.children[1] === 'Статус') {
          return (
            <th
              style={{ background: '#000', color: '#fff', textAlign: 'center' }}
              className='relative'
            >
              <div
                className={clsx(
                  'absolute inset-x-0 top-[3.2rem] right-0 z-10 flex flex-col overflow-hidden',
                  filterFormActivity.status && 'max-h-[255px]',
                  !filterFormActivity.status && 'h-0',
                )}
              >
                {statuses
                  .filter((el) => el.name !== 'Закрыта')
                  .map((el) => (
                    <button
                      className={clsx(
                        'transitionFast border-none p-2 hover:bg-opacity-80',
                        filterOptions.statusId === el.id
                          ? 'text-black bg-white'
                          : 'bg-black text-white',
                      )}
                      onClick={() => {
                        setFilterOptions((prev) => ({ ...prev, statusId: el.id }));
                        setFilterFormActivity((prev) => ({ ...prev, status: false }));
                        changeIsNeedToGet(true);
                      }}
                    >
                      {el.name}
                    </button>
                  ))}
                {
                  <button
                    className={clsx(
                      'transitionFast border-none p-2 hover:bg-opacity-80',
                      filterOptions.statusId === null
                        ? 'text-black bg-white'
                        : 'bg-black text-white',
                    )}
                    onClick={() => {
                      setFilterOptions((prev) => ({ ...prev, statusId: null }));
                      setFilterFormActivity((prev) => ({ ...prev, status: false }));
                      changeIsNeedToGet(true);
                    }}
                  >
                    Все
                  </button>
                }
              </div>
              <div className='flex items-center gap-x-2 justify-center'>
                <span>{props.children}</span>
                <button
                  className='outline-none border-none'
                  onClick={() => {
                    if (sortOptions.status_dec && !sortOptions.status_inc) {
                      setSortOptions((prev) => ({ ...prev, status_dec: false, status_inc: true }));
                    }
                    if (!sortOptions.status_dec && !sortOptions.status_inc) {
                      setSortOptions((prev) => ({ ...prev, status_dec: true, status_inc: false }));
                    }
                    if (!sortOptions.status_dec && sortOptions.status_inc) {
                      setSortOptions((prev) => ({ ...prev, status_dec: false, status_inc: false }));
                    }
                    changeIsNeedToGet(true);
                  }}
                >
                  {sortOptions.status_dec && <FaSortDown className='text-lg text-white' />}
                  {sortOptions.status_inc && <FaSortUp className='text-lg text-white' />}
                  {!sortOptions.status_dec && !sortOptions.status_inc && (
                    <FaSort className='text-lg text-white' />
                  )}
                </button>
                <button
                  onClick={() =>
                    setFilterFormActivity((prev) => ({ ...prev, status: !prev.status }))
                  }
                >
                  <IoFunnel
                    className={clsx(
                      'text-lg',
                      filterOptions.statusId ? 'text-blue-700' : 'text-white',
                    )}
                  />
                </button>
              </div>
            </th>
          );
        }
        if (
          props.children &&
          Array.isArray(props.children) &&
          props.children[1] === 'Жилищный комплекс'
        ) {
          return (
            <th
              style={{ background: '#000', color: '#fff', textAlign: 'center' }}
              className='relative'
            >
              <div
                className={clsx(
                  'absolute inset-x-0 top-[3.2rem] right-0 z-10 flex flex-col overflow-y-scroll overflow-x-hidden filterForm',
                  filterFormActivity.complex && 'max-h-[160px]',
                  !filterFormActivity.complex && 'h-0',
                )}
              >
                {complexes.map((el) => (
                  <button
                    className={clsx(
                      'transitionFast border-none p-2 hover:bg-opacity-80',
                      filterOptions.complexId === el.id
                        ? 'bg-white text-black'
                        : 'bg-black text-white',
                    )}
                    onClick={() => {
                      setFilterOptions((prev) => ({ ...prev, complexId: el.id, buildingId: null }));
                      getAllBuildingsByComplexId(el.id.toString());
                      setFilterFormActivity((prev) => ({
                        ...prev,
                        complex: false,
                        building: false,
                      }));
                      changeIsNeedToGet(true);
                    }}
                  >
                    {el.name}
                  </button>
                ))}
                {
                  <button
                    className={clsx(
                      'transitionFast border-none p-2 hover:bg-opacity-80',
                      filterOptions.complexId === null
                        ? 'text-black bg-white'
                        : 'bg-black text-white',
                    )}
                    onClick={() => {
                      setFilterOptions((prev) => ({ ...prev, complexId: null }));
                      setFilterFormActivity((prev) => ({ ...prev, complex: false }));
                      setBuildingsInSelect([]);
                      initBuildingsInFilter();
                      changeIsNeedToGet(true);
                    }}
                  >
                    Все
                  </button>
                }
              </div>
              <div className='flex items-center gap-x-2 justify-center'>
                <span>{props.children}</span>
                <button
                  onClick={() =>
                    setFilterFormActivity((prev) => ({ ...prev, complex: !prev.complex }))
                  }
                >
                  <IoFunnel
                    className={clsx(
                      'text-lg',
                      filterOptions.complexId ? 'text-blue-700' : 'text-white',
                    )}
                  />
                </button>
              </div>
            </th>
          );
        }
        if (
          props.children &&
          Array.isArray(props.children) &&
          props.children[1] === 'Адрес здания'
        ) {
          return (
            <th
              style={{ background: '#000', color: '#fff', textAlign: 'center' }}
              className='relative'
            >
              <div
                className={clsx(
                  'absolute inset-x-0 top-[3.4rem] right-0 z-10 flex flex-col overflow-auto filterForm',
                  filterFormActivity.building && 'max-h-[200px]',
                  !filterFormActivity.building && 'h-0',
                )}
              >
                {isBuildingsLoading && (
                  <div className='w-full flex justify-center gap-x-2 p-2 bg-black text-white'>
                    <span>Загрузка...</span>
                    <ImSpinner9 className='animate-spin' />
                  </div>
                )}
                {!isBuildingsLoading &&
                  buildingsInSelect.map((el) => (
                    <button
                      className={clsx(
                        'transitionFast border-none p-2 hover:bg-opacity-80',
                        filterOptions.buildingId === el.id
                          ? 'bg-gray-200 text-black'
                          : 'bg-black text-white',
                      )}
                      onClick={() => {
                        setFilterOptions((prev) => ({ ...prev, buildingId: el.id }));
                        setFilterFormActivity((prev) => ({ ...prev, building: false }));
                        changeIsNeedToGet(true);
                      }}
                    >
                      {el.address}
                    </button>
                  ))}
                {!isBuildingsLoading && (
                  <button
                    className={clsx(
                      'transitionFast border-none p-2 hover:bg-opacity-80',
                      !filterOptions.buildingId ? 'bg-white text-black' : 'bg-black text-white',
                    )}
                    onClick={() => {
                      setFilterOptions((prev) => ({ ...prev, buildingId: null }));
                      setFilterFormActivity((prev) => ({ ...prev, building: false }));
                      changeIsNeedToGet(true);
                    }}
                  >
                    Все
                  </button>
                )}
              </div>
              <div className='flex items-center gap-x-2 justify-center'>
                <span>{props.children}</span>
                <button
                  onClick={() => {
                    setFilterFormActivity((prev) => ({ ...prev, building: !prev.building }));
                    if (!buildings.length) initBuildingsInFilter();
                  }}
                >
                  <IoFunnel
                    className={clsx(
                      'text-lg',
                      filterOptions.buildingId ? 'text-blue-700' : 'text-white',
                    )}
                  />
                </button>
              </div>
            </th>
          );
        }
        if (
          props.children &&
          Array.isArray(props.children) &&
          props.children[1] === 'Заявку создал'
        ) {
          return (
            <th
              style={{ background: '#000', color: '#fff', textAlign: 'center' }}
              className='relative'
            >
              <div
                className={clsx(
                  'absolute inset-x-0 top-[3.4rem] right-0 z-10 flex flex-col overflow-auto filterForm',
                  filterFormActivity.role && 'max-h-[200px]',
                  !filterFormActivity.role && 'h-0',
                )}
              >
                <button
                  className={clsx(
                    'transitionFast border-none p-2 hover:bg-opacity-80',
                    filterOptions.role === 'dispatcher'
                      ? 'bg-gray-200 text-black'
                      : 'bg-black text-white',
                  )}
                  onClick={() => {
                    setFilterOptions((prev) => ({ ...prev, role: 'dispatcher' }));
                    setFilterFormActivity((prev) => ({ ...prev, role: false }));
                    changeIsNeedToGet(true);
                  }}
                >
                  Диспетчер
                </button>
                <button
                  className={clsx(
                    'transitionFast border-none p-2 hover:bg-opacity-80',
                    filterOptions.role === 'citizen'
                      ? 'bg-gray-200 text-black'
                      : 'bg-black text-white',
                  )}
                  onClick={() => {
                    setFilterOptions((prev) => ({ ...prev, role: 'citizen' }));
                    setFilterFormActivity((prev) => ({ ...prev, role: false }));
                    changeIsNeedToGet(true);
                  }}
                >
                  Житель
                </button>
                <button
                  className={clsx(
                    'transitionFast border-none p-2 hover:bg-opacity-80',
                    filterOptions.role === null ? 'bg-gray-200 text-black' : 'bg-black text-white',
                  )}
                  onClick={() => {
                    setFilterOptions((prev) => ({ ...prev, role: null }));
                    setFilterFormActivity((prev) => ({ ...prev, role: false }));
                    changeIsNeedToGet(true);
                  }}
                >
                  Все
                </button>
              </div>
              <div className='flex items-center gap-x-2 justify-center'>
                <span>{props.children}</span>
                <button
                  onClick={() => {
                    setFilterFormActivity((prev) => ({ ...prev, role: !prev.role }));
                  }}
                >
                  <IoFunnel
                    className={clsx('text-lg', filterOptions.role ? 'text-blue-700' : 'text-white')}
                  />
                </button>
              </div>
            </th>
          );
        }
        if (
          props.children &&
          Array.isArray(props.children) &&
          props.children[1] === 'ФИО заявителя'
        ) {
          return (
            <th
              style={{ background: '#000', color: '#fff', textAlign: 'center' }}
              className='relative'
            >
              <div
                className={clsx(
                  'absolute inset-x-0 top-[3.4rem] right-0 z-10 flex flex-col overflow-y-auto overflow-hidden filterForm bg-gray-200',
                  filterFormActivity.fio && 'max-h-[200px]',
                  !filterFormActivity.fio && 'h-0',
                )}
              >
                <Search
                  placeholder='Укажите фио заявителя'
                  allowClear
                  value={!filterOptions.fio ? undefined : filterOptions.fio}
                  onSearch={(e) => {
                    setFilterOptions((prev) => ({
                      ...prev,
                      fio: e.replaceAll(/\s\s/g, '').replaceAll(/[^а-яА-Я\s]/g, ''),
                    }));
                    setFilterFormActivity((prev) => ({ ...prev, fio: !prev.fio }));
                    changeIsNeedToGet(true);
                  }}
                  className='w-full'
                />
              </div>
              <div className='flex items-center gap-x-2 justify-center'>
                <span>{props.children}</span>
                <button
                  onClick={() => {
                    setFilterFormActivity((prev) => ({ ...prev, fio: !prev.fio }));
                  }}
                >
                  <IoFunnel
                    className={clsx('text-lg', filterOptions.fio ? 'text-blue-700' : 'text-white')}
                  />
                </button>
              </div>
            </th>
          );
        }
        if (
          props.children &&
          Array.isArray(props.children) &&
          props.children[1] === 'Контактный телефон'
        ) {
          return (
            <th
              style={{ background: '#000', color: '#fff', textAlign: 'center' }}
              className='relative'
            >
              <div
                className={clsx(
                  'absolute inset-x-0 top-[3.4rem] right-0 z-10 flex flex-col overflow-hidden filterForm bg-gray-200',
                  filterFormActivity.phone && 'max-h-[200px]',
                  !filterFormActivity.phone && 'h-0',
                )}
              >
                <Search
                  placeholder='Укажите контактный телефон'
                  allowClear
                  value={!filterOptions.phone ? undefined : filterOptions.phone}
                  onSearch={(e) => {
                    setFilterOptions((prev) => ({ ...prev, phone: e.replaceAll(/[^0-9]/g, '') }));
                    setFilterFormActivity((prev) => ({ ...prev, phone: !prev.phone }));
                    changeIsNeedToGet(true);
                  }}
                  className='w-full'
                />
              </div>
              <div className='flex items-center gap-x-2 justify-center'>
                <span>{props.children}</span>
                <button
                  onClick={() => {
                    setFilterFormActivity((prev) => ({ ...prev, phone: !prev.phone }));
                  }}
                >
                  <IoFunnel
                    className={clsx(
                      'text-lg',
                      filterOptions.phone ? 'text-blue-700' : 'text-white',
                    )}
                  />
                </button>
              </div>
            </th>
          );
        }
        if (
          props.children &&
          Array.isArray(props.children) &&
          props.children[1] === 'Тип собственности'
        ) {
          return (
            <th
              style={{ background: '#000', color: '#fff', textAlign: 'center' }}
              className='relative'
            >
              <div
                className={clsx(
                  'absolute inset-x-0 top-[3.4rem] right-0 z-10 flex flex-col overflow-y-auto overflow-x-hidden filterForm bg-gray-200',
                  filterFormActivity.possessionType && 'max-h-[200px]',
                  !filterFormActivity.possessionType && 'h-0',
                )}
              >
                <button
                  className={clsx(
                    'transitionFast border-none p-2 hover:bg-opacity-80',
                    filterOptions.possessionType === 1
                      ? 'bg-gray-200 text-black'
                      : 'bg-black text-white',
                  )}
                  onClick={() => {
                    setFilterOptions((prev) => ({ ...prev, possessionType: 1 }));
                    setFilterFormActivity((prev) => ({ ...prev, possessionType: false }));
                    changeIsNeedToGet(true);
                  }}
                >
                  Квартира
                </button>
                <button
                  className={clsx(
                    'transitionFast border-none p-2 hover:bg-opacity-80',
                    filterOptions.possessionType === 2
                      ? 'bg-gray-200 text-black'
                      : 'bg-black text-white',
                  )}
                  onClick={() => {
                    setFilterOptions((prev) => ({ ...prev, possessionType: 2 }));
                    setFilterFormActivity((prev) => ({ ...prev, possessionType: false }));
                    changeIsNeedToGet(true);
                  }}
                >
                  Коммерческое помещение
                </button>
                <button
                  className={clsx(
                    'transitionFast border-none p-2 hover:bg-opacity-80',
                    filterOptions.possessionType === 3
                      ? 'bg-gray-200 text-black'
                      : 'bg-black text-white',
                  )}
                  onClick={() => {
                    setFilterOptions((prev) => ({ ...prev, possessionType: 3 }));
                    setFilterFormActivity((prev) => ({ ...prev, possessionType: false }));
                    changeIsNeedToGet(true);
                  }}
                >
                  Парковка
                </button>
                <button
                  className={clsx(
                    'transitionFast border-none p-2 hover:bg-opacity-80',
                    filterOptions.possessionType === 4
                      ? 'bg-gray-200 text-black'
                      : 'bg-black text-white',
                  )}
                  onClick={() => {
                    setFilterOptions((prev) => ({ ...prev, possessionType: 4 }));
                    setFilterFormActivity((prev) => ({ ...prev, possessionType: false }));
                    changeIsNeedToGet(true);
                  }}
                >
                  Кладовка
                </button>
                <button
                  className={clsx(
                    'transitionFast border-none p-2 hover:bg-opacity-80',
                    filterOptions.possessionType === 5
                      ? 'bg-gray-200 text-black'
                      : 'bg-black text-white',
                  )}
                  onClick={() => {
                    setFilterOptions((prev) => ({ ...prev, possessionType: 5 }));
                    setFilterFormActivity((prev) => ({ ...prev, possessionType: false }));
                    changeIsNeedToGet(true);
                  }}
                >
                  Жилищный комплекс
                </button>
                <button
                  className={clsx(
                    'transitionFast border-none p-2 hover:bg-opacity-80',
                    filterOptions.possessionType === null
                      ? 'bg-gray-200 text-black'
                      : 'bg-black text-white',
                  )}
                  onClick={() => {
                    setFilterOptions((prev) => ({ ...prev, possessionType: null }));
                    setFilterFormActivity((prev) => ({ ...prev, possessionType: false }));
                    changeIsNeedToGet(true);
                  }}
                >
                  Все
                </button>
              </div>
              <div className='flex items-center gap-x-2 justify-center'>
                <span>{props.children}</span>
                <button
                  onClick={() => {
                    setFilterFormActivity((prev) => ({
                      ...prev,
                      possessionType: !prev.possessionType,
                    }));
                  }}
                >
                  <IoFunnel
                    className={clsx(
                      'text-lg',
                      filterOptions.possessionType ? 'text-blue-700' : 'text-white',
                    )}
                  />
                </button>
              </div>
            </th>
          );
        }
        if (
          props.children &&
          Array.isArray(props.children) &&
          props.children[1] === 'Наименование собственности'
        ) {
          return (
            <th
              style={{ background: '#000', color: '#fff', textAlign: 'center' }}
              className='relative'
            >
              <div
                className={clsx(
                  'absolute inset-x-0 top-[3.4rem] right-0 z-10 flex flex-col overflow-hidden filterForm bg-gray-200',
                  filterFormActivity.possessionName && 'max-h-[200px]',
                  !filterFormActivity.possessionName && 'h-0',
                )}
              >
                <Search
                  placeholder='Укажите название собственности'
                  allowClear
                  value={!filterOptions.possessionName ? undefined : filterOptions.possessionName}
                  onSearch={(e) => {
                    setFilterOptions((prev) => ({
                      ...prev,
                      possessionName: e.replaceAll(/\s\s/g, '').replaceAll(/[^а-яА-Я\s0-9]/g, ''),
                    }));
                    setFilterFormActivity((prev) => ({
                      ...prev,
                      possessionName: !prev.possessionName,
                    }));
                    changeIsNeedToGet(true);
                  }}
                  className='w-full'
                />
              </div>
              <div className='flex items-center gap-x-2 justify-center'>
                <span>{props.children}</span>
                <button
                  onClick={() => {
                    setFilterFormActivity((prev) => ({
                      ...prev,
                      possessionName: !prev.possessionName,
                    }));
                  }}
                >
                  <IoFunnel
                    className={clsx(
                      'text-lg',
                      filterOptions.possessionName ? 'text-blue-700' : 'text-white',
                    )}
                  />
                </button>
              </div>
            </th>
          );
        }
        return (
          <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
            {props.children}
          </th>
        );
      },
    },
  };

  return (
    <Table
      dataSource={applications.map((el) => ({
        key: el.id,
        createdDate: el.created_date,
        appType: el.type.name,
        appSubtype: el.subtype.name,
        status: el.status.name,
        dueDate: !el.due_date ? '—' : el.due_date,
        applicantComment: el.applicant_comment,
        possessionType: el.possession.type,
        possessionNumber: el.possession.name,
        building: el.building.address,
        complex: el.complex.name,
        contact: el.contact,
        employee: !el.employee ? '—' : el.employee.employee,
        creator: el.applicant.role === 'dispatcher' ? 'Диспетчер' : 'Житель',
        fio: el.applicant_fio,
        phone: el.contact,
        normative: !el.normative ? 0 : el.normative,
      }))}
      columns={notCitizenTable}
      components={components}
      bordered
      pagination={tableParams.pagination}
      onChange={handleTableChange}
      loading={isLoading === 'applications' ? true : false}
      locale={{
        emptyText: <span className='font-bold text-lg'>Нет данных</span>,
      }}
      rowClassName={(item) => {
        if (
          applicationFreshnessStatus(item.createdDate, item.normative) === 'expired' &&
          item.status !== 'Закрыта'
        ) {
          return 'table-row bg-red-400 bg-opacity-80';
        }
        if (
          applicationFreshnessStatus(item.createdDate, item.normative) === 'warning' &&
          item.status !== 'Закрыта'
        ) {
          return 'table-row bg-amber-400 bg-opacity-80';
        }
        return 'table-row bg-blue-700 bg-opacity-20';
      }}
      onRow={(record) => ({
        onClick: () => {
          showForm(record.key);
        },
      })}
      style={{
        width: 'fit-content',
      }}
    />
  );
};
