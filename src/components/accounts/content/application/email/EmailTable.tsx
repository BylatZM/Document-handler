import React, { FC, useEffect, useState } from 'react';
import { Dropdown, Table } from 'antd';
import { IoFunnel } from 'react-icons/io5';
import clsx from 'clsx';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  IEmailTableColumns,
  ITableParams,
  IFilterEmailAppOptions,
  ISortOptions,
  IComplex,
  IStatus,
} from '../../../../types';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { BuildingTableComponent } from './tableColumnComponents/BuildingTableComponent';
import { ApplicantEmailTableComponent } from './tableColumnComponents/ApplicantEmailTableComponent';
import { ApplicantFioTableComponent } from './tableColumnComponents/ApplicantFioTableComponent';
import { ApplicantPhoneTableComponent } from './tableColumnComponents/ApplicantPhoneTableComponent';
import { PossessionNameTableComponent } from './tableColumnComponents/PossessionNameTableComponent';
import { TypeTableComponent } from './tableColumnComponents/TypeTableComponent';
import { SubtypeTableComponent } from './tableColumnComponents/SubtypeTableComponent';

interface IProps {
  showForm: (application_id: number) => void;
  emailTable: ColumnsType<IEmailTableColumns>;
  setTableParams: React.Dispatch<React.SetStateAction<ITableParams>>;
  getApplications: (
    filterOptions?: IFilterEmailAppOptions,
    sortOptions?: ISortOptions,
  ) => Promise<void>;
  tableParams: ITableParams;
  complexes: IComplex[];
  statuses: IStatus[];
  applicationFreshnessStatus: (
    creatingDate: string,
    normative_in_hours: number,
  ) => 'fresh' | 'warning' | 'expired';
  isNeedToGet: boolean;
  changeIsNeedToGet: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EmailTable: FC<IProps> = ({
  showForm,
  emailTable,
  setTableParams,
  getApplications,
  tableParams,
  complexes,
  statuses,
  applicationFreshnessStatus,
  isNeedToGet,
  changeIsNeedToGet,
}) => {
  const { emailApplications, isLoading } = useTypedSelector((state) => state.ApplicationReducer);
  const [filterOptions, setFilterOptions] = useState<IFilterEmailAppOptions>({
    complexId: null,
    buildingAddress: null,
    statusId: null,
    phone: null,
    email: null,
    fio: null,
    possessionName: null,
    typeId: null,
    subtypeName: null,
  });
  const [sortOptions, setSortOptions] = useState<ISortOptions>({
    status_inc: false,
    status_dec: true,
    creating_date_inc: false,
    creating_date_dec: true,
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
    let sortParams = localStorage.getItem('email_application_sort_options');
    let parsedSortObject: ISortOptions = sortOptions;
    if (sortParams) {
      try {
        parsedSortObject = JSON.parse(sortParams);
        setSortOptions(parsedSortObject);
      } catch (e) {
        localStorage.setItem('email_application_sort_options', JSON.stringify(sortOptions));
      }
    } else localStorage.setItem('email_application_sort_options', JSON.stringify(sortOptions));

    let filterParams = localStorage.getItem('email_application_filter_options');
    let parsedFilterObject: IFilterEmailAppOptions | null = null;
    if (filterParams) {
      try {
        parsedFilterObject = JSON.parse(filterParams);
        if (parsedFilterObject) setFilterOptions(parsedFilterObject);
      } catch (e) {
        localStorage.setItem('email_application_filter_options', JSON.stringify(filterOptions));
      }
    } else localStorage.setItem('email_application_filter_options', JSON.stringify(filterOptions));
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
                defaultItemValue={filterOptions.buildingAddress}
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
          props.children[1] === 'Электронная почта'
        ) {
          return (
            <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
              <ApplicantEmailTableComponent
                name={props.children}
                defaultItemValue={filterOptions.email}
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
      dataSource={emailApplications.map((el) => ({
        key: el.id,
        createdDate: el.created_date,
        status: el.status.name,
        type: el.type ? el.type.name : '—',
        subtype: el.subtype ? el.subtype.name : '—',
        dueDate: !el.due_date ? '—' : el.due_date,
        applicantComment: el.applicant_comment,
        complex: el.complex ? el.complex.name : '—',
        building: el.building_address,
        possession: el.possession,
        phone: !el.phone ? '—' : el.phone,
        email: el.email,
        fio: el.applicant_fio,
        employee: el.employee ? el.employee.employee : '—',
        payment_code: el.payment_code,
        normative: el.normative ? el.normative : 120,
      }))}
      columns={emailTable}
      components={components}
      bordered
      pagination={tableParams.pagination}
      onChange={handleTableChange}
      loading={isLoading === 'emailApplications' ? true : false}
      locale={{
        emptyText: <span className='font-bold text-lg'>Нет данных</span>,
      }}
      rowClassName={(item) => {
        if (
          applicationFreshnessStatus(item.createdDate, item.normative) === 'expired' &&
          item.status !== 'Закрыта' && item.status !== 'Заведена неверно'
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
