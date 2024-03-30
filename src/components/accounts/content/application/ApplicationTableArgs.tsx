import clsx from 'clsx';
import { IApplicationCitizenColumns, IApplicationNotCitizenColumns } from '../../../types';
import { ColumnsType } from 'antd/es/table';

export const defaultCitizenColumns: ColumnsType<IApplicationCitizenColumns> = [
  {
    title: '№',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: 'Дата создания',
    dataIndex: 'creating_date',
    key: 'creating_date',
  },
  {
    title: 'Тип заявки',
    dataIndex: 'app_type',
    key: 'app_type',
  },
  {
    title: 'Подтип заявки',
    dataIndex: 'app_subtype',
    key: 'app_subType',
    render: (subtype) => (
      <div className='overflow-hidden max-w-[150px] text-ellipsis'>{subtype}</div>
    ),
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <span
        className={clsx(
          'text-white p-2 rounded-lg',
          status === 'В работе' && 'bg-blue-700',
          status === 'Новая' && 'bg-green-400',
          status === 'Назначена' && 'bg-green-600',
          status === 'Возвращена' && 'bg-amber-500',
          status === 'Закрыта' && 'bg-red-500',
        )}
      >
        {status}
      </span>
    ),
  },
  {
    title: 'Время закрытия',
    dataIndex: 'due_date',
    key: 'due_date',
  },
  {
    title: 'Краткое содержание',
    dataIndex: 'citizen_comment',
    key: 'citizen_comment',
    render: (citizen_comment: string) => (
      <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
        {citizen_comment}
      </div>
    ),
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
    render: (building: string) => (
      <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
        {building}
      </div>
    ),
  },
  {
    title: 'Наименование собственности',
    dataIndex: 'possession',
    key: 'possession',
    render: (possession: string) => (
      <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
        {possession}
      </div>
    ),
  },
];

export const defaultNotCitizenColumns: ColumnsType<IApplicationNotCitizenColumns> = [
  {
    title: '№',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: 'Заявку создал',
    dataIndex: 'creator',
    key: 'creator',
  },
  {
    title: 'Дата создания',
    dataIndex: 'creating_date',
    key: 'creating_date',
  },
  {
    title: 'Тип заявки',
    dataIndex: 'app_type',
    key: 'app_type',
  },
  {
    title: 'Подтип заявки',
    dataIndex: 'app_subtype',
    key: 'app_subType',
    render: (subtype) => (
      <div className='overflow-hidden max-w-[150px] text-ellipsis'>{subtype.name}</div>
    ),
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <span
        className={clsx(
          'text-white p-2 rounded-lg',
          status === 'В работе' && 'bg-blue-700',
          status === 'Новая' && 'bg-green-400',
          status === 'Назначена' && 'bg-green-600',
          status === 'Возвращена' && 'bg-amber-500',
          status === 'Закрыта' && 'bg-red-500',
        )}
      >
        {status}
      </span>
    ),
  },
  {
    title: 'Время закрытия',
    dataIndex: 'due_date',
    key: 'due_date',
  },
  {
    title: 'Краткое содержание',
    dataIndex: 'citizen_comment',
    key: 'citizen_comment',
    render: (citizen_comment: string) => (
      <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
        {citizen_comment}
      </div>
    ),
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
    render: (building: string) => (
      <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
        {building}
      </div>
    ),
  },
  {
    title: 'Наименование собственности',
    dataIndex: 'possession',
    key: 'possession',
    render: (possession: string) => (
      <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
        {possession}
      </div>
    ),
  },
  {
    title: 'Сотрудник',
    dataIndex: 'employee',
    key: 'employee',
    render: (employee: string) => (
      <div className='max-w-[180px] max-h-[80px] mx-auto overflow-hidden text-ellipsis leading-[15px]'>
        {employee}
      </div>
    ),
  },
];
