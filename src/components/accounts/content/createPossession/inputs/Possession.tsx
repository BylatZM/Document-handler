import { Input } from 'antd';
import { FC } from 'react';
import { IApprovePossession, IError } from '../../../../types';

interface IProps {
  data: IApprovePossession;
  changeData: React.Dispatch<React.SetStateAction<IApprovePossession>>;
  error: IError | null;
}

export const Possession: FC<IProps> = ({ data, changeData, error }) => {
  return (
    <div className='text-sm'>
      <div>Наименование квартиры (Наименование собственности)</div>
      <Input
        maxLength={60}
        value={data.name}
        disabled={!data.building}
        placeholder='34'
        onChange={(e) =>
          changeData((prev) => ({
            ...prev,
            name: e.target.value,
          }))
        }
      />
      {error && error.type === 'possession' && <div className='errorText'>{error.error}</div>}
    </div>
  );
};
