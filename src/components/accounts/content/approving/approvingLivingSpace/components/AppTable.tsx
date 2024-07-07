import { FC, useEffect, useState } from 'react';
import { useLogout } from '../../../../../hooks/useLogout';
import { updatePossessionStatusWithExtraRequest } from '../../../../../../api/requests/Possession';
import {
  IFilterNotApprovedLivingSpacesOptions,
  ILivingSpaceColumns,
  INotApprovedLivingSpace,
  IStatus,
} from '../../../../../types';
import { Button, ConfigProvider, Dropdown } from 'antd';
import clsx from 'clsx';
import { ImSpinner9 } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';
import Table, { ColumnsType } from 'antd/es/table';
import { IoFunnel } from 'react-icons/io5';
import { useActions } from '../../../../../hooks/useActions';
import { BuildingTableComponent } from './BuildingTableComponent';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';
import { CreatorTableComponent } from './CreatorTableComponent';
import { PossessionNameTableComponent } from './PossessionNameTableComponent';
import { PersonalAccountTableComponent } from './PersonalAccountTableComponent';

interface IProps {
  tableInfo: INotApprovedLivingSpace[];
  changeSelectedPossession: React.Dispatch<React.SetStateAction<INotApprovedLivingSpace | null>>;
  getNotApprovedLivingSpaces: (
    filterOptions: IFilterNotApprovedLivingSpacesOptions,
  ) => Promise<void>;
}

interface IProcessingRow {
  row_id: number;
  operation: 'success' | 'loading';
  button_type: 'approve' | 'reject';
}

const statuses: IStatus[] = [
  { id: 1, name: 'Отклонена' },
  { id: 2, name: 'На подтверждении' },
];

