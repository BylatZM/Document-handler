import { FC, useState } from 'react';
import { Table } from 'antd';
import { IoFunnel } from 'react-icons/io5';
import clsx from 'clsx';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  IComplex,
  IFilterGisAppFormActivity,
  IFilterGisAppOptions,
  IGisTableColumns,
  ISortOptions,
  IStatus,
  ITableParams,
} from '../../../../types';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import Search from 'antd/es/input/Search';

interface IProps {
  showForm: (application_id: number) => void;
  gisTable: ColumnsType<IGisTableColumns>;
  handleTableChange: (pagination: TablePaginationConfig) => void;
  tableParams: ITableParams;
  filterOptions: IFilterGisAppOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<IFilterGisAppOptions>>;
  sortOptions: ISortOptions;
  setSortOptions: React.Dispatch<React.SetStateAction<ISortOptions>>;
  changeIsNeedToGet: React.Dispatch<React.SetStateAction<boolean>>;
  complexes: IComplex[];
  statuses: IStatus[];
  applicationFreshnessStatus: (
    creatingDate: string,
    normative_in_hours: number,
  ) => 'fresh' | 'warning' | 'expired';
}

export const GisTable: FC<IProps> = ({
  showForm,
  gisTable,
  handleTableChange,
  tableParams,
  filterOptions,
  setFilterOptions,
  sortOptions,
  setSortOptions,
  changeIsNeedToGet,
  complexes,
  statuses,
  applicationFreshnessStatus,
}) => {
  const { gisApplications } = useTypedSelector((state) => state.ApplicationReducer);
  const { isLoading } = useTypedSelector((state) => state.ApplicationReducer);
  const [filterFormActivity, setFilterFormActivity] = useState<IFilterGisAppFormActivity>({
    complex: false,
    building: false,
    status: false,
    email: false,
    phone: false,
    fio: false,
    possessionName: false,
    applicationType: false,
  });

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
                  filterFormActivity.status && 'max-h-[200px]',
                  !filterFormActivity.status && 'h-0',
                )}
              >
                {statuses
                  .filter((el) => el.name !== 'Закрыта')
                  .map((el) => (
                    <button
                      className='transitionFast bg-black border-none text-white p-2 hover:bg-opacity-80'
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
                      setFilterOptions((prev) => ({ ...prev, complexId: el.id }));
                      setFilterFormActivity((prev) => ({
                        ...prev,
                        complex: false,
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
                <Search
                  placeholder='Укажите адрес здания'
                  allowClear
                  value={!filterOptions.buildingAddress ? undefined : filterOptions.buildingAddress}
                  onSearch={(e) => {
                    setFilterOptions((prev) => ({
                      ...prev,
                      buildingAddress: e,
                    }));
                    setFilterFormActivity((prev) => ({
                      ...prev,
                      building: !prev.building,
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
                    setFilterFormActivity((prev) => ({ ...prev, building: !prev.building }));
                  }}
                >
                  <IoFunnel
                    className={clsx(
                      'text-lg',
                      filterOptions.buildingAddress ? 'text-blue-700' : 'text-white',
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
          props.children[1] === 'Электронная почта'
        ) {
          return (
            <th
              style={{ background: '#000', color: '#fff', textAlign: 'center' }}
              className='relative'
            >
              <div
                className={clsx(
                  'absolute inset-x-0 top-[3.4rem] right-0 z-10 flex flex-col overflow-auto filterForm bg-gray-200',
                  filterFormActivity.email && 'max-h-[200px]',
                  !filterFormActivity.email && 'h-0',
                )}
              >
                <Search
                  placeholder='Укажите электронную почту'
                  allowClear
                  value={!filterOptions.email ? undefined : filterOptions.email}
                  onSearch={(e) => {
                    setFilterOptions((prev) => ({
                      ...prev,
                      email: e,
                    }));
                    setFilterFormActivity((prev) => ({
                      ...prev,
                      email: !prev.email,
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
                    setFilterFormActivity((prev) => ({ ...prev, email: !prev.email }));
                  }}
                >
                  <IoFunnel
                    className={clsx(
                      'text-lg',
                      filterOptions.email ? 'text-blue-700' : 'text-white',
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
                  placeholder='Укажите телефон'
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
      dataSource={gisApplications.map((el) => ({
        key: el.id,
        createdDate: el.created_date,
        status: el.status.name,
        type: el.type ? el.type.name : '—',
        subtype: el.subtype ? el.subtype.name : '—',
        dueDate: !el.due_date ? '—' : el.due_date,
        applicantComment: el.applicant_comment,
        complex: el.complex ? el.complex.name : '—',
        building: el.building_address,
        possession: !el.possession ? '—' : el.possession,
        phone: !el.phone ? '—' : el.phone,
        email: !el.email ? '—' : el.email,
        fio: el.applicant_fio,
        employee: el.employee ? el.employee.employee : '—',
        normative: el.normative ? el.normative : 120,
      }))}
      columns={gisTable}
      components={components}
      bordered
      pagination={tableParams.pagination}
      onChange={handleTableChange}
      loading={isLoading === 'gisApplications' ? true : false}
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
