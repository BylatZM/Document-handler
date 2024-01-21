import { useCallback, useMemo, useState } from 'react';
import { Button, ConfigProvider, Table } from 'antd';
import clsx from 'clsx';
import { ColumnsType } from 'antd/es/table';
import { INotApproved } from '../../../../../../types';
import { FC } from 'react';
import { useLogout } from '../../../../../../hooks/useLogout';
import { useActions } from '../../../../../../hooks/useActions';
import {
  approveRequest,
  getCitizenByIdRequest,
  rejectApproveRequest,
} from '../../../../../../../api/requests/Person';
import { ImCross, ImSpinner9 } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';

interface IProps {
  tableItems: INotApproved[] | null;
  changeUserInfo: React.Dispatch<React.SetStateAction<INotApproved | null>>;
  changeIsFormActive: React.Dispatch<React.SetStateAction<boolean>>;
}

type TypeColumn = {
  number: number;
  last_name: string;
  first_name: string;
  status: string;
};

export const ApplicationsTable: FC<IProps> = ({
  tableItems,
  changeUserInfo,
  changeIsFormActive,
}) => {
  const logout = useLogout();
  const [errorButton, changeErrorButton] = useState<null | 'approve' | 'info' | 'reject'>(null);
  const [loadingButton, changeLoadingButton] = useState<null | 'approve' | 'info' | 'reject'>(null);
  const [successButton, changeSuccessButton] = useState<null | 'approve' | 'info' | 'reject'>(null);

  const { deleteNotApprovedUsers, notApprovedSuccess, citizenSuccess, citizenLoading } =
    useActions();

  const approve = async (user_id: number, application_id: number) => {
    if (errorButton) changeErrorButton((prev) => null);
    changeLoadingButton((prev) => 'approve');
    const response = await approveRequest(user_id, logout);
    changeLoadingButton((prev) => null);
    if (response === 200) {
      changeSuccessButton((prev) => 'approve');
      setTimeout(() => {
        changeSuccessButton((prev) => null);
        deleteNotApprovedUsers(application_id);
      }, 2000);
    } else {
      changeErrorButton((prev) => 'approve');
    }
  };

  const rejectApprove = async (id: number) => {
    if (!tableItems) return;

    if (errorButton) changeErrorButton((prev) => null);
    changeLoadingButton((prev) => 'reject');
    const response = await rejectApproveRequest(id, logout);
    changeLoadingButton((prev) => null);
    if (response === 200 && tableItems) {
      changeSuccessButton((prev) => 'reject');
      setTimeout(() => {
        changeSuccessButton((prev) => null);
        notApprovedSuccess(
          tableItems.map((el) => {
            if (el.id === id) return { ...el, status: 'отклонена' };
            else return el;
          }),
        );
      }, 2000);
    } else {
      changeErrorButton((prev) => 'reject');
    }
  };

  const getPossessions = async (id: number, approvingUser: INotApproved) => {
    if (errorButton) changeErrorButton((prev) => null);
    changeLoadingButton((prev) => 'info');
    citizenLoading({ form_id: 0, isLoading: true });
    const response = await getCitizenByIdRequest(logout, id);
    changeLoadingButton((prev) => null);
    if (response && typeof response !== 'number') {
      changeSuccessButton((prev) => 'info');
      setTimeout(() => {
        changeSuccessButton((prev) => null);
        citizenSuccess(response);
        changeUserInfo(approvingUser);
        changeIsFormActive(true);
      }, 2000);
    } else {
      changeErrorButton((prev) => 'info');
    }
    citizenLoading({ form_id: 0, isLoading: false });
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
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Фамилия жителя',
      dataIndex: 'last_name',
      key: 'last_name',
    },
    {
      title: 'Имя жителя',
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
      title: 'Статус заявки',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span
          className={clsx(
            'p-2 text-white rounded-md',
            status === 'отклонена' && 'bg-red-500',
            status === 'новая' && 'bg-blue-500',
          )}
        >
          {status}
        </span>
      ),
    },
    {
      title: 'Подтвердить жителя',
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
              approve(
                tableItems.filter((el) => el.id === rowData.number)[0].user.id,
                rowData.number,
              );
            }}
            disabled={loadingButton && loadingButton !== 'approve' ? true : false}
            className={clsx(
              'text-white h-[40px]',
              errorButton !== 'approve' && successButton !== 'approve' && 'bg-green-700',
              errorButton === 'approve' && !successButton && !loadingButton && 'bg-red-500',
              !errorButton && successButton === 'approve' && !loadingButton && 'bg-green-500',
            )}
          >
            {loadingButton === 'approve' && (
              <div>
                <ImSpinner9 className='inline animate-spin mr-2' />
                <span>Обработка</span>
              </div>
            )}
            {errorButton === 'approve' && !loadingButton && !successButton && (
              <div>
                <ImCross className='inline mr-2' />
                <span>Отказано</span>
              </div>
            )}
            {!loadingButton && !errorButton && successButton === 'approve' && (
              <div>
                <HiOutlineCheck className='inline mr-2 font-bold text-lg' />
                <span>Успешно</span>
              </div>
            )}
            {loadingButton !== 'approve' &&
              errorButton !== 'approve' &&
              successButton !== 'approve' && <>Подтвердить</>}
          </Button>
        </ConfigProvider>
      ),
    },
    {
      title: 'Информация  о жителе',
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
            disabled={loadingButton && loadingButton !== 'info' ? true : false}
            className={clsx(
              'text-white h-[40px]',
              errorButton !== 'info' && successButton !== 'info' && 'bg-blue-500',
              errorButton === 'info' && !successButton && !loadingButton && 'bg-red-500',
              !errorButton && successButton === 'info' && !loadingButton && 'bg-green-500',
            )}
            onClick={() => {
              if (!tableItems) return;
              const approvingUser = tableItems.filter((el) => el.id === rowData.number)[0];
              getPossessions(approvingUser.user.id, approvingUser);
            }}
          >
            {loadingButton === 'info' && (
              <div>
                <ImSpinner9 className='inline animate-spin mr-2' />
                <span>Обработка</span>
              </div>
            )}
            {errorButton === 'info' && !loadingButton && !successButton && (
              <div>
                <ImCross className='inline mr-2' />
                <span>Отказано</span>
              </div>
            )}
            {!loadingButton && !errorButton && successButton === 'info' && (
              <div>
                <HiOutlineCheck className='inline mr-2 font-bold text-lg' />
                <span>Успешно</span>
              </div>
            )}
            {loadingButton !== 'info' && errorButton !== 'info' && successButton !== 'info' && (
              <>Информация</>
            )}
          </Button>
        </ConfigProvider>
      ),
    },
    {
      title: 'Отклонить заявку',
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
            disabled={loadingButton && loadingButton !== 'reject' ? true : false}
            className={clsx(
              'text-white h-[40px]',
              errorButton !== 'reject' && successButton !== 'reject' && 'bg-red-700',
              errorButton === 'reject' && !successButton && !loadingButton && 'bg-red-500',
              !errorButton && successButton === 'reject' && !loadingButton && 'bg-green-500',
            )}
            onClick={() => {
              rejectApprove(rowData.number);
            }}
          >
            {loadingButton === 'reject' && (
              <div>
                <ImSpinner9 className='inline animate-spin mr-2' />
                <span>Обработка</span>
              </div>
            )}
            {errorButton === 'reject' && !loadingButton && !successButton && (
              <div>
                <ImCross className='inline mr-2' />
                <span>Отказано</span>
              </div>
            )}
            {!loadingButton && !errorButton && successButton === 'reject' && (
              <div>
                <HiOutlineCheck className='inline mr-2 font-bold text-lg' />
                <span>Успешно</span>
              </div>
            )}
            {loadingButton !== 'reject' &&
              errorButton !== 'reject' &&
              successButton !== 'reject' && <>Отклонить</>}
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
              number: el.id,
              last_name: el.user.last_name,
              first_name: el.user.first_name,
              status: el.status,
            }))
      }
      columns={columns}
      components={components}
      bordered
      pagination={false}
      locale={{
        emptyText: <span className='font-bold text-lg'>Нет данных</span>,
      }}
      rowClassName='text-center'
      style={{
        width: '800px',
      }}
    />
  );
};
