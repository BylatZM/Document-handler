import { Input } from 'antd';
import { FC } from 'react';
import { IApprovePossession, IError } from '../../types';

interface IProps {
  data: IApprovePossession;
  changeData: React.Dispatch<React.SetStateAction<IApprovePossession>>;
  error: IError | null;
}

export const Possession: FC<IProps> = ({ data, changeData, error }) => {
  return (
    <div className='text-sm'>
      <div>Номер квартиры (номер собственности)</div>
      <Input
        maxLength={8}
        value={data.possession.address}
        disabled={!data.building}
        placeholder='34'
        onChange={(e) =>
          changeData((prev) => ({
            ...prev,
            possession: { ...prev.possession, address: e.target.value },
          }))
        }
      />
      {error && error.type === 'possession' && <div className='errorText'>{error.error}</div>}
    </div>
  );
};
