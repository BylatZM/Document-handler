import { FC, useEffect, useMemo, useState } from 'react';
import { useLogout } from '../../../../../hooks/useLogout';
import {
  ICitizenPossessionsColumns,
  IFilterNotApprovedCitizenPossessionOptions,
  INotApprovedCitizenPossession,
  ISortNotApprovedCitizenPossessionOptions,
  IStatus,
  ITableParams,
  IApprovingCitizenPossessionProcessingRow,
} from '../../../../../types';
import { Dropdown } from 'antd';
import clsx from 'clsx';
import Table, { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { updateCitizenPossessionStatusWithExtraBySystemRequest } from '../../../../../../api/requests/User';
import { IoFunnel } from 'react-icons/io5';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { useActions } from '../../../../../hooks/useActions';
import { CitizenFioTableComponent } from './CitizenFioTableComponent';
import { PossessionNameTableComponent } from './PossessionNameTableComponent';
import { ApproveButton } from './ApproveButton';
import { DetailsButton } from './DetailsButton';
import { RejectButton } from './RejectButton';
import { BuildingTableComponent } from './BuildingTableComponent';

interface IProps {
  changeSelectedCitizenPossession: React.Dispatch<
    React.SetStateAction<INotApprovedCitizenPossession | null>
  >;
  tableParams: ITableParams;
  setTableParams: React.Dispatch<React.SetStateAction<ITableParams>>;
  getNotApprovedCitizenPossessions: (
    filterOptions?: IFilterNotApprovedCitizenPossessionOptions,
    sortOptions?: ISortNotApprovedCitizenPossessionOptions,
  ) => Promise<void>;
}

const statuses: IStatus[] = [
  { id: 1, name: 'Отклонена' },
  { id: 2, name: 'На подтверждении' },
];

export const AppTable: FC<IProps> = ({
  changeSelectedCitizenPossession,
  tableParams,
  setTableParams,
  getNotApprovedCitizenPossessions,
}) => {
  const logout = useLogout();
  const [processingRow, changeProcessingRow] =
    useState<null | IApprovingCitizenPossessionProcessingRow>(null);
  const { complexes, possessionTypes } = useTypedSelector((state) => state.PossessionReducer);
  const { approvingCitizenPossessions, isLoading } = useTypedSelector(
    (state) => state.ApprovingReducer,
  );
  const [sortOptions, setSortOptions] = useState<ISortNotApprovedCitizenPossessionOptions>({
    creating_date_inc: false,
    creating_date_dec: true,
  });
  const [isNeedToGet, changeIsNeedToGet] = useState(false);
  const [filterOptions, setFilterOptions] = useState<IFilterNotApprovedCitizenPossessionOptions>({
    complexId: null,
    buildingId: null,
    statusId: null,
    fio: null,
    possessionName: null,
    possessionType: null,
  });

  const { approvingCitizenPossessionsSuccess } = useActions();

  const mainProcesses = async () => {
    getNotApprovedCitizenPossessions(filterOptions, sortOptions);
    changeIsNeedToGet((prev) => !prev);
  };

  useEffect(() => {
    if (isNeedToGet) {
      mainProcesses();
    }
  }, [isNeedToGet]);

  useEffect(() => {
    let sortParams = localStorage.getItem('approving_citizen_possession_sort_options');
    let parsedSortObject: ISortNotApprovedCitizenPossessionOptions = sortOptions;
    if (sortParams) {
      try {
        parsedSortObject = JSON.parse(sortParams);
        setSortOptions(parsedSortObject);
      } catch (e) {
        localStorage.setItem(
          'approving_citizen_possession_sort_options',
          JSON.stringify(sortOptions),
        );
      }
    } else
      localStorage.setItem(
        'approving_citizen_possession_sort_options',
        JSON.stringify(sortOptions),
      );

    let filterParams = localStorage.getItem('approving_citizen_possession_filter_options');
    let parsedFilterObject: IFilterNotApprovedCitizenPossessionOptions = filterOptions;
    if (filterParams) {
      try {
        parsedFilterObject = JSON.parse(filterParams);
        if (parsedFilterObject) setFilterOptions(parsedFilterObject);
      } catch (e) {
        localStorage.setItem(
          'approving_citizen_possession_filter_options',
          JSON.stringify(filterOptions),
        );
      }
    } else {
      localStorage.setItem(
        'approving_citizen_possession_filter_options',
        JSON.stringify(filterOptions),
      );
    }
    changeIsNeedToGet(true);
  }, []);

  const makeUpdateCitizenPossessionStatusBySystem = async (
    citizenPossessionId: number,
    newStatusId: '3' | '1',
  ) => {
    if (!approvingCitizenPossessions.length) return;

    if (newStatusId === '3') {
      changeProcessingRow({
        row_id: citizenPossessionId,
        operation: 'loading',
        button_type: 'approve',
      });
    }
    if (newStatusId === '1') {
      changeProcessingRow({
        row_id: citizenPossessionId,
        operation: 'loading',
        button_type: 'reject',
      });
    }
    const response = await updateCitizenPossessionStatusWithExtraBySystemRequest(
      logout,
      citizenPossessionId.toString(),
      newStatusId,
    );
    if (response === 200) {
      changeProcessingRow((prev) => (prev ? { ...prev, operation: 'success' } : null));
      setTimeout(() => {
        if (newStatusId === '3') {
          approvingCitizenPossessionsSuccess(
            approvingCitizenPossessions.filter((el) => el.id !== citizenPossessionId),
          );
        }
        if (newStatusId === '1') {
          approvingCitizenPossessionsSuccess(
            approvingCitizenPossessions.map((el) => {
              if (el.id === citizenPossessionId) return { ...el, approving_status: 'Отклонена' };
              else return el;
            }),
          );
        }
        changeProcessingRow((prev) => null);
      }, 2000);
    } else changeProcessingRow((prev) => null);
  };
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
        if (
          props.children &&
          Array.isArray(props.children) &&
          props.children[1] === 'Статус собственности'
        ) {
          return (
            <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
              <div className='flex gap-x-2'>
                <span>{props.children}</span>
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
            <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
              <div className='flex gap-x-2'>
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
                complexId={filterOptions.complexId}
                buildingId={filterOptions.buildingId}
                setFilterOptions={setFilterOptions}
                changeIsNeedToGet={changeIsNeedToGet}
              />
            </th>
          );
        }
        if (props.children && Array.isArray(props.children) && props.children[1] === 'ФИО жителя') {
          return (
            <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
              <CitizenFioTableComponent
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
                      {possessionTypes
                        .filter((el) => el.name !== 'Жилищный комплекс')
                        .map((el) => (
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
                name={props.children[1]}
                defaultItemValue={filterOptions.possessionName}
                setFilterOptions={setFilterOptions}
                changeIsNeedToGet={changeIsNeedToGet}
              />
            </th>
          );
        }
        return (
          <th
            style={{ background: '#000', color: '#fff', textAlign: 'center', whiteSpace: 'nowrap' }}
          >
            {props.children}
          </th>
        );
      },
    },
  };

  const columns: ColumnsType<ICitizenPossessionsColumns> = [
    {
      title: '№',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'ФИО жителя',
      dataIndex: 'citizenFIO',
      key: 'citizenFIO',
    },
    {
      title: 'Дата создания',
      dataIndex: 'createdDate',
      key: 'createdDate',
    },
    {
      title: 'Статус собственности',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <span className='font-bold whitespace-nowrap'>{status}</span>,
    },
    {
      title: 'Жилищный комплекс',
      dataIndex: 'complex',
      key: 'complex',
      render: (complex: string) => (
        <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
          {complex}
        </div>
      ),
    },
    {
      title: 'Адрес здания',
      dataIndex: 'building',
      key: 'building',
      render: (complex: string) => (
        <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
          {complex}
        </div>
      ),
    },
    {
      title: 'Тип собственности',
      dataIndex: 'possessionType',
      key: 'possessionType',
      render: (complex: string) => (
        <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
          {complex}
        </div>
      ),
    },
    {
      title: 'Наименование собственности',
      dataIndex: 'possessionName',
      key: 'possessionName',
      render: (complex: string) => (
        <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
          {complex}
        </div>
      ),
    },
    {
      title: 'Подтвердить',
      dataIndex: 'approve',
      key: 'approve',
      render: (_, rowData) => (
        <ApproveButton
          makeUpdateCitizenPossessionStatusBySystem={makeUpdateCitizenPossessionStatusBySystem}
          processingRow={processingRow}
          rowData={rowData}
        />
      ),
    },
    {
      title: 'Подробно',
      dataIndex: 'details',
      key: 'details',
      render: (_, rowData) => (
        <DetailsButton
          processingRow={processingRow}
          rowData={rowData}
          approvingCitizenPossessions={approvingCitizenPossessions}
          changeSelectedCitizenPossession={changeSelectedCitizenPossession}
        />
      ),
    },
    {
      title: 'Отклонить',
      dataIndex: 'reject',
      key: 'reject',
      render: (_, rowData) => (
        <RejectButton
          makeUpdateCitizenPossessionStatusBySystem={makeUpdateCitizenPossessionStatusBySystem}
          processingRow={processingRow}
          rowData={rowData}
        />
      ),
    },
  ];

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setTableParams({
      pagination,
    });
    changeIsNeedToGet(true);
  };

  return (
    <Table
      dataSource={approvingCitizenPossessions.map((el) => ({
        key: el.id,
        status: el.approving_status,
        createdDate: el.created_date,
        citizenFIO: `${el.last_name} ${el.first_name} ${!el.patronymic ? '' : el.patronymic}`,
        possessionType: el.possession_type,
        possessionName: el.possession,
        complex: el.complex,
        building: el.building,
      }))}
      columns={columns}
      components={components}
      loading={isLoading === 'approvingCitizenPossessions'}
      bordered
      pagination={tableParams.pagination}
      locale={{
        emptyText: <span className='font-bold text-lg'>Нет данных</span>,
      }}
      onChange={handleTableChange}
      rowClassName='text-center'
      style={{
        width: 'fit-content',
      }}
    />
  );
};
