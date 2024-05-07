import { FC, useState } from 'react';
import { useLogout } from '../../../../../hooks/useLogout';
import { updatePossessionStatusWithExtraRequest } from '../../../../../../api/requests/Possession';
import { ILivingSpaceColumns, INotApprovedPossession } from '../../../../../types';
import { Button, ConfigProvider } from 'antd';
import clsx from 'clsx';
import { ImSpinner9 } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';
import Table, { ColumnsType } from 'antd/es/table';
import { FaArrowDownShortWide } from 'react-icons/fa6';
import { IoFunnel } from 'react-icons/io5';

interface IProps {
  tableInfo: INotApprovedPossession[];
  changeTableInfo: React.Dispatch<React.SetStateAction<INotApprovedPossession[]>>;
  isInfoLoading: boolean;
  changeSelectedPossession: React.Dispatch<React.SetStateAction<INotApprovedPossession | null>>;
}

interface IProcessingRow {
  row_id: number;
  operation: 'success' | 'loading';
  button_type: 'approve' | 'reject';
}

export const AppTable: FC<IProps> = ({
  tableInfo,
  changeTableInfo,
  isInfoLoading,
  changeSelectedPossession,
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
          changeTableInfo(
            tableInfo.map((el) => {
              if (el.id !== possession_id) return el;

              return { ...el, approving_status: 'Отклонена' };
            }),
          );
        }
        if (newStatusId === '3') {
          changeTableInfo(tableInfo.filter((el) => el.id !== possession_id));
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
          props.children[1] === 'Статус жилплощади'
        ) {
          return (
            <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
              <div className='flex items-center gap-x-1 justify-center'>
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

  const columns: ColumnsType<ILivingSpaceColumns> = [
    {
      title: '№',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Статус жилплощади',
      dataIndex: 'status',
      key: 'status',
      render: (approving_status: string) => (
        <span className='font-bold whitespace-nowrap'>{approving_status}</span>
      ),
    },
    {
      title: 'Адрес жил. площади',
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
        address: `${el.complex} ${el.building} [${el.type}] № ${el.name}`,
      }))}
      columns={columns}
      components={components}
      bordered
      pagination={false}
      loading={isInfoLoading}
      locale={{
        emptyText: <span className='font-bold text-lg'>Нет данных</span>,
      }}
      rowClassName='text-center bg-gray-200'
      style={{
        width: 'min-content',
      }}
    />
  );
};
