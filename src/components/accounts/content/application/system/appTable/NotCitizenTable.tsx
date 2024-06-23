import { FC, useEffect, useState } from 'react';
import { Dropdown, Table } from 'antd';
import { IoFunnel } from 'react-icons/io5';
import clsx from 'clsx';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  IApplicationNotCitizenColumns,
  IFilterAppOptions,
  ISortOptions,
  ITableParams,
} from '../../../../../types';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';
import { FaSort } from 'react-icons/fa';
import { FaSortUp } from 'react-icons/fa';
import { FaSortDown } from 'react-icons/fa6';
import { BuildingTableComponent } from '../notCitizenTableComponents/BuildingTableComponent';
import { ApplicantFioTableComponent } from '../notCitizenTableComponents/ApplicantFioTableComponent';
import { ApplicantPhoneTableComponent } from '../notCitizenTableComponents/ApplicantPhoneTableComponent';
import { PossessionNameTableComponent } from '../notCitizenTableComponents/PossessionNameTableComponent';
import { TypeTableComponent } from '../notCitizenTableComponents/TypeTableComponent';
import { SubtypeTableComponent } from '../notCitizenTableComponents/SubtypeTableComponent';

interface IProps {
  showForm: (application_id: number) => void;
  notCitizenTable: ColumnsType<IApplicationNotCitizenColumns>;
  tableParams: ITableParams;
  setTableParams: React.Dispatch<React.SetStateAction<ITableParams>>;
  applicationFreshnessStatus: (
    creatingDate: string,
    normative_in_days: number,
  ) => 'fresh' | 'warning' | 'expired';
  getApplications: (filterOptions?: IFilterAppOptions, sortOptions?: ISortOptions) => Promise<void>;
  changeIsNeedToGet: React.Dispatch<React.SetStateAction<boolean>>;
  isNeedToGet: boolean;
}

interface IWhoCreated {
  id: number;
  name: 'dispatcher' | 'citizen';
  label: 'Диспетчер' | 'Житель';
}

const whoCreated: IWhoCreated[] = [
  {
    id: 1,
    name: 'dispatcher',
    label: 'Диспетчер',
  },
  {
    id: 2,
    name: 'citizen',
    label: 'Житель',
  },
];

