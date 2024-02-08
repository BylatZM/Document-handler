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

interface IProcessingRow {
  row_id: number;
  operation: 'success' | 'error' | 'loading';
  button_type: 'approve' | 'reject';
}

type IColumnProps = Omit<INotApprovedPossessions, 'id'> & { key: number };

export const AppTable: FC<IProps> = ({ tableItems }) => {
  const logout = useLogout();
  const [processingRow, changeProcessingRow] = useState<null | IProcessingRow>(null);

  const { notApprovedPossessionSuccess } = useActions();

  const approve = async (possession_id: number) => {
    if (!tableItems) return;

    changeProcessingRow({
      row_id: possession_id,
      operation: 'loading',
      button_type: 'approve',
    });
    const response = await approvePossessionRequest(logout, possession_id.toString());
    if (response === 200) {
      changeProcessingRow((prev) => (prev ? { ...prev, operation: 'success' } : null));
      setTimeout(() => {
        notApprovedPossessionSuccess(tableItems.filter((el) => el.id !== possession_id));
        changeProcessingRow((prev) => null);
      }, 2000);
    } else changeProcessingRow((prev) => (prev ? { ...prev, operation: 'error' } : null));
  };

  const rejectApprove = async (possession_id: number) => {
    if (!tableItems) return;

    changeProcessingRow({
      row_id: possession_id,
      operation: 'loading',
      button_type: 'reject',
    });
    const response = await rejectPossessionRequest(logout, possession_id.toString());
    if (response === 200 && tableItems) {
      changeProcessingRow((prev) => (prev ? { ...prev, operation: 'success' } : null));
      setTimeout(() => {
        notApprovedPossessionSuccess(
          tableItems.map((el) => {
            if (el.id === possession_id) return { ...el, approving_status: 'отклонена' };
            else return el;
          }),
        );
        changeProcessingRow((prev) => null);
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
            onClick={() => {
              rejectApprove(rowData.key);
            }}
            disabled={
              rowData.approving_status === 'отклонена' ||
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
