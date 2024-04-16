import { FC, useState } from 'react';
import { IBuilding, IBuildingWithComplex, ICitizen, IPossession } from '../../../../../types';
import { useActions } from '../../../../../hooks/useActions';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';
import { FrontScore } from './inputs/FrontScore';
import { PossessionType } from './inputs/PossessionType';
import { OwnershipStatus } from './inputs/OwnershipStatus';
import { Complex } from './inputs/Complex';
import { Building } from './inputs/Building';
import { Possession } from './inputs/Possession';
import { Buttons } from './buttons/Buttons';
import { PossessionStatus } from './inputs/PossessionStatus';

interface ICitizenFormProps {
  data: {
    key: number;
    info: ICitizen;
    isFirstItem: boolean;
    isNew: boolean;
  };
  changeNeedUpdateAccountInfo: React.Dispatch<React.SetStateAction<boolean>>;
  changeUpdatingFormId: React.Dispatch<React.SetStateAction<number | null>>;
  updatingFormId: number | null;
  changeNeedShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
  getPossessions: (type: string, building_id: string) => Promise<void | IPossession[]>;
  getBuildings: (complex_id: string) => Promise<IBuildingWithComplex[] | void>;
}

export const Possessions: FC<ICitizenFormProps> = ({
  data,
  changeNeedUpdateAccountInfo,
  changeUpdatingFormId,
  updatingFormId,
  changeNeedShowNotification,
  getBuildings,
  getPossessions,
}) => {
  const { citizenErrors } = useActions();
  const { isLoading, error } = useTypedSelector((state) => state.CitizenReducer);
  const possessionLoadingField = useTypedSelector((state) => state.PossessionReducer.isLoading);
  const { complexes, buildings, possessions } = useTypedSelector(
    (state) => state.PossessionReducer,
  );
  const [formData, changeFormData] = useState<ICitizen>(data.info);
  const emptyPossession: IPossession = {
    id: 0,
    address: '',
    type: '',
    building: '',
  };
  const emptyBuilding: IBuilding = {
    id: 0,
    building: '',
  };

  return (
    <>
      <PossessionStatus data={formData} form_id={data.key} />
      <FrontScore
        data={formData}
        form_id={data.key}
        error={error}
        updatingFormId={updatingFormId}
        changeFormData={changeFormData}
        loadingForm={isLoading}
      />
      <PossessionType
        data={formData}
        form_id={data.key}
        updatingFormId={updatingFormId}
        changeFormData={changeFormData}
        loadingForm={isLoading}
        getPossessions={getPossessions}
        citizenErrors={citizenErrors}
        emptyPossession={emptyPossession}
        error={error}
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
      />
      <Building
        data={formData}
        form_id={data.key}
        updatingFormId={updatingFormId}
        changeFormData={changeFormData}
        citizenErrors={citizenErrors}
        getPossessions={getPossessions}
        loadingForm={isLoading}
        buildings={buildings}
        error={error}
        emptyPossession={emptyPossession}
        possessionLoadingField={possessionLoadingField}
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
      />
      <Buttons
        data={formData}
        isFirstItem={data.isFirstItem}
        form_id={data.key}
        updatingFormId={updatingFormId}
        loadingForm={isLoading}
        changeUpdatingFormId={changeUpdatingFormId}
        changeNeedUpdateAccountInfo={changeNeedUpdateAccountInfo}
        getPossessions={getPossessions}
        getBuildings={getBuildings}
        changeNeedShowNotification={changeNeedShowNotification}
      />
    </>
  );
};
