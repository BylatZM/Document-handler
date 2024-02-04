import { FC, useState } from 'react';
import { useLogout } from '../../../hooks/useLogout';
import { useActions } from '../../../hooks/useActions';
import {
  approvePossessionRequest,
  rejectPossessionRequest,
} from '../../../../api/requests/Possession';
import { INotApprovedPossessions } from '../../../types';
import { Button, ConfigProvider } from 'antd';
import clsx from 'clsx';
import { ImCross, ImSpinner9 } from 'react-icons/im';
import { HiOutlineCheck } from 'react-icons/hi';
import Table, { ColumnsType } from 'antd/es/table';

interface IProps {
  tableItems: INotApprovedPossessions[] | null;
}

type IColumnProps = Omit<INotApprovedPossessions, 'id'> & { key: number };

export const AppTable: FC<IProps> = ({ tableItems }) => {
  const logout = useLogout();
  const [errorButton, changeErrorButton] = useState<null | 'approve' | 'info' | 'reject'>(null);
  const [loadingButton, changeLoadingButton] = useState<null | 'approve' | 'info' | 'reject'>(null);
  const [successButton, changeSuccessButton] = useState<null | 'approve' | 'info' | 'reject'>(null);

  const { notApprovedPossessionSuccess } = useActions();

  const approve = async (possession_id: number) => {
    if (!tableItems) return;

    if (errorButton) changeErrorButton((prev) => null);
    changeLoadingButton((prev) => 'approve');
    const response = await approvePossessionRequest(logout, possession_id.toString());
    changeLoadingButton((prev) => null);
    if (response === 200) {
      changeSuccessButton((prev) => 'approve');
      setTimeout(() => {
        notApprovedPossessionSuccess(tableItems.filter((el) => el.id !== possession_id));
        changeSuccessButton((prev) => null);
      }, 2000);
    } else {
      changeErrorButton((prev) => 'approve');
    }
  };

  const rejectApprove = async (possession_id: number) => {
    if (!tableItems) return;

    if (errorButton) changeErrorButton((prev) => null);
    changeLoadingButton((prev) => 'reject');
    const response = await rejectPossessionRequest(logout, possession_id.toString());
    changeLoadingButton((prev) => null);
    if (response === 200 && tableItems) {
      changeSuccessButton((prev) => 'reject');
      setTimeout(() => {
        changeSuccessButton((prev) => null);
        notApprovedPossessionSuccess(
          tableItems.map((el) => {
            if (el.id === possession_id) return { ...el, approving_status: 'отклонена' };
            else return el;
          }),
        );
      }, 2000);
    } else {
      changeErrorButton((prev) => 'reject');
    }
  };

  const components = {
    header: {
      cell: (props: { children: React.ReactNode }) => (
        <th style={{ background: '#000', color: '#fff', textAlign: 'center' }}>{props.children}</th>
      ),
    },
  };

  const columns: ColumnsType<IColumnProps> = [
    {
      title: '№',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Тип собственности',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Статус собственности',
      dataIndex: 'approving_status',
      key: 'approving_status',
    },
    {
      title: 'Адрес здания',
      dataIndex: 'building',
      key: 'building',
      render: (status: string) => <span>{status}</span>,
    },
    {
      title: 'Наименование собственности',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Подтвердить собственность',
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
      title: 'Отклонить собственность',
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
            disabled={
              (loadingButton && loadingButton !== 'reject') ||
              rowData.approving_status === 'отклонена'
                ? true
                : false
            }
            className={clsx(
              'text-white h-[40px]',
              errorButton !== 'reject' && successButton !== 'reject' && 'bg-red-700',
              errorButton === 'reject' && !successButton && !loadingButton && 'bg-red-500',
              !errorButton && successButton === 'reject' && !loadingButton && 'bg-green-500',
            )}
            onClick={() => {
              rejectApprove(rowData.key);
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
              key: el.id,
              type: el.type,
              building: el.building,
              approving_status: el.approving_status,
              address: el.address,
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
