import { FC, useState } from 'react';
import { ICitizen } from '../../../../../types';
import { useActions } from '../../../../../hooks/useActions';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';
import {
  getBuildingsRequest,
  getPossessionsRequest,
} from '../../../../../../api/requests/Possession';
import { useLogout } from '../../../../../hooks/useLogout';
import { FrontScore } from './inputs/FrontScore';
import { PossessionType } from './inputs/PossessionType';
import { OwnershipStatus } from './inputs/OwnershipStatus';
import { Complex } from './inputs/Complex';
import { Building } from './inputs/Building';
import { Possession } from './inputs/Possession';
import { Car } from './inputs/Car';
import { Buttons } from './buttons/Buttons';

interface ICitizenFormProps {
  data: {
    key: number;
    info: ICitizen;
    isFirstItem: boolean;
    isNew: boolean;
  };
  changeNeedUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  changeUpdatingFormId: React.Dispatch<React.SetStateAction<number | null>>;
  updatingFormId: number | null;
}

export const CitizenForm: FC<ICitizenFormProps> = ({
  data,
  changeNeedUpdate,
  changeUpdatingFormId,
  updatingFormId,
}) => {
  const { citizenErrors, possessionSuccess, buildingSuccess } = useActions();
  const { isLoading, error } = useTypedSelector((state) => state.CitizenReducer);
  const isLoadingPossession = useTypedSelector((state) => state.PossessionReducer.isLoading);
  const { complex, building, possession } = useTypedSelector((state) => state.PossessionReducer);
  const logout = useLogout();
  const [formData, changeFormData] = useState<ICitizen>(data.info);

  const getBuildings = async (complex_id: string) => {
    const response = await getBuildingsRequest(complex_id, logout);
    if (response) buildingSuccess(response);
  };

  const getPossessions = async (type: string, building_id: string) => {
    const response = await getPossessionsRequest(data.key, type, building_id, logout);

    if (!response) return;

    if ('form_id' in response) {
      possessionSuccess(null);
      citizenErrors(response);
    } else possessionSuccess(response);
  };
  return (
    <>
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
      />
      <OwnershipStatus
        data={formData}
        form_id={data.key}
        updatingFormId={updatingFormId}
        loadingForm={isLoading}
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
        loadingPossession={isLoadingPossession}
        complexes={complex}
      />
      <Building
        data={formData}
        form_id={data.key}
        updatingFormId={updatingFormId}
        changeFormData={changeFormData}
        citizenErrors={citizenErrors}
        getPossessions={getPossessions}
        loadingForm={isLoading}
        loadingPossession={isLoadingPossession}
        buildings={building}
      />
      <Possession
        data={formData}
        form_id={data.key}
        error={error}
        updatingFormId={updatingFormId}
        changeFormData={changeFormData}
        citizenErrors={citizenErrors}
        loadingForm={isLoading}
        loadingPossession={isLoadingPossession}
        possessions={possession}
      />
      {formData.possessionType === '3' && formData.possession.car && (
        <Car car={formData.possession.car} />
      )}
      <Buttons
        data={formData}
        changeData={changeFormData}
        isFirstItem={data.isFirstItem}
        form_id={data.key}
        updatingFormId={updatingFormId}
        loadingForm={isLoading}
        changeUpdatingFormId={changeUpdatingFormId}
        changeNeedUpdate={changeNeedUpdate}
        getPossessions={getPossessions}
        getBuildings={getBuildings}
      />
    </>
  );
};