export const NotCitizenTable: FC<IProps> = ({
  showForm,
  notCitizenTable,
  tableParams,
  setTableParams,
  applicationFreshnessStatus,
  getApplications,
  changeIsNeedToGet,
  isNeedToGet,
}) => {
  const { applications, isLoading, statuses } = useTypedSelector(
    (state) => state.ApplicationReducer,
  );
  const { complexes, possessionTypes } = useTypedSelector((state) => state.PossessionReducer);
  const [sortOptions, setSortOptions] = useState<ISortOptions>({
    status_inc: false,
    status_dec: true,
    creating_date_inc: false,
    creating_date_dec: true,
  });
  const [filterOptions, setFilterOptions] = useState<IFilterAppOptions>({
    complexId: null,
    buildingId: null,
    statusId: null,
    role: null,
    phone: null,
    fio: null,
    possessionName: null,
    possessionType: null,
    typeId: null,
    subtypeName: null,
  });

  const mainProcesses = async () => {
    getApplications(filterOptions, sortOptions);
    changeIsNeedToGet((prev) => !prev);
  };

  useEffect(() => {
    if (isNeedToGet) {
      mainProcesses();
    }
  }, [isNeedToGet]);

  useEffect(() => {
    let sortParams = localStorage.getItem('application_sort_options');
    let parsedSortObject: ISortOptions = sortOptions;
    if (sortParams) {
      try {
        parsedSortObject = JSON.parse(sortParams);
        setSortOptions(parsedSortObject);
      } catch (e) {
        localStorage.setItem('application_sort_options', JSON.stringify(sortOptions));
      }
    } else localStorage.setItem('application_sort_options', JSON.stringify(sortOptions));

    let filterParams = localStorage.getItem('application_filter_options');
    let parsedFilterObject: IFilterAppOptions | null = null;
    if (filterParams) {
      try {
        parsedFilterObject = JSON.parse(filterParams);
        if (parsedFilterObject) setFilterOptions(parsedFilterObject);
      } catch (e) {
        localStorage.setItem('application_filter_options', JSON.stringify(filterOptions));
      }
    } else localStorage.setItem('application_filter_options', JSON.stringify(filterOptions));
    changeIsNeedToGet(true);
  }, []);

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
            <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
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
                <Dropdown
                  trigger={['click']}
                  arrow
                  placement='bottom'
                  align={{ offset: [0, 16] }}
                  overlayClassName='bg-black border-white p-2 border-[1px] bg-opacity-70 max-sm:text-sm'
                  dropdownRender={() => (
                    <div className='flex flex-col'>
                      {statuses.map((el) => (
                        <button
                          key={el.id}
                          className={clsx(
                            'transitionFast border-none p-2',
                            filterOptions.statusId === el.id
                              ? 'text-black bg-white'
                              : 'text-white hover:bg-black',
                          )}
                          onClick={() => {
                            setFilterOptions((prev) => ({ ...prev, statusId: el.id }));
                            changeIsNeedToGet(true);
                          }}
                        >
                          {el.name}
                        </button>
                      ))}
                      <button
                        className={clsx(
                          'transitionFast border-none p-2',
                          filterOptions.statusId === null
                            ? 'text-black bg-white'
                            : 'text-white hover:bg-black',
                        )}
                        onClick={() => {
                          setFilterOptions((prev) => ({ ...prev, statusId: null }));
                          changeIsNeedToGet(true);
                        }}
                      >
                        Все
                      </button>
                    </div>
                  )}
                >
                  <IoFunnel
                    className={clsx(
                      'text-lg cursor-pointer',
                      filterOptions.statusId ? 'text-blue-700' : 'text-white',
                    )}
                  />
                </Dropdown>
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
              <div className='flex items-center gap-x-2 justify-center'>
                <span>{props.children}</span>
                <Dropdown
                  trigger={['click']}
                  arrow
                  placement='bottom'
                  align={{ offset: [0, 18] }}
                  overlayClassName='bg-black overflow-y-auto max-h-[150px] border-white border-[1px] bg-opacity-70 max-sm:text-sm'
                  dropdownRender={() => (
                    <div className='flex flex-col'>
                      {complexes.map((el) => (
                        <button
                          key={el.id}
                          className={clsx(
                            'transitionFast border-none p-2',
                            filterOptions.complexId === el.id
                              ? 'bg-white text-black'
                              : 'hover:bg-black text-white',
                          )}
                          onClick={() => {
                            setFilterOptions((prev) => ({
                              ...prev,
                              complexId: el.id,
                              buildingId: null,
                              typeId: null,
                              subtypeName: null,
                            }));
                            changeIsNeedToGet(true);
                          }}
                        >
                          {el.name}
                        </button>
                      ))}
                      <button
                        className={clsx(
                          'transitionFast border-none p-2',
                          filterOptions.complexId === null
                            ? 'text-black bg-white'
                            : 'hover:bg-black text-white',
                        )}
                        onClick={() => {
                          setFilterOptions((prev) => ({ ...prev, complexId: null }));
                          changeIsNeedToGet(true);
                        }}
                      >
                        Все
                      </button>
                    </div>
                  )}
                >
                  <IoFunnel
                    className={clsx(
                      'text-lg cursor-pointer',
                      filterOptions.complexId ? 'text-blue-700' : 'text-white',
                    )}
                  />
                </Dropdown>
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
            <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
              <BuildingTableComponent
                name={props.children}
                complexId={filterOptions.complexId}
                buildingId={filterOptions.buildingId}
                setFilterOptions={setFilterOptions}
                changeIsNeedToGet={changeIsNeedToGet}
              />
            </th>
          );
        }
        if (props.children && Array.isArray(props.children) && props.children[1] === 'Тип заявки') {
          return (
            <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
              <TypeTableComponent
                name={props.children}
                complexId={filterOptions.complexId}
                typeId={filterOptions.typeId}
                setFilterOptions={setFilterOptions}
                changeIsNeedToGet={changeIsNeedToGet}
              />
            </th>
          );
        }
        if (
          props.children &&
          Array.isArray(props.children) &&
          props.children[1] === 'Подтип заявки'
        ) {
          return (
            <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
              <SubtypeTableComponent
                name={props.children}
                complexId={filterOptions.complexId}
                typeId={filterOptions.typeId}
                subtypeName={filterOptions.subtypeName}
                setFilterOptions={setFilterOptions}
                changeIsNeedToGet={changeIsNeedToGet}
              />
            </th>
          );
        }
        if (
          props.children &&
          Array.isArray(props.children) &&
          props.children[1] === 'Заявку создал'
        ) {
          return (
            <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
              <div className='flex items-center gap-x-2 justify-center'>
                <span>{props.children}</span>
                <Dropdown
                  trigger={['click']}
                  arrow
                  placement='bottom'
                  align={{ offset: [0, 18] }}
                  overlayClassName='bg-black max-w-[200px] p-2 border-white border-[1px] bg-opacity-70 max-sm:text-sm'
                  dropdownRender={() => (
                    <div className='flex flex-col'>
                      {whoCreated.map((el) => (
                        <button
                          key={el.id}
                          className={clsx(
                            'transitionFast border-none p-2',
                            filterOptions.role === el.name
                              ? 'bg-gray-200 text-black'
                              : 'hover:bg-black text-white',
                          )}
                          onClick={() => {
                            setFilterOptions((prev) => ({ ...prev, role: el.name }));
                            changeIsNeedToGet(true);
                          }}
                        >
                          {el.label}
                        </button>
                      ))}
                      <button
                        className={clsx(
                          'transitionFast border-none p-2',
                          filterOptions.role === null
                            ? 'bg-gray-200 text-black'
                            : 'hover:bg-black text-white',
                        )}
                        onClick={() => {
                          setFilterOptions((prev) => ({ ...prev, role: null }));
                          changeIsNeedToGet(true);
                        }}
                      >
                        Все
                      </button>
                    </div>
                  )}
                >
                  <IoFunnel
                    className={clsx(
                      'text-lg cursor-pointer',
                      filterOptions.role ? 'text-blue-700' : 'text-white',
                    )}
                  />
                </Dropdown>
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
            <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
              <ApplicantFioTableComponent
                name={props.children}
                defaultItemValue={filterOptions.fio}
                setFilterOptions={setFilterOptions}
                changeIsNeedToGet={changeIsNeedToGet}
              />
            </th>
          );
        }
        if (
          props.children &&
          Array.isArray(props.children) &&
          props.children[1] === 'Контактный телефон'
        ) {
          return (
            <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
              <ApplicantPhoneTableComponent
                name={props.children}
                defaultItemValue={filterOptions.phone}
                setFilterOptions={setFilterOptions}
                changeIsNeedToGet={changeIsNeedToGet}
              />
            </th>
          );
        }
        if (
          props.children &&
          Array.isArray(props.children) &&
          props.children[1] === 'Тип собственности'
        ) {
          return (
            <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
              <div className='flex items-center gap-x-2 justify-center'>
                <span>{props.children}</span>
                <Dropdown
                  trigger={['click']}
                  arrow
                  placement='bottom'
                  align={{ offset: [0, 18] }}
                  overlayClassName='bg-black max-w-[200px] border-white border-[1px] bg-opacity-70 max-sm:text-sm'
                  dropdownRender={() => (
                    <div className='flex flex-col'>
                      {possessionTypes.map((el) => (
                        <button
                          key={el.id}
                          className={clsx(
                            'transitionFast border-none p-2',
                            filterOptions.possessionType === el.id
                              ? 'bg-gray-200 text-black'
                              : 'hover:bg-black text-white',
                          )}
                          onClick={() => {
                            setFilterOptions((prev) => ({ ...prev, possessionType: el.id }));
                            changeIsNeedToGet(true);
                          }}
                        >
                          {el.name}
                        </button>
                      ))}
                      <button
                        className={clsx(
                          'transitionFast border-none p-2',
                          filterOptions.possessionType === null
                            ? 'bg-gray-200 text-black'
                            : 'hover:bg-black text-white',
                        )}
                        onClick={() => {
                          setFilterOptions((prev) => ({ ...prev, possessionType: null }));
                          changeIsNeedToGet(true);
                        }}
                      >
                        Все
                      </button>
                    </div>
                  )}
                >
                  <IoFunnel
                    className={clsx(
                      'text-lg cursor-pointer',
                      filterOptions.possessionType ? 'text-blue-700' : 'text-white',
                    )}
                  />
                </Dropdown>
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
            <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
              <PossessionNameTableComponent
                name={props.children}
                defaultItemValue={filterOptions.possessionName}
                setFilterOptions={setFilterOptions}
                changeIsNeedToGet={changeIsNeedToGet}
              />
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

  const handleTableChange = (pagination: TablePaginationConfig) => {
    changeIsNeedToGet(true);
    setTableParams({
      pagination,
    });
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
    />
  );
};
