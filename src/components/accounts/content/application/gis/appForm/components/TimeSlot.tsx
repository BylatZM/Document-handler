import { Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { FC } from 'react';
import { IError, IGisApplication } from '../../../../../../types';
import { useActions } from '../../../../../../hooks/useActions';

interface IProps {
  data: IGisApplication;
  role: string;
  changeData: React.Dispatch<React.SetStateAction<IGisApplication>>;
  error: IError | null;
}

export const TimeSlot: FC<IProps> = ({ data, role, changeData, error }) => {
  const { applicationError } = useActions();
  const dateCalculator = (days: number, creatingDate: string): string => {
    const currentDate = new Date(`${creatingDate.split('.').reverse().join('-')}`);
    const futureDate = new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);

    const newDateStr = `
    ${futureDate.getDate() < 10 ? `0${futureDate.getDate()}` : futureDate.getDate()}.${
      futureDate.getMonth() + 1 < 10 ? `0${futureDate.getMonth() + 1}` : futureDate.getMonth() + 1
    }.${futureDate.getFullYear()}`.trim();

    return newDateStr;
  };

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
            value={!data.due_date ? '' : data.due_date}
            disabled
          />
        </div>
        <div className='flex flex-col gap-2 w-[48%] max-md:w-full'>
          <span>Плановая дата исполнения</span>
          <Input
            className='h-[50px] text-base'
            value={
              data.subtype
                ? dateCalculator(!data.normative ? 0 : data.normative / 24, data.created_date)
                : ''
            }
            disabled
          />
        </div>
      </div>
      <span className='font-bold text-lg mt-2'>Комментарии</span>
      <div className='flex flex-col gap-y-2 w-full'>
        <span>Комментарий диспетчера</span>
        <TextArea
          value={!data.dispatcher_comment ? undefined : data.dispatcher_comment}
          onChange={(e) => {
            if (error && error.type === 'dispatcher_comment') applicationError(null);
            changeData((prev) => ({ ...prev, dispatcher_comment: e.target.value }));
          }}
          className='rounded-md h-[60px] text-base'
          maxLength={500}
          rows={5}
          status={error && error.type === 'dispatcher_comment' ? 'error' : undefined}
          style={{ resize: 'none' }}
          disabled={role === 'executor' || data.status.name === 'Закрыта' ? true : false}
        />
        {error && error.type === 'dispatcher_comment' && (
          <span className='errorText'>{error.error}</span>
        )}
      </div>
      <div className='flex flex-col gap-2 w-full'>
        <span>Комментарий исполнителя</span>
        <TextArea
          value={!data.employee_comment ? undefined : data.employee_comment}
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
