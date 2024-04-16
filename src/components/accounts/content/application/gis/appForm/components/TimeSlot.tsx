import { Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { FC } from 'react';
import { IError, IGisApplication, IRole } from '../../../../../../types';
import { useActions } from '../../../../../../hooks/useActions';

interface IProps {
  data: IGisApplication;
  role: IRole;
  changeData: React.Dispatch<React.SetStateAction<IGisApplication>>;
  error: IError | null;
}

export const TimeSlot: FC<IProps> = ({ data, role, changeData, error }) => {
  const { applicationError } = useActions();
  const dateCalculator = (days: number, creatingDate: string): string => {
    const [dmy, hms] = creatingDate.split(' ');
    const currentDate = new Date(`${dmy.split('.').reverse().join('-')}T${hms}`);
    const futureDate = new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);

    const newDateStr = `
    ${futureDate.getDate() < 10 ? `0${futureDate.getDate()}` : futureDate.getDate()}.${
      futureDate.getMonth() + 1 < 10 ? `0${futureDate.getMonth() + 1}` : futureDate.getMonth() + 1
    }.${futureDate.getFullYear()} ${
      futureDate.getHours() < 10 ? `0${futureDate.getHours()}` : futureDate.getHours()
    }:${futureDate.getMinutes() < 10 ? `0${futureDate.getMinutes()}` : futureDate.getMinutes()}:${
      futureDate.getSeconds() < 10 ? `0${futureDate.getSeconds()}` : futureDate.getSeconds()
    }`.trim();

    return newDateStr;
  };

  return (
    <div className='flex max-md:flex-col max-md:flex-nowrap flex-wrap gap-y-2 justify-between'>
      <div className='flex flex-col gap-2 max-md:w-full w-[48%]'>
        <span>Плановое время поступления заявки</span>
        <Input
          className='h-[50px] text-base'
          value={!data.creating_date ? '' : data.creating_date}
          disabled
        />
      </div>
      <div className='flex flex-col gap-2 max-md:w-full w-[48%]'>
        <span>Фактическое время исполнения</span>
        <Input
          className='h-[50px] text-base'
          value={!data.due_date ? '' : data.due_date}
          disabled
        />
      </div>
      <div className='flex flex-col gap-2 w-[48%] max-md:w-full'>
        <span>Плановое время исполнения</span>
        <Input
          className='h-[50px] text-base'
          value={
            data.normative_in_hours
              ? dateCalculator(data.normative_in_hours.normative_in_hours / 24, data.creating_date)
              : ''
          }
          disabled
        />
      </div>
      <div className='flex flex-col gap-y-2 w-full'>
        <span>Комментарий диспетчера</span>
        <TextArea
          value={!data.dispatcher_comment ? undefined : data.dispatcher_comment}
          onChange={(e) => changeData((prev) => ({ ...prev, dispatcher_comment: e.target.value }))}
          className='rounded-md h-[60px] text-base'
          maxLength={500}
          rows={5}
          style={{ resize: 'none' }}
          disabled={role === 'executor' || data.status.appStatus === 'Закрыта' ? true : false}
        />
      </div>
      <div className='flex flex-col gap-2 w-full'>
        <span>Комментарий исполнителя</span>
        <TextArea
          value={!data.employee_comment ? undefined : data.employee_comment}
          onChange={(e) => {
            if (error) applicationError(null);
            changeData((prev) => ({ ...prev, employee_comment: e.target.value }));
          }}
          className='rounded-md h-[60px] text-base'
          maxLength={500}
          rows={5}
          status={error && error.type === 'employee_comment' ? 'error' : undefined}
          style={{ resize: 'none' }}
          disabled={role === 'dispatcher' || data.status.appStatus !== 'В работе' ? true : false}
        />
        {error && error.type === 'employee_comment' && (
          <span className='errorText'>{error.error}</span>
        )}
      </div>
    </div>
  );
};