export const AppTable: FC<IProps> = ({
  tableInfo,
  changeSelectedPossession,
  getNotApprovedLivingSpaces,
}) => {
  const logout = useLogout();
  const { approvingLivingSpacesSuccess } = useActions();
  const { complexes, possessionTypes } = useTypedSelector((state) => state.PossessionReducer);
  const [processingRow, changeProcessingRow] = useState<null | IProcessingRow>(null);
  const { isLoading } = useTypedSelector((state) => state.ApprovingReducer);
  const [isNeedToGet, changeIsNeedToGet] = useState(false);
  const [filterOptions, setFilterOptions] = useState<IFilterNotApprovedLivingSpacesOptions>({
    complexId: null,
    buildingId: null,
    statusId: null,
    creator: null,
    personalAccount: null,
    possessionName: null,
    possessionType: null,
  });

  const mainProcesses = async () => {
    await getNotApprovedLivingSpaces(filterOptions);
    changeIsNeedToGet((prev) => !prev);
  };

  useEffect(() => {
    if (isNeedToGet) {
      mainProcesses();
    }
  }, [isNeedToGet]);

  useEffect(() => {
    let filterParams = localStorage.getItem('approving_living_space_filter_options');
    let parsedFilterObject: IFilterNotApprovedLivingSpacesOptions = filterOptions;
    if (filterParams) {
      try {
        parsedFilterObject = JSON.parse(filterParams);
        if (parsedFilterObject) setFilterOptions(parsedFilterObject);
      } catch (e) {
        localStorage.setItem(
          'approving_living_space_filter_options',
          JSON.stringify(filterOptions),
        );
      }
    } else {
      localStorage.setItem('approving_living_space_filter_options', JSON.stringify(filterOptions));
    }
    changeIsNeedToGet(true);
  }, []);

  const makeUpdatePossessionStatus = async (possession_id: number, newStatusId: '1' | '3') => {
    if (!tableInfo) return;

    if (newStatusId === '3') {
      changeProcessingRow({
        row_id: possession_id,
        operation: 'loading',
        button_type: 'approve',
      });
    }
    if (newStatusId === '1') {
      changeProcessingRow({
        row_id: possession_id,
        operation: 'loading',
        button_type: 'reject',
      });
    }
    const response = await updatePossessionStatusWithExtraRequest(
      possession_id.toString(),
      newStatusId,
      logout,
    );
    if (response === 200) {
      changeProcessingRow((prev) => (prev ? { ...prev, operation: 'success' } : null));
      setTimeout(() => {
        if (newStatusId === '1') {
          approvingLivingSpacesSuccess(
            tableInfo.map((el) => {
              if (el.id !== possession_id) return el;

              return { ...el, approving_status: 'Отклонена' };
            }),
          );
        }
        if (newStatusId === '3') {
          approvingLivingSpacesSuccess(tableInfo.filter((el) => el.id !== possession_id));
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
          props.children[1] === 'Статус жилплощади'
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
          props.children[1] === 'Лицевой счет'
        ) {
          return (
            <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
              <PersonalAccountTableComponent
                name={props.children}
                defaultItemValue={filterOptions.personalAccount}
                setFilterOptions={setFilterOptions}
                changeIsNeedToGet={changeIsNeedToGet}
              />
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
        if (props.children && Array.isArray(props.children) && props.children[1] === 'Житель') {
          return (
            <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
              <CreatorTableComponent
                name={props.children}
                defaultItemValue={filterOptions.creator}
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

  const columns: ColumnsType<ILivingSpaceColumns> = [
    {
      title: '№',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Статус жилплощади',
      dataIndex: 'approving_status',
      key: 'approving_status',
      render: (approving_status: string) => (
        <span className='font-bold whitespace-nowrap'>{approving_status}</span>
      ),
    },
    {
      title: 'Житель',
      dataIndex: 'whoCreated',
      key: 'whoCreated',
    },
    {
      title: 'Лицевой счет',
      dataIndex: 'personalAccount',
      key: 'personalAccount',
    },
    {
      title: 'Жилищный комплекс',
      dataIndex: 'complex',
      key: 'complex',
    },
    {
      title: 'Адрес здания',
      dataIndex: 'building',
      key: 'building',
    },
    {
      title: 'Тип собственности',
      dataIndex: 'possessionType',
      key: 'possessionType',
    },
    {
      title: 'Наименование собственности',
      dataIndex: 'possessionName',
      key: 'possessionName',
    },
    {
      title: 'Подтвердить',
      dataIndex: 'approve',
      key: 'approve',
      render: (_, rowData) => (
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimaryHover: undefined,
              },
            },
          }}
        >
          <Button
            type='primary'
            onClick={() => makeUpdatePossessionStatus(rowData.key, '3')}
            disabled={processingRow && processingRow.row_id === rowData.key ? true : false}
            className='text-white h-[40px] bg-green-700'
          >
            {processingRow &&
              processingRow.operation === 'loading' &&
              processingRow.row_id === rowData.key &&
              processingRow.button_type === 'approve' && (
                <div>
                  <ImSpinner9 className='inline animate-spin mr-2' />
                  <span>Обработка</span>
                </div>
              )}
            {processingRow &&
              processingRow.operation === 'success' &&
              processingRow.row_id === rowData.key &&
              processingRow.button_type === 'approve' && (
                <div>
                  <HiOutlineCheck className='inline mr-2 font-bold text-lg' />
                  <span>Успешно</span>
                </div>
              )}
            {(!processingRow ||
              (processingRow &&
                (processingRow.row_id !== rowData.key ||
                  (processingRow.row_id === rowData.key &&
                    processingRow.button_type !== 'approve')))) && <>Подтвердить</>}
          </Button>
        </ConfigProvider>
      ),
    },
    {
      title: 'Подробно',
      dataIndex: 'details',
      key: 'details',
      render: (_, rowData) => (
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimaryHover: undefined,
              },
            },
          }}
        >
          <Button
            type='primary'
            onClick={() => {
              const selectedPossession = tableInfo.filter((el) => el.id === rowData.key);
              if (!selectedPossession.length) return;
              changeSelectedPossession(selectedPossession[0]);
            }}
            disabled={processingRow && processingRow.row_id === rowData.key ? true : false}
            className='text-white h-[40px] bg-blue-700'
          >
            Подробно
          </Button>
        </ConfigProvider>
      ),
    },
    {
      title: 'Отклонить',
      dataIndex: 'reject',
      key: 'reject',
      render: (_, rowData) => (
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimaryHover: undefined,
              },
            },
          }}
        >
          <Button
            type='primary'
            onClick={() => makeUpdatePossessionStatus(rowData.key, '1')}
            disabled={
              rowData.approving_status === 'Отклонена' ||
              (processingRow && processingRow.row_id === rowData.key)
                ? true
                : false
            }
            className='text-white h-[40px] bg-red-700'
          >
            {processingRow &&
              processingRow.operation === 'loading' &&
              processingRow.row_id === rowData.key &&
              processingRow.button_type === 'reject' && (
                <div>
                  <ImSpinner9 className='inline animate-spin mr-2' />
                  <span>Обработка</span>
                </div>
              )}
            {processingRow &&
              processingRow.operation === 'success' &&
              processingRow.row_id === rowData.key &&
              processingRow.button_type === 'reject' && (
                <div>
                  <HiOutlineCheck className='inline mr-2 font-bold text-lg' />
                  <span>Успешно</span>
                </div>
              )}
            {(!processingRow ||
              (processingRow &&
                (processingRow.row_id !== rowData.key ||
                  (processingRow.row_id === rowData.key &&
                    processingRow.button_type !== 'reject')))) && <>Отклонить</>}
          </Button>
        </ConfigProvider>
      ),
    },
  ];

  return (
    <Table
      dataSource={tableInfo.map((el) => ({
        key: el.id,
        approving_status: el.approving_status,
        complex: el.complex,
        possessionType: el.type,
        building: el.building,
        whoCreated: !el.who_created ? '—' : el.who_created,
        personalAccount: !el.personal_account ? '—' : el.personal_account,
        possessionName: el.name,
      }))}
      columns={columns}
      components={components}
      bordered
      pagination={false}
      loading={isLoading === 'approvingLivingSpaces' ? true : false}
      locale={{
        emptyText: <span className='font-bold text-lg'>Нет данных</span>,
      }}
      rowClassName='text-center bg-gray-200'
    />
  );
};
