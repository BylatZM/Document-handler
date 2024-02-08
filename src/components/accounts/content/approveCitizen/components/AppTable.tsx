import { useState } from 'react';
import { Button, ConfigProvider, Table } from 'antd';
import clsx from 'clsx';
import { ColumnsType } from 'antd/es/table';
import { IUser } from '../../../../types';
import { FC } from 'react';
import { useLogout } from '../../../../hooks/useLogout';
import { useActions } from '../../../../hooks/useActions';
import {
  approveRequest,
  getCitizenByIdRequest,
  rejectApproveRequest,
} from '../../../../../api/requests/Person';
import { ImCross, ImSpinner9 } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';

interface IProps {
  tableItems: IUser[] | null;
  changeUserInfo: React.Dispatch<React.SetStateAction<IUser | null>>;
  changeIsFormActive: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IProcessingRow {
  row_id: number;
  operation: 'success' | 'error' | 'loading';
  button_type: 'approve' | 'information' | 'reject';
}

type TypeColumn = {
  key: number;
  last_name: string;
  first_name: string;
  status: string;
};

export const AppTable: FC<IProps> = ({ tableItems, changeUserInfo, changeIsFormActive }) => {
  const [processingRow, changeProcessingRow] = useState<null | IProcessingRow>(null);
  const logout = useLogout();

  const { notApprovedUsersSuccess, citizenSuccess } = useActions();

  const approve = async (user_id: number) => {
    if (!tableItems) return;

    changeProcessingRow({
      row_id: user_id,
      operation: 'loading',
      button_type: 'approve',
    });
    const response = await approveRequest(user_id, logout);
    if (response === 200) {
      changeProcessingRow((prev) => (prev ? { ...prev, operation: 'success' } : null));
      setTimeout(() => {
        changeProcessingRow((prev) => null);
        notApprovedUsersSuccess(tableItems.filter((el) => el.id !== user_id));
      }, 2000);
    } else changeProcessingRow((prev) => (prev ? { ...prev, operation: 'error' } : null));
  };

  const rejectApprove = async (user_id: number) => {
    if (!tableItems) return;

    changeProcessingRow({
      row_id: user_id,
      operation: 'loading',
      button_type: 'reject',
    });
    const response = await rejectApproveRequest(user_id, logout);
    if (response === 200 && tableItems) {
      changeProcessingRow((prev) => (prev ? { ...prev, operation: 'success' } : null));
      setTimeout(() => {
        changeProcessingRow((prev) => null);
        notApprovedUsersSuccess(
          tableItems.map((el) => {
            if (el.id === user_id) return { ...el, account_status: 'отклонен' };
            else return el;
          }),
        );
      }, 2000);
    } else changeProcessingRow((prev) => (prev ? { ...prev, operation: 'error' } : null));
  };

  const getPossessions = async (user_id: number, approving_user: IUser) => {
    changeProcessingRow({
      row_id: user_id,
      operation: 'loading',
      button_type: 'information',
    });

    const response = await getCitizenByIdRequest(logout, user_id);

    if (response && typeof response !== 'number') {
      changeProcessingRow((prev) => (prev ? { ...prev, operation: 'success' } : null));
      setTimeout(() => {
        changeProcessingRow((prev) => null);
        citizenSuccess(response);
        changeUserInfo(approving_user);
        changeIsFormActive(true);
      }, 2000);
    } else changeProcessingRow((prev) => (prev ? { ...prev, operation: 'error' } : null));
  };
  const components = {
    header: {
      cell: (props: { children: React.ReactNode }) => (
        <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>{props.children}</th>
      ),
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
      title: 'Статус аккаунта',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <span>{status}</span>,
    },
    {
      title: 'Подтвердить аккаунт',
      dataIndex: 'approve',
      key: 'approve',
      render: (item, rowData) => (
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
              if (!tableItems) return;
              approve(rowData.key);
            }}
            disabled={
              processingRow &&
              processingRow.row_id === rowData.key &&
              processingRow.button_type !== 'approve'
                ? true
                : false
            }
            className={clsx(
              'text-white h-[40px]',
              (!processingRow || (processingRow && processingRow.row_id !== rowData.key)) &&
                'bg-green-700',
              processingRow &&
                processingRow.operation === 'error' &&
                processingRow.row_id === rowData.key &&
                processingRow.button_type === 'approve' &&
                'bg-red-500',
              processingRow &&
                processingRow.operation === 'success' &&
                processingRow.row_id === rowData.key &&
                processingRow.button_type === 'approve' &&
                'bg-green-500',
              processingRow &&
                processingRow.operation === 'loading' &&
                processingRow.row_id === rowData.key &&
                processingRow.button_type === 'approve' &&
                'bg-blue-500',
            )}
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
              processingRow.operation === 'error' &&
              processingRow.row_id === rowData.key &&
              processingRow.button_type === 'approve' && (
                <div>
                  <ImCross className='inline mr-2' />
                  <span>Ошибка</span>
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
      title: 'Информация  об аккаунте',
      dataIndex: 'information',
      key: 'information',
      render: (item, rowData) => (
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
              if (!tableItems) return;
              const approvingUser = tableItems.filter((el) => el.id === rowData.key)[0];
              getPossessions(rowData.key, approvingUser);
            }}
            disabled={
              processingRow &&
              processingRow.row_id === rowData.key &&
              processingRow.button_type !== 'information'
                ? true
                : false
            }
            className={clsx(
              'text-white h-[40px]',
              (!processingRow || (processingRow && processingRow.row_id !== rowData.key)) &&
                'bg-blue-700',
              processingRow &&
                processingRow.operation === 'error' &&
                processingRow.row_id === rowData.key &&
                processingRow.button_type === 'information' &&
                'bg-red-500',
              processingRow &&
                processingRow.operation === 'success' &&
                processingRow.row_id === rowData.key &&
                processingRow.button_type === 'information' &&
                'bg-green-500',
              processingRow &&
                processingRow.operation === 'loading' &&
                processingRow.row_id === rowData.key &&
                processingRow.button_type === 'information' &&
                'bg-blue-500',
            )}
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
              processingRow.operation === 'error' &&
              processingRow.row_id === rowData.key &&
              processingRow.button_type === 'information' && (
                <div>
                  <ImCross className='inline mr-2' />
                  <span>Ошибка</span>
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
      title: 'Отклонить аккаунт',
      dataIndex: 'reject',
      key: 'reject',
      render: (item, rowData) => (
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
              rejectApprove(rowData.key);
            }}
            disabled={
              rowData.status === 'отклонена' ||
              (processingRow &&
                processingRow.row_id === rowData.key &&
                processingRow.button_type !== 'reject')
                ? true
                : false
            }
            className={clsx(
              'text-white h-[40px]',
              (!processingRow || (processingRow && processingRow.row_id !== rowData.key)) &&
                'bg-red-700',
              processingRow &&
                processingRow.operation === 'error' &&
                processingRow.row_id === rowData.key &&
                processingRow.button_type === 'reject' &&
                'bg-red-500',
              processingRow &&
                processingRow.operation === 'success' &&
                processingRow.row_id === rowData.key &&
                processingRow.button_type === 'reject' &&
                'bg-green-500',
              processingRow &&
                processingRow.operation === 'loading' &&
                processingRow.row_id === rowData.key &&
                processingRow.button_type === 'reject' &&
                'bg-blue-500',
            )}
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
              processingRow.operation === 'error' &&
              processingRow.row_id === rowData.key &&
              processingRow.button_type === 'reject' && (
                <div>
                  <ImCross className='inline mr-2' />
                  <span>Ошибка</span>
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
      dataSource={
        !tableItems
          ? undefined
          : tableItems.map((el) => ({
              key: el.id,
              last_name: el.last_name,
              first_name: el.first_name,
              status: el.account_status,
            }))
      }
      columns={columns}
      components={components}
      bordered
      pagination={false}
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
