import { Button } from 'antd';
import { Possessions } from './components/Possessions';
import { useActions } from '../../../../hooks/useActions';
import { FC, useState } from 'react';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { IBuildingWithComplex, IPossession } from '../../../../types';

interface IProps {
  changeNeedShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
  changeNeedShowCreatePossessionForm: React.Dispatch<React.SetStateAction<boolean>>;
  changeNeedUpdateAccountInfo: React.Dispatch<React.SetStateAction<boolean>>;
  getPossessions: (type: string, building_id: string) => Promise<void | IPossession[]>;
  getBuildings: (complex_id: string) => Promise<IBuildingWithComplex[] | void>;
}

export const Main: FC<IProps> = ({
  changeNeedShowNotification,
  changeNeedShowCreatePossessionForm,
  changeNeedUpdateAccountInfo,
  getBuildings,
  getPossessions,
}) => {
  const { user } = useTypedSelector((state) => state.UserReducer);
  const { error } = useTypedSelector((state) => state.CitizenReducer);
  const { addCitizenForm, citizenErrors } = useActions();
  const [updatingFormId, changeUpdatingFormId] = useState<number | null>(null);
  const citizens = useTypedSelector((state) => state.CitizenReducer.citizen);

  return (
    <>
      <span className='text-xl max-sm:mx-auto'>Собственность</span>
      <div className='flex max-sm:flex-col max-sm:gap-y-2 sm:flex-row sm:justify-between'>
        <Button
          className='bg-blue-700 text-white'
          type='primary'
          onClick={() => {
            if (error) citizenErrors(null);
            addCitizenForm();
          }}
          disabled={user.account_status !== 'Подтвержден'}
        >
          Добавить собственность
        </Button>
        <Button
          className='border-blue-700 text-blue-700'
          onClick={() => changeNeedShowCreatePossessionForm(true)}
        >
          Не нашли собственность?
        </Button>
      </div>

      {citizens.map((el, index) => (
        <Possessions
          key={index}
          data={{
            key: !el.id ? -1 * citizens.length : el.id,
            info: el,
            isFirstItem: index === 0 ? true : false,
            isNew: el.id < 1 ? true : false,
          }}
          changeNeedUpdateAccountInfo={changeNeedUpdateAccountInfo}
          changeUpdatingFormId={changeUpdatingFormId}
          updatingFormId={updatingFormId}
          changeNeedShowNotification={changeNeedShowNotification}
          getBuildings={getBuildings}
          getPossessions={getPossessions}
        />
      ))}
    </>
  );
};
