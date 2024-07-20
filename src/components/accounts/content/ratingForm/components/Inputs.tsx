import { Form, FormInstance, Rate, Select } from 'antd';
import { FC } from 'react';
import {
  IBuilding,
  ICitizenFio,
  IError,
  IPossession,
  IRatingForm,
  IRatingFormLoading,
} from '../../../../types';
import {
  getAllBuildingsByComplexIdRequest,
  getAllPossessionsByExtraRequest,
} from '../../../../../api/requests/Possession';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { getCitizensFioRequest } from '../../../../../api/requests/User';

interface IProps {
  form: FormInstance<IRatingForm>;
  error: IError | null;
  changeError: React.Dispatch<React.SetStateAction<IError | null>>;
  citizens: ICitizenFio[];
  setCitizens: React.Dispatch<React.SetStateAction<ICitizenFio[]>>;
  buildings: IBuilding[];
  setBuildings: React.Dispatch<React.SetStateAction<IBuilding[]>>;
  possessions: IPossession[];
  setPossessions: React.Dispatch<React.SetStateAction<IPossession[]>>;
  isLoading: IRatingFormLoading;
  changeIsLoading: React.Dispatch<React.SetStateAction<IRatingFormLoading>>;
  logout: () => void;
}

export const Inputs: FC<IProps> = ({
  form,
  error,
  changeError,
  citizens,
  setCitizens,
  buildings,
  setBuildings,
  possessions,
  setPossessions,
  isLoading,
  changeIsLoading,
  logout,
}) => {
  const { complexes, possessionTypes } = useTypedSelector((state) => state.PossessionReducer);

  const getAllBuildingsByComplexId = async (complexId: number) => {
    if (possessions.length) {
      setPossessions([]);
    }
    if (citizens.length) {
      setCitizens([]);
    }
    setBuildings([]);
    changeIsLoading((prev) => 'building');
    const response = await getAllBuildingsByComplexIdRequest(complexId.toString(), logout);
    changeIsLoading((prev) => null);
    if (!response) return;
    setBuildings(response);
  };

  const getAllCitizensByExtra = async (buildingId?: number, possessionId?: number) => {
    changeIsLoading((prev) => 'citizen');
    const response = await getCitizensFioRequest(logout, possessionId, buildingId);
    changeIsLoading((prev) => null);
    if (!response) return;
    if ('type' in response) {
      changeError(response);
      return;
    }
    setCitizens(response);
  };

  const getAllPossessionsByBuildingAndType = async (typeId: number, buildingId?: number) => {
    if (!buildingId) return;
    if (citizens.length) {
      setCitizens([]);
    }
    if (error) changeError(null);
    changeIsLoading((prev) => 'possession');
    const response = await getAllPossessionsByExtraRequest(
      typeId.toString(),
      buildingId.toString(),
      logout,
    );
    changeIsLoading((prev) => null);
    if (!response) return;
    if ('type' in response) {
      changeError(response);
      return;
    }
    setPossessions(response);
  };

  const changeComplexField = (e: number) => {
    if (buildings.length) {
      setBuildings([]);
    }
    if (possessions) {
      setPossessions([]);
    }
    if (citizens) {
      setCitizens([]);
    }
    if (error) changeError(null);
    getAllBuildingsByComplexId(e);
    form.setFieldValue('complex', e);
    form.setFieldValue('building', undefined);
    form.setFieldValue('possessionType', undefined);
    form.setFieldValue('possession', undefined);
    form.setFieldValue('citizen', undefined);
    form.setFieldValue('mark', undefined);
  };

  const changeBuildingField = (e: number) => {
    if (error) changeError(null);
    getAllCitizensByExtra(e, undefined);
    form.setFieldValue('building', e);
    form.setFieldValue('possessionType', undefined);
    form.setFieldValue('possession', undefined);
    form.setFieldValue('citizen', undefined);
    form.setFieldValue('mark', undefined);
  };

  const changePossessionTypeField = (e: number) => {
    if (error) changeError(null);
    getAllPossessionsByBuildingAndType(e, form.getFieldValue('building'));
    form.setFieldValue('possessionType', e);
    form.setFieldValue('possession', undefined);
    form.setFieldValue('citizen', undefined);
    form.setFieldValue('mark', undefined);
  };

  const changePossessionField = (e: number) => {
    if (error) changeError(null);
    getAllCitizensByExtra(form.getFieldValue('building'), e);
    form.setFieldValue('possession', e);
    form.setFieldValue('citizen', undefined);
    form.setFieldValue('mark', undefined);
  };

  const changeCitizenField = (e: number) => {
    if (error) changeError(null);
    form.setFieldValue('citizen', e);
    form.setFieldValue('mark', undefined);
  };

  return (
    <>
      <Form.Item
        name='complex'
        className='text-base'
        label='Название жилого комплекса'
        rules={[
          {
            required: true,
            message: 'Поле "Название жилого комплекса" обязательно для заполнения',
          },
        ]}
      >
        <Select
          className='h-[40px]'
          onChange={changeComplexField}
          options={complexes.map((el) => ({ value: el.id, label: el.name }))}
        />
      </Form.Item>
      <Form.Item
        name='building'
        className='text-base'
        label='Адрес здания'
        rules={[{ required: true, message: 'Поле "Адрес здания" обязательно для заполнения' }]}
      >
        <Select
          className='h-[40px]'
          disabled={!buildings.length || !form.getFieldValue('complex')}
          onChange={changeBuildingField}
          loading={isLoading === 'building'}
          options={buildings.map((el) => ({ value: el.id, label: el.address }))}
        />
      </Form.Item>
      <Form.Item name='possessionType' className='text-base' label='Тип собственности'>
        <Select
          className='h-[40px]'
          onChange={changePossessionTypeField}
          disabled={
            isLoading === 'possession' ||
            !buildings.length ||
            isLoading === 'building' ||
            !form.getFieldValue('building')
          }
          options={possessionTypes.map((el) => ({ value: el.id, label: el.name }))}
        />
      </Form.Item>
      <Form.Item
        name='possession'
        className='text-base'
        label='Наименование собственности'
        validateStatus={error && error.type === 'possession' ? 'error' : undefined}
        help={error && error.type === 'possession' && error.error}
      >
        <Select
          className='h-[40px]'
          loading={isLoading === 'possession'}
          disabled={
            isLoading === 'possession' ||
            !possessions.length ||
            !form.getFieldValue('possessionType') ||
            error?.type === 'possession'
          }
          onChange={changePossessionField}
          options={possessions.map((el) => ({ value: el.id, label: el.name }))}
        />
      </Form.Item>
      <Form.Item
        name='citizen'
        className='text-base'
        label='ФИО жителя'
        rules={[{ required: true, message: 'Поле "ФИО жителя" обязательно для заполнения' }]}
        validateStatus={error && error.type === 'citizen' ? 'error' : undefined}
        help={error && error.type === 'citizen' && error.error}
      >
        <Select
          className='h-[40px]'
          loading={isLoading === 'citizen'}
          disabled={isLoading === 'citizen' || !citizens.length || error?.type === 'citizen'}
          onChange={changeCitizenField}
          options={citizens.map((el) => ({
            value: el.id,
            label: el.fio,
          }))}
        />
      </Form.Item>
      <Form.Item
        name='mark'
        className='text-base'
        label='Оценка работы с собственником'
        rules={[
          {
            required: true,
            message: 'Поле "Оценка работы с собственником" обязательно для заполнения',
          },
        ]}
      >
        <Rate className='text-3xl cast_stars' disabled={!citizens.length} />
      </Form.Item>
    </>
  );
};
