import { Button } from 'antd';
import { Possessions } from './components/Possessions';
import { useActions } from '../../../../hooks/useActions';
import { FC, useState } from 'react';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { IBuildingWithComplex, IError, IPossession } from '../../../../types';

interface IProps {
  changeNeedShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
  changeNeedShowCreatePossessionForm: React.Dispatch<React.SetStateAction<boolean>>;
  changeNeedUpdateAccountInfo: React.Dispatch<React.SetStateAction<boolean>>;
  getPossessions: (type: string, building_id: string) => Promise<void | IPossession[] | IError>;
  getBuildings: (complex_id: string) => Promise<IBuildingWithComplex[] | void>;
}

export const Main: FC<IProps> = ({
  changeNeedShowNotification,
  changeNeedShowCreatePossessionForm,
  changeNeedUpdateAccountInfo,
  getBuildings,
  getPossessions,
}) => {
  const { error, citizenPossessions } = useTypedSelector((state) => state.CitizenReducer);
  const { addCitizenForm, citizenErrors } = useActions();
  const [updatingFormId, changeUpdatingFormId] = useState<number | null>(null);

  const checkPossessionsRequestOnError = async (
    form_id: number,
    possession_type: string,
    building_id: string,
  ): Promise<void> => {
    const response = await getPossessions(possession_type, building_id);
    if (!response) return;
    if ('type' in response) {
      citizenErrors({ form_id: form_id, error: response });
    }
  };

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
          disabled={
            citizenPossessions.some((el) => el.approving_status === 'Подтверждена') ? false : true
          }
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

      {citizenPossessions.map((el, index) => (
        <Possessions
          key={index}
          data={{
            key: !el.id ? -1 * citizenPossessions.length : el.id,
            info: el,
            isFirstItem: index === 0 ? true : false,
            isNew: el.id < 1 ? true : false,
          }}
          changeNeedUpdateAccountInfo={changeNeedUpdateAccountInfo}
          changeUpdatingFormId={changeUpdatingFormId}
          updatingFormId={updatingFormId}
          changeNeedShowNotification={changeNeedShowNotification}
          getBuildings={getBuildings}
          checkPossessionsRequestOnError={checkPossessionsRequestOnError}
        />
      ))}
    </>
  );
};
