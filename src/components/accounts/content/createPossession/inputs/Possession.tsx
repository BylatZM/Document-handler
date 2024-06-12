import { Input } from 'antd';
import { FC } from 'react';
import { IApprovePossession, IError } from '../../../../types';

interface IProps {
  data: IApprovePossession;
  changeData: React.Dispatch<React.SetStateAction<IApprovePossession>>;
  error: IError | null;
  changeError: React.Dispatch<React.SetStateAction<IError | null>>;
}

export const Possession: FC<IProps> = ({ data, changeData, error, changeError }) => {
  return (
    <div className='text-sm'>
      <div>Наименование квартиры (Наименование собственности)</div>
      <Input
        className='max-sm:h-[30px] h-[40px]'
        maxLength={60}
        value={data.name}
        disabled={!data.building}
        status={error && error.type === 'possession' ? 'error' : undefined}
        placeholder='34'
        onChange={(e) => {
          if (error && error.type === 'possession') changeError(null);
          changeData((prev) => ({
            ...prev,
            name: e.target.value,
          }));
        }}
      />
      {error && error.type === 'possession' && <div className='errorText'>{error.error}</div>}
    </div>
  );
};
