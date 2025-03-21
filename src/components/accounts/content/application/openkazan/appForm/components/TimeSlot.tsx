import { Input } from 'antd';
import { FC } from 'react';
import { IError, IOpenKazanApplication } from '../../../../../../types';
import { useActions } from '../../../../../../hooks/useActions';

const {TextArea} = Input

interface IProps {
  data: IOpenKazanApplication;
  error: IError | null;
  role: string
  changeData: React.Dispatch<React.SetStateAction<IOpenKazanApplication>>;
}

export const TimeSlot: FC<IProps> = ({ data, error, role, changeData }) => {
  const { applicationError } = useActions();
  return (
    <div className='flex flex-col gap-y-2'>
      <span className='font-bold text-lg mt-2'>Промежутки времени</span>
      <div className='flex max-md:flex-col max-md:flex-nowrap flex-wrap gap-y-2 justify-between'>
        <div className='flex flex-col gap-2 max-md:w-full w-[48%]'>
          <span>Плановая дата поступления заявки</span>
          <Input
            className='h-[50px] text-base'
            value={!data.created_date ? '' : data.created_date}
            disabled
          />
        </div>
        <div className='flex flex-col gap-2 max-md:w-full w-[48%]'>
          <span>Фактическая дата исполнения</span>
          <Input
            className='h-[50px] text-base'
            value={data.due_date ?? ''}
            disabled
          />
        </div>
        <div className='flex flex-col gap-2 w-[48%] max-md:w-full'>
          <span>Плановая дата исполнения</span>
          <Input
            className='h-[50px] text-base'
            value={!data.deadline ? '' : data.deadline}
            disabled
          />
        </div>
      </div>
      <span className='font-bold text-lg mt-2'>Комментарии</span>
      <div className='flex flex-col gap-y-2 w-full'>
        <span>Комментарий диспетчера</span>
        <TextArea
          value={data.dispatcher_comment}
          onChange={(e) => {
            if (error && error.type === 'dispatcher_comment') applicationError(null);
            changeData((prev) => ({ ...prev, dispatcher_comment: e.target.value }));
          }}
          className='rounded-md h-[60px] text-base'
          maxLength={500}
          rows={5}
          status={error && error.type === 'dispatcher_comment' ? 'error' : undefined}
          style={{ resize: 'none' }}
          disabled={
            role === 'executor' ||
            ['Новая', 'В работе', 'Закрыта'].some(el => el === data.status.name)
              ? true
              : false
          }
        />
        {error && error.type === 'dispatcher_comment' && (
          <span className='errorText'>{error.error}</span>
        )}
      </div>
      <div className='flex flex-col gap-2 w-full'>
        <span>Комментарий исполнителя</span>
        <TextArea
          value={data.employee_comment}
          onChange={(e) => {
            if (error && error.type === 'employee_comment') applicationError(null);
            changeData((prev) => ({ ...prev, employee_comment: e.target.value }));
          }}
          className='rounded-md h-[60px] text-base'
          maxLength={500}
          rows={5}
          status={error && error.type === 'employee_comment' ? 'error' : undefined}
          style={{ resize: 'none' }}
          disabled={role === 'dispatcher' || data.status.name !== 'В работе' ? true : false}
        />
        {error && error.type === 'employee_comment' && (
          <span className='errorText'>{error.error}</span>
        )}
      </div>
    </div>
  );
};
