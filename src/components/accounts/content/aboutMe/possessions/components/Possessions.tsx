import { FC, useEffect, useState } from 'react';
import {
  IAboutMeFormSteps,
  IAboutMeGeneralSteps,
  IBuilding,
  ICitizenPossession,
  IPossession,
} from '../../../../../types';
import { useActions } from '../../../../../hooks/useActions';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';
import { PersonalAccount } from './inputs/PersonalAccount';
import { PossessionType } from './inputs/PossessionType';
import { OwnershipStatus } from './inputs/OwnershipStatus';
import { Complex } from './inputs/Complex';
import { Building } from './inputs/Building';
import { Possession } from './inputs/Possession';
import { Buttons } from './buttons/Buttons';
import { PossessionStatus } from './inputs/PossessionStatus';
import { CreatedDate } from './inputs/CreatedDate';
import { defaultCitizen } from '../../../../../../store/reducers/CitizenReducer';

interface ICitizenFormProps {
  data: {
    key: number;
    info: ICitizenPossession;
    isFirstItem: boolean;
    isNew: boolean;
  };
  changeNeedUpdateAccountInfo: React.Dispatch<React.SetStateAction<boolean>>;
  changeUpdatingFormId: React.Dispatch<React.SetStateAction<number | null>>;
  updatingFormId: number | null;
  changeNeedShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
  getBuildings: (complex_id: string) => Promise<IBuilding[] | void>;
  checkPossessionsRequestOnError: (
    form_id: number,
    possession_type: string,
    building_id: string,
  ) => Promise<void>;
  generalPersonalSteps: IAboutMeGeneralSteps;
  setPersonalGeneralSteps: React.Dispatch<React.SetStateAction<IAboutMeGeneralSteps>>;
  setIsPossessionListEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  changeNeedMakeScrollForGeneral: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Possessions: FC<ICitizenFormProps> = ({
  data,
  changeNeedUpdateAccountInfo,
  changeUpdatingFormId,
  updatingFormId,
  changeNeedShowNotification,
  getBuildings,
  checkPossessionsRequestOnError,
  generalPersonalSteps,
  setPersonalGeneralSteps,
  setIsPossessionListEmpty,
  changeNeedMakeScrollForGeneral,
}) => {
  const { citizenErrors } = useActions();
  const { isLoading, error } = useTypedSelector((state) => state.CitizenReducer);
  const possessionLoadingField = useTypedSelector((state) => state.PossessionReducer.isLoading);
  const [formPersonalSteps, setPersonalFormSteps] = useState<IAboutMeFormSteps>({
    complex: false,
    building: false,
    possession: false,
    create_button: false,
  });
  const { complexes, buildings, possessions } = useTypedSelector(
    (state) => state.PossessionReducer,
  );
  const [formData, changeFormData] = useState<ICitizenPossession>(defaultCitizen);
  const emptyPossession: IPossession = {
    id: 0,
    name: '',
    type: '',
    building: '',
    personal_account: null,
  };
  const emptyBuilding: IBuilding = {
    id: 0,
    address: '',
    complex: '',
  };

  useEffect(() => {
    changeFormData({ ...data.info });
  }, [data]);

  useEffect(() => {
    if (error && error.error.type === 'possession' && localStorage.getItem('citizen_registered')) {
      setTimeout(() => setIsPossessionListEmpty((prev) => !prev), 2000);
      setPersonalFormSteps({
        building: false,
        possession: false,
        complex: false,
        create_button: false,
      });
    }
  }, [error]);

  return (
    <>
      <PossessionStatus data={formData} form_id={data.key} />
      <PersonalAccount data={formData} />
      <CreatedDate data={formData} />
      <PossessionType
        data={formData}
        form_id={data.key}
        updatingFormId={updatingFormId}
        changeFormData={changeFormData}
        loadingForm={isLoading}
        citizenErrors={citizenErrors}
        emptyPossession={emptyPossession}
        error={error}
        checkPossessionsRequestOnError={checkPossessionsRequestOnError}
      />
      <OwnershipStatus
        data={formData}
        form_id={data.key}
        updatingFormId={updatingFormId}
        loadingForm={isLoading}
        changeFormData={changeFormData}
      />
      <Complex
        data={formData}
        form_id={data.key}
        error={error}
        updatingFormId={updatingFormId}
        changeFormData={changeFormData}
        citizenErrors={citizenErrors}
        getBuildings={getBuildings}
        loadingForm={isLoading}
        complexes={complexes}
        emptyPossession={emptyPossession}
        emptyBuilding={emptyBuilding}
        generalPersonalSteps={generalPersonalSteps}
        setPersonalFormSteps={setPersonalFormSteps}
        formPersonalSteps={formPersonalSteps}
      />
      <Building
        data={formData}
        form_id={data.key}
        updatingFormId={updatingFormId}
        changeFormData={changeFormData}
        citizenErrors={citizenErrors}
        loadingForm={isLoading}
        buildings={buildings}
        error={error}
        emptyPossession={emptyPossession}
        possessionLoadingField={possessionLoadingField}
        checkPossessionsRequestOnError={checkPossessionsRequestOnError}
        generalPersonalSteps={generalPersonalSteps}
        setPersonalFormSteps={setPersonalFormSteps}
        formPersonalSteps={formPersonalSteps}
      />
      <Possession
        data={formData}
        form_id={data.key}
        error={error}
        updatingFormId={updatingFormId}
        changeFormData={changeFormData}
        citizenErrors={citizenErrors}
        loadingForm={isLoading}
        possessions={possessions}
        possessionLoadingField={possessionLoadingField}
        generalPersonalSteps={generalPersonalSteps}
        setPersonalFormSteps={setPersonalFormSteps}
        formPersonalSteps={formPersonalSteps}
      />
      <Buttons
        data={formData}
        isFirstItem={data.isFirstItem}
        form_id={data.key}
        updatingFormId={updatingFormId}
        loadingForm={isLoading}
        changeUpdatingFormId={changeUpdatingFormId}
        changeNeedUpdateAccountInfo={changeNeedUpdateAccountInfo}
        checkPossessionsRequestOnError={checkPossessionsRequestOnError}
        getBuildings={getBuildings}
        changeNeedShowNotification={changeNeedShowNotification}
        setPersonalFormSteps={setPersonalFormSteps}
        formPersonalSteps={formPersonalSteps}
        generalPersonalSteps={generalPersonalSteps}
        setPersonalGeneralSteps={setPersonalGeneralSteps}
        changeNeedMakeScrollForGeneral={changeNeedMakeScrollForGeneral}
      />
    </>
  );
};
