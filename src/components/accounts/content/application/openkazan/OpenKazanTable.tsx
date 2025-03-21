import { FC, useEffect, useState } from 'react';
import { Dropdown, Table } from 'antd';
import { IoFunnel } from 'react-icons/io5';
import clsx from 'clsx';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  IFilterOpenKazanAppOptions,
  IOpenKazanTableColumns,
  ISortOptions,
  IStatus,
  ITableParams,
} from '../../../../types';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { BuildingTableComponent } from './tableColumnComponents/BuildingTableComponent';
import { ApplicantFioTableComponent } from './tableColumnComponents/ApplicantFioTableComponent';
import { ApplicantPhoneTableComponent } from './tableColumnComponents/ApplicantPhoneTableComponent';
import { PossessionNameTableComponent } from './tableColumnComponents/PossessionNameTableComponent';
import { SubtypeTableComponent } from './tableColumnComponents/SubtypeTableComponent';
import { TypeTableComponent } from './tableColumnComponents/TypeTableComponent';
import { OpenKazanTypeStatusName } from './TableArgs';
import { EmployeeTableComponent } from './tableColumnComponents/EmployeeTableComponent';

interface IProps {
  showForm: (application_id: number) => void;
  openKazanTable: ColumnsType<IOpenKazanTableColumns>;
  tableParams: ITableParams;
  statuses: IStatus[];
  getOpenKazanApplications: (
    filterOptions?: IFilterOpenKazanAppOptions,
    sortOptions?: ISortOptions,
  ) => Promise<void>;
  setTableParams: React.Dispatch<React.SetStateAction<ITableParams>>;
  isNeedToGet: boolean;
  changeIsNeedToGet: React.Dispatch<React.SetStateAction<boolean>>;
}

export const OpenKazanTable: FC<IProps> = ({
  showForm,
  openKazanTable,
  tableParams,
  statuses,
  getOpenKazanApplications,
  setTableParams,
  isNeedToGet,
  changeIsNeedToGet,
}) => {
  const { openKazanApplications } = useTypedSelector((state) => state.ApplicationReducer);
  const { isLoading } = useTypedSelector((state) => state.ApplicationReducer);
  const [filterOptions, setFilterOptions] = useState<IFilterOpenKazanAppOptions>({
    buildingAddress: null,
    statusId: null,
    phone: null,
    fio: null,
    possessionName: null,
    typeName: null,
    subtypeName: null,
    employeeName: null,
    typeStatusName: null,
  });
  const [sortOptions, setSortOptions] = useState<ISortOptions>({
    status_inc: false,
    status_dec: true,
    creating_date_inc: false,
    creating_date_dec: true,
  });

  const mainProcesses = async () => {
    getOpenKazanApplications(filterOptions, sortOptions);
    changeIsNeedToGet((prev) => !prev);
  };

  useEffect(() => {
    if (isNeedToGet) {
      mainProcesses();
    }
  }, [isNeedToGet]);

  useEffect(() => {
    let sortParams = localStorage.getItem('open_kazan_application_sort_options');
    let parsedSortObject: ISortOptions = sortOptions;
    if (sortParams) {
      try {
        parsedSortObject = JSON.parse(sortParams);
        setSortOptions(parsedSortObject);
      } catch (e) {
        localStorage.setItem('open_kazan_application_sort_options', JSON.stringify(sortOptions));
      }
    } else localStorage.setItem('open_kazan_application_sort_options', JSON.stringify(sortOptions));

    let filterParams = localStorage.getItem('open_kazan_application_filter_options');
    let parsedFilterObject: IFilterOpenKazanAppOptions | null = null;
    if (filterParams) {
      try {
        parsedFilterObject = JSON.parse(filterParams);
        if (parsedFilterObject) setFilterOptions(parsedFilterObject);
      } catch (e) {
        localStorage.setItem(
          'open_kazan_application_filter_options',
          JSON.stringify(filterOptions),
        );
      }
    } else
      localStorage.setItem('open_kazan_application_filter_options', JSON.stringify(filterOptions));
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
          props.children[1] === 'Тип статуса заявки'
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
                  overlayClassName='bg-black overflow-y-auto max-h-[150px] border-white border-[1px] bg-opacity-70 max-sm:text-sm'
                  dropdownRender={() => (
                    <div className='flex flex-col'>
                      {OpenKazanTypeStatusName.map((el, index) => (
                        <button
                          key={index + 1}
                          className={clsx(
                            'transitionFast border-none p-2',
                            filterOptions.typeStatusName === el.url_extra
                              ? 'bg-white text-black'
                              : 'hover:bg-black text-white',
                          )}
                          onClick={() => {
                            setFilterOptions((prev) => ({
                              ...prev,
                              typeStatusName: el.url_extra,
                            }));
                            changeIsNeedToGet(true);
                          }}
                        >
                          {el.description}
                        </button>
                      ))}
                      <button
                        className={clsx(
                          'transitionFast border-none p-2',
                          filterOptions.typeStatusName === null
                            ? 'text-black bg-white'
                            : 'hover:bg-black text-white',
                        )}
                        onClick={() => {
                          setFilterOptions((prev) => ({ ...prev, typeStatusName: null }));
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
                      filterOptions.typeStatusName ? 'text-blue-700' : 'text-white',
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
                defaultItemValue={filterOptions.buildingAddress}
                setFilterOptions={setFilterOptions}
                changeIsNeedToGet={changeIsNeedToGet}
              />
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
            <th
              style={{ background: '#000', color: '#fff', textAlign: 'center' }}
              className='relative'
            >
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
        if (props.children && Array.isArray(props.children) && props.children[1] === 'Тип заявки') {
          return (
            <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
              <TypeTableComponent
                name={props.children}
                defaultItemValue={filterOptions.typeName}
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
                defaultItemValue={filterOptions.subtypeName}
                setFilterOptions={setFilterOptions}
                changeIsNeedToGet={changeIsNeedToGet}
              />
            </th>
          );
        }
        if (
          props.children &&
          Array.isArray(props.children) &&
          props.children[1] === 'Исполнитель'
        ) {
          return (
            <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
              <EmployeeTableComponent
                name={props.children}
                defaultItemValue={filterOptions.subtypeName}
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
      dataSource={openKazanApplications.map((el) => ({
        key: el.id,
        createdDate: el.created_date,
        dueDate: el.due_date ?? '—',
        status: el.status.name,
        type: el.type_name,
        subtype: el.subtype_name,
        applicantComment: el.applicant_comment,
        complex: !el.complex ? '—' : el.complex.name,
        building: el.building_address,
        possession: el.possession,
        phone: el.contact,
        fio: el.applicant_fio,
        employee: el.employee.employee,
        emergency: el.is_emergency ? 'ЭКСТРЕННАЯ' : 'обычная',
        deadline: el.deadline,
        isWarning: el.is_warning,
        isExpired: el.is_expired,
      }))}
      columns={openKazanTable}
      components={components}
      bordered
      pagination={tableParams.pagination}
      onChange={handleTableChange}
      loading={isLoading === 'openKazanApplications' ? true : false}
      locale={{
        emptyText: <span className='font-bold text-lg'>Нет данных</span>,
      }}
      rowClassName={(item) => {
        if (item.isExpired) {
          return 'table-row bg-red-400 bg-opacity-80';
        }
        if (item.isWarning && item.status !== 'Закрыта') {
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
