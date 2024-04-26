import { FC, useState } from 'react';
import { useLogout } from '../../../../../hooks/useLogout';
import { ICitizenPossessionsColumns, INotApprovedCitizenPossession } from '../../../../../types';
import { Button, ConfigProvider } from 'antd';
import clsx from 'clsx';
import { ImSpinner9 } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';
import Table, { ColumnsType } from 'antd/es/table';
import { updateCitizenPossessionStatusWithExtraBySystemRequest } from '../../../../../../api/requests/User';
import { FaArrowDownShortWide } from 'react-icons/fa6';
import { IoFunnel } from 'react-icons/io5';

interface IProps {
  tableInfo: INotApprovedCitizenPossession[];
  changeTableInfo: React.Dispatch<React.SetStateAction<INotApprovedCitizenPossession[]>>;
  isLoading: boolean;
  changeSelectedCitizenPossession: React.Dispatch<
    React.SetStateAction<INotApprovedCitizenPossession | null>
  >;
}

interface IProcessingRow {
  row_id: number;
  operation: 'success' | 'loading';
  button_type: 'approve' | 'reject';
}

export const AppTable: FC<IProps> = ({
  tableInfo,
  changeTableInfo,
  isLoading,
  changeSelectedCitizenPossession,
}) => {
  const logout = useLogout();
  const [processingRow, changeProcessingRow] = useState<null | IProcessingRow>(null);
  const [sortedBy, changeSortedBy] = useState<
    null | 'id_increasing' | 'id_decreasing' | 'status_increasing' | 'status_decreasing'
  >(null);

  const makeSorting = (
    sortingFieldName: 'id_increasing' | 'id_decreasing' | 'status_increasing' | 'status_decreasing',
  ) => {
    changeSortedBy(sortingFieldName);

    if (sortingFieldName === 'id_increasing') {
      changeTableInfo([...tableInfo].sort((a, b) => b.id - a.id));
    }
    if (sortingFieldName === 'id_decreasing') {
      changeTableInfo([...tableInfo].sort((a, b) => a.id - b.id));
    }
    if (sortingFieldName === 'status_decreasing') {
      changeTableInfo(
        [...tableInfo].sort((a, b) => {
          if (a.approving_status === 'На подтверждении' && b.approving_status === 'Отклонена') {
            return -1;
          } else if (
            a.approving_status === 'Отклонена' &&
            b.approving_status === 'На подтверждении'
          ) {
            return 1;
          } else {
            return 0;
          }
        }),
      );
    }

    if (sortingFieldName === 'status_increasing') {
      changeTableInfo(
        [...tableInfo].sort((a, b) => {
          if (b.approving_status === 'На подтверждении' && a.approving_status === 'Отклонена') {
            return -1;
          } else if (
            b.approving_status === 'Отклонена' &&
            a.approving_status === 'На подтверждении'
          ) {
            return 1;
          } else {
            return 0;
          }
        }),
      );
    }
  };

  const makeUpdateCitizenPossessionStatusBySystem = async (
    citizenPossessionId: number,
    newStatusId: '3' | '1',
  ) => {
    if (!tableInfo.length) return;

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
          changeTableInfo(tableInfo.filter((el) => el.id !== citizenPossessionId));
        }
        if (newStatusId === '1') {
          changeTableInfo(
            tableInfo.map((el) => {
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
        if (props.children && Array.isArray(props.children) && props.children[1] === '№') {
          return (
            <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
              <div className='flex items-center gap-x-2 justify-center'>
                <span>{props.children}</span>
                <button
                  className='outline-none border-none'
                  onClick={() =>
                    makeSorting(sortedBy === 'id_increasing' ? 'id_decreasing' : 'id_increasing')
                  }
                >
                  <IoFunnel className='text-lg text-white' />
                </button>
                <FaArrowDownShortWide
                  className={clsx(
                    'text-lg',
                    sortedBy === 'id_decreasing' && 'block',
                    !['id_increasing', 'id_decreasing'].some((el) => sortedBy === el) && 'hidden',
                    sortedBy === 'id_increasing' && 'rotate-180',
                  )}
                />
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
              <div className='flex w-max items-center gap-x-1 justify-center'>
                <span>{props.children}</span>
                <button
                  className='outline-none border-none'
                  onClick={() =>
                    makeSorting(
                      sortedBy === 'status_decreasing' ? 'status_increasing' : 'status_decreasing',
                    )
                  }
                >
                  <IoFunnel className='text-lg text-white' />
                </button>
                <FaArrowDownShortWide
                  className={clsx(
                    'text-lg',
                    sortedBy === 'status_decreasing' && 'block',
                    !['status_increasing', 'status_decreasing'].some((el) => sortedBy === el) &&
                      'hidden',
                    sortedBy === 'status_increasing' && 'rotate-180',
                  )}
                />
              </div>
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
      title: 'Статус собственности',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <span className='font-bold whitespace-nowrap'>{status}</span>,
    },
    {
      title: 'Адрес собственности',
      dataIndex: 'address',
      key: 'address',
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
            onClick={() => {
              if (!tableInfo) return;
              makeUpdateCitizenPossessionStatusBySystem(rowData.key, '3');
            }}
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
            disabled={processingRow && processingRow.row_id === rowData.key ? true : false}
            onClick={() => {
              const citizenPossession = tableInfo.filter((el) => el.id === rowData.key);
              if (!citizenPossession.length) return;
              changeSelectedCitizenPossession(citizenPossession[0]);
            }}
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
            onClick={() => {
              makeUpdateCitizenPossessionStatusBySystem(rowData.key, '1');
            }}
            disabled={
              rowData.status === 'Отклонена' ||
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
        status: el.approving_status,
        address: `${el.complex} ${el.building} [${el.possession_type}] № ${el.possession}`,
        citizenFIO: `${el.last_name} ${el.first_name} ${!el.patronymic ? '' : el.patronymic}`,
      }))}
      columns={columns}
      components={components}
      loading={isLoading}
      bordered
      pagination={false}
      locale={{
        emptyText: <span className='font-bold text-lg'>Нет данных</span>,
      }}
      rowClassName='text-center'
      style={{
        width: 'min-content',
      }}
    />
  );
};
