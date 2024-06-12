import { Button } from 'antd';
import { Possessions } from './components/Possessions';
import { useActions } from '../../../../hooks/useActions';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { IAboutMeGeneralSteps, IBuilding, IError, IPossession } from '../../../../types';
import clsx from 'clsx';

interface IProps {
  changeNeedShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
  changeNeedShowCreatePossessionForm: React.Dispatch<React.SetStateAction<boolean>>;
  changeNeedUpdateAccountInfo: React.Dispatch<React.SetStateAction<boolean>>;
  getPossessions: (type: string, building_id: string) => Promise<void | IPossession[] | IError>;
  getBuildings: (complex_id: string) => Promise<IBuilding[] | void>;
  generalPersonalSteps: IAboutMeGeneralSteps;
  setPersonalGeneralSteps: React.Dispatch<React.SetStateAction<IAboutMeGeneralSteps>>;
  changeNeedMakeScrollForGeneral: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Main: FC<IProps> = ({
  changeNeedShowNotification,
  changeNeedShowCreatePossessionForm,
  changeNeedUpdateAccountInfo,
  getBuildings,
  getPossessions,
  generalPersonalSteps,
  setPersonalGeneralSteps,
  changeNeedMakeScrollForGeneral,
}) => {
  const { error, citizenPossessions } = useTypedSelector((state) => state.CitizenReducer);
  const { user } = useTypedSelector((state) => state.UserReducer);
  const { addCitizenForm, citizenErrors } = useActions();
  const [updatingFormId, changeUpdatingFormId] = useState<number | null>(null);
  const [isPossessionListEmpty, setIsPossessionListEmpty] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const checkPossessionsRequestOnError = async (
    form_id: number,
    possession_type: string,
    building_id: string,
  ): Promise<void> => {
    const response = await getPossessions(possession_type, building_id);
    if (!response) return;
    if ('type' in response) {
      citizenErrors({ form_id: form_id, error: response });
      if (localStorage.getItem('citizen_registered')) {
        setTimeout(() => {
          citizenErrors(null);
        }, 2000);
      }
    }
  };

  useEffect(() => {
    if (ref.current && isPossessionListEmpty && localStorage.getItem('citizen_registered')) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isPossessionListEmpty]);

  const citizenPossessionsComponent = useMemo(() => {
    return citizenPossessions.map((el, index) => (
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
        generalPersonalSteps={generalPersonalSteps}
        setPersonalGeneralSteps={setPersonalGeneralSteps}
        setIsPossessionListEmpty={setIsPossessionListEmpty}
        changeNeedMakeScrollForGeneral={changeNeedMakeScrollForGeneral}
      />
    ));
  }, [
    citizenPossessions,
    updatingFormId,
    generalPersonalSteps.edit_form_button,
    generalPersonalSteps.general_button,
  ]);
  return (
    <>
      <span className='text-xl max-sm:mx-auto'>Собственность</span>
      <div className='flex max-sm:flex-col max-sm:gap-y-2 sm:flex-row sm:justify-between'>
        <Button
          className='bg-blue-700 text-white'
          type='primary'
          onClick={() => {
            if (error) citizenErrors(null);
            setPersonalGeneralSteps((prev) => ({ ...prev, general_button: true }));
            addCitizenForm();
          }}
          disabled={user.is_approved ? false : true}
        >
          Добавить собственность
        </Button>
        <div className='w-fit relative' ref={ref}>
          <div
            className={clsx(
              isPossessionListEmpty
                ? 'heartbeat absolute inset-0 bg-blue-700 rounded-md'
                : 'hidden',
            )}
          ></div>
          <Button
            className='border-blue-700 text-blue-700'
            onClick={() => {
              setIsPossessionListEmpty(false);
              changeNeedShowCreatePossessionForm(true);
            }}
          >
            Не нашли собственность?
          </Button>
        </div>
      </div>
      {citizenPossessionsComponent}
    </>
  );
};
