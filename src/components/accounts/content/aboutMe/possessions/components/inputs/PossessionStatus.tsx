import clsx from 'clsx';
import { ICitizenPossession } from '../../../../../../types';
import { FC } from 'react';
import { Input } from 'antd';

interface IProps {
  data: ICitizenPossession;
  form_id: number;
}

export const PossessionStatus: FC<IProps> = ({ data, form_id }) => {
  return (
    <div className='mt-2 text-sm'>
      <span>Статус собственности</span>
      {form_id < 1 && (
        <Input className='max-sm:h-[30px] h-[40px] border-blue-500 text-blue-500' value={'Новая'} />
      )}
      {form_id > 0 && (
        <Input
          className={clsx(
            'max-sm:h-[30px] h-[40px]',
            data.approving_status === 'На подтверждении' && ' text-amber-500 border-amber-500',
            data.approving_status === 'Отклонена' && ' text-red-500 border-red-500',
            data.approving_status === 'Подтверждена' && ' text-green-500 border-green-500',
          )}
          value={data.approving_status}
        />
      )}
    </div>
  );
};
