import { FC, useState } from 'react';
import { useLogout } from '../../../../hooks/useLogout';
import { INotApprovedCitizens } from '../../../../types';
import { Button, ConfigProvider } from 'antd';
import clsx from 'clsx';
import { ImSpinner9 } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';
import Table, { ColumnsType } from 'antd/es/table';
import { approveCitizenRequest, rejectCitizenRequest } from '../../../../../api/requests/Person';
import { FaArrowDownShortWide } from 'react-icons/fa6';
import { IoFunnel } from 'react-icons/io5';

interface IProps {
  tableInfo: INotApprovedCitizens[];
  changeTableInfo: React.Dispatch<React.SetStateAction<INotApprovedCitizens[]>>;
  isInfoLoading: boolean;
}

interface IProcessingRow {
  row_id: number;
  operation: 'success' | 'loading';
  button_type: 'approve' | 'reject';
}

type IColumnProps = Omit<INotApprovedCitizens, 'id'> & { key: number };

export const AppTable: FC<IProps> = ({ tableInfo, changeTableInfo, isInfoLoading }) => {
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

  const makeApproveRequest = async (citizen_id: number) => {
    if (!tableInfo.length) return;

    changeProcessingRow({
      row_id: citizen_id,
      operation: 'loading',
      button_type: 'approve',
    });
    const response = await approveCitizenRequest(logout, citizen_id.toString());
    if (response === 200) {
      changeProcessingRow((prev) => (prev ? { ...prev, operation: 'success' } : null));
      setTimeout(() => {
        changeTableInfo(tableInfo.filter((el) => el.id !== citizen_id));
        changeProcessingRow((prev) => null);
      }, 2000);
    }
  };

  const makeRejectRequest = async (citizen_id: number) => {
    if (!tableInfo) return;

    changeProcessingRow({
      row_id: citizen_id,
      operation: 'loading',
      button_type: 'reject',
    });
    const response = await rejectCitizenRequest(logout, citizen_id.toString());
    if (response === 200 && tableInfo) {
      changeProcessingRow((prev) => (prev ? { ...prev, operation: 'success' } : null));
      setTimeout(() => {
        changeTableInfo(
          tableInfo.map((el) => {
            if (el.id === citizen_id) return { ...el, approving_status: 'Отклонена' };
            else return el;
          }),
        );
        changeProcessingRow((prev) => null);
      }, 2000);
    }
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
          props.children[1] === 'Статус заявки'
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
          <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>
            {props.children}
          </th>
        );
      },
    },
  };

  const columns: ColumnsType<IColumnProps> = [
    {
      title: '№',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Статус заявки',
      dataIndex: 'approving_status',
      key: 'approving_status',
      render: (approving_status: string) => (
        <span className='font-bold whitespace-nowrap'>{approving_status}</span>
      ),
    },
    {
      title: 'Лицевой счет',
      dataIndex: 'personal_account',
      key: 'personal_account',
    },
    {
      title: 'Тип собственности',
      dataIndex: 'possessionType',
      key: 'possessionType',
    },
    {
      title: 'Статус собственника',
      dataIndex: 'ownershipStatus',
      key: 'ownershipStatus',
    },
    {
      title: 'Название жилого комплекса',
      dataIndex: 'complex',
      key: 'complex',
    },
    {
      title: 'Адрес здания',
      dataIndex: 'building',
      key: 'building',
    },
    {
      title: 'Наименование собственности',
      dataIndex: 'possession',
      key: 'possession',
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
              makeApproveRequest(rowData.key);
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
              makeRejectRequest(rowData.key);
            }}
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
        personal_account: el.personal_account,
        possessionType: el.possessionType,
        ownershipStatus: el.ownershipStatus,
        complex: el.complex,
        building: el.building,
        possession: el.possession,
      }))}
      columns={columns}
      components={components}
      loading={isInfoLoading}
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
