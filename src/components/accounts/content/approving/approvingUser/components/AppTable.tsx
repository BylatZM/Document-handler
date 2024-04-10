import { useState } from 'react';
import { Button, ConfigProvider, Table } from 'antd';
import clsx from 'clsx';
import { ColumnsType } from 'antd/es/table';
import { INotApprovedUsers, IUserAccountStatus, IUserDetailsInfo } from '../../../../../types';
import { FC } from 'react';
import { useLogout } from '../../../../../hooks/useLogout';
import {
  approveUserRequest,
  getUserDetailsInfoRequest,
  rejectUserRequest,
} from '../../../../../../api/requests/Person';
import { ImSpinner9 } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';
import { FaArrowDownShortWide } from 'react-icons/fa6';
import { IoFunnel } from 'react-icons/io5';

interface IProps {
  tableInfo: INotApprovedUsers[];
  changeTableInfo: React.Dispatch<React.SetStateAction<INotApprovedUsers[]>>;
  changeUserInfo: React.Dispatch<React.SetStateAction<IUserDetailsInfo | null>>;
  changeIsFormActive: React.Dispatch<React.SetStateAction<boolean>>;
  isTableLoading: boolean;
}

interface IProcessingRow {
  row_id: number;
  operation: 'success' | 'loading';
  button_type: 'approve' | 'information' | 'reject';
}

type TypeColumn = {
  key: number;
  last_name: string;
  first_name: string;
  account_status: string;
};

export const AppTable: FC<IProps> = ({
  tableInfo,
  changeTableInfo,
  changeUserInfo,
  changeIsFormActive,
  isTableLoading,
}) => {
  const [processingRow, changeProcessingRow] = useState<null | IProcessingRow>(null);
  const logout = useLogout();
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
          if (a.account_status === 'На подтверждении' && b.account_status === 'Отклонен') {
            return -1;
          } else if (a.account_status === 'Отклонен' && b.account_status === 'На подтверждении') {
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
          if (b.account_status === 'На подтверждении' && a.account_status === 'Отклонен') {
            return -1;
          } else if (b.account_status === 'Отклонен' && a.account_status === 'На подтверждении') {
            return 1;
          } else {
            return 0;
          }
        }),
      );
    }
  };

  const makeApproveRequest = async (user_id: number) => {
    if (!tableInfo) return;

    changeProcessingRow({
      row_id: user_id,
      operation: 'loading',
      button_type: 'approve',
    });
    const response = await approveUserRequest(user_id, logout);
    if (response === 200) {
      changeProcessingRow((prev) => (prev ? { ...prev, operation: 'success' } : null));
      setTimeout(() => {
        changeProcessingRow((prev) => null);
        changeTableInfo(tableInfo.filter((el) => el.id !== user_id));
      }, 2000);
    }
  };

  const makeRejectRequest = async (user_id: number) => {
    if (!tableInfo) return;

    changeProcessingRow({
      row_id: user_id,
      operation: 'loading',
      button_type: 'reject',
    });
    const response = await rejectUserRequest(user_id, logout);
    if (response === 200 && tableInfo) {
      changeProcessingRow((prev) => (prev ? { ...prev, operation: 'success' } : null));
      setTimeout(() => {
        changeProcessingRow((prev) => null);
        changeTableInfo(
          tableInfo.map((el) => {
            if (el.id === user_id) return { ...el, account_status: 'Отклонен' };
            else return el;
          }),
        );
      }, 2000);
    }
  };

  const getUserInfo = async (user_id: number) => {
    changeProcessingRow({
      row_id: user_id,
      operation: 'loading',
      button_type: 'information',
    });

    const response = await getUserDetailsInfoRequest(user_id.toString(), logout);

    if (response && typeof response !== 'number') {
      changeProcessingRow((prev) => (prev ? { ...prev, operation: 'success' } : null));
      changeUserInfo(response);
      setTimeout(() => {
        changeProcessingRow((prev) => null);
        changeIsFormActive(true);
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

        if (props.children && Array.isArray(props.children) && props.children[1] === 'Статус') {
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

  const columns: ColumnsType<TypeColumn> = [
    {
      title: '№',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Фамилия',
      dataIndex: 'last_name',
      key: 'last_name',
    },
    {
      title: 'Имя',
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
      title: 'Статус',
      dataIndex: 'account_status',
      key: 'account_status',
      render: (account_status: IUserAccountStatus) => (
        <span className='font-bold whitespace-nowrap'>{account_status}</span>
      ),
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
      title: 'Подробная информация',
      dataIndex: 'information',
      key: 'information',
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
              getUserInfo(rowData.key);
            }}
            disabled={processingRow && processingRow.row_id === rowData.key ? true : false}
            className='text-white h-[40px] bg-blue-700'
          >
            {processingRow &&
              processingRow.operation === 'loading' &&
              processingRow.row_id === rowData.key &&
              processingRow.button_type === 'information' && (
                <div>
                  <ImSpinner9 className='inline animate-spin mr-2' />
                  <span>Обработка</span>
                </div>
              )}
            {processingRow &&
              processingRow.operation === 'success' &&
              processingRow.row_id === rowData.key &&
              processingRow.button_type === 'information' && (
                <div>
                  <HiOutlineCheck className='inline mr-2 font-bold text-lg' />
                  <span>Успешно</span>
                </div>
              )}
            {(!processingRow ||
              (processingRow &&
                (processingRow.row_id !== rowData.key ||
                  (processingRow.row_id === rowData.key &&
                    processingRow.button_type !== 'information')))) && <>Информация</>}
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
              rowData.account_status === 'Отклонен' ||
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
        last_name: el.last_name,
        first_name: el.first_name,
        account_status: el.account_status,
      }))}
      columns={columns}
      components={components}
      bordered
      loading={isTableLoading}
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
