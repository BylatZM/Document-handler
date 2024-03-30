import clsx from 'clsx';
import { ICitizen } from '../../../../../../types';
import { FC } from 'react';

interface IProps {
  data: ICitizen;
  form_id: number;
}

export const PossessionStatus: FC<IProps> = ({ data, form_id }) => {
  return (
    <div className='mt-2 text-sm flex justify-between items-center'>
      <span>Статус собственности</span>
      {form_id < 1 && <span className=' underline text-sm font-bold text-blue-500'>Новая</span>}
      {form_id > 0 && (
        <span
          className={clsx(
            'underline text-sm font-bold',
            data.approving_status === 'На подтверждении' && ' text-amber-500',
            data.approving_status === 'Отклонена' && ' text-red-500',
            data.approving_status === 'Подтверждена' && ' text-green-500',
          )}
        >
          {data.approving_status}
        </span>
      )}
    </div>
  );
};
