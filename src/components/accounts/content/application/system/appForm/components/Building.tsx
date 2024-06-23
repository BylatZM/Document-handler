import { FC } from 'react';
import { useActions } from '../../../../../../hooks/useActions';
import { Select } from 'antd';
import {
  IApplication,
  IBuilding,
  ICitizenPossession,
  IError,
  IPosLoading,
  ISubtype,
  IType,
} from '../../../../../../types';
import { defaultAppForm } from '../defaultAppForm';

interface IProps {
  form_id: number;
  role: string;
  data: IApplication;
  buildings: IBuilding[];
  changeFormData: React.Dispatch<React.SetStateAction<IApplication>>;
  citizenPossessions: ICitizenPossession[];
  error: IError | null;
  possessionLoadingField: IPosLoading;
  checkPossessionRequestOnError: (possessionType: string, buildingId: string) => Promise<void>;
  getTypesByComplexId: (complex_id: string) => Promise<IType[] | void>;
  defaultSubtype: ISubtype;
  defaultType: IType;
}

export const Building: FC<IProps> = ({
  form_id,
  role,
  data,
  buildings,
  changeFormData,
  citizenPossessions,
  error,
  possessionLoadingField,
  checkPossessionRequestOnError,
  getTypesByComplexId,
  defaultSubtype,
  defaultType,
}) => {
  const { applicationError } = useActions();
  return (
    <div className='flex flex-col gap-2 w-full md:w-[48%]'>
      <span>Здание</span>
      {role === 'citizen' && (
        <Select
          className='h-[50px]'
          value={!data.building.id ? undefined : data.building.id}
          onChange={(e: number) => {
            const newPossession = citizenPossessions.filter((el) => el.building.id === e);
            if (!newPossession.length) return;
            getTypesByComplexId(newPossession[0].complex.id.toString());
            changeFormData((prev) => ({
              ...prev,
              building: { ...newPossession[0].building },
              complex: { ...newPossession[0].complex },
              possession: { ...newPossession[0].possession },
              type: defaultType,
              subtype: defaultSubtype,
            }));
          }}
          disabled={form_id !== 0 ? true : false}
          options={
            form_id !== 0
              ? [{ label: data.building.address, value: data.building.id }]
              : citizenPossessions
                  .filter((el, index, array) => {
                    const prevIndex = array.findIndex((prevItem, prevIndex) => {
                      return prevIndex < index && prevItem.building.id === el.building.id;
                    });

                    return prevIndex === -1;
                  })
                  .filter((el) => el.approving_status === 'Подтверждена')
                  .map((el) => ({
                    value: el.building.id,
                    label: el.building.address,
                  }))
          }
        />
      )}
      {role === 'dispatcher' && (
        <Select
          className='h-[50px]'
          value={!data.building.id ? undefined : data.building.id}
          onChange={(e: number) => {
            if (error) applicationError(null);
            const newBuilding = buildings.filter((el) => el.id === e);
            if (!newBuilding.length) return;
            checkPossessionRequestOnError(data.possession_type, e.toString());
            changeFormData((prev) => ({
              ...prev,
              building: { ...newBuilding[0] },
              possession: { ...defaultAppForm.possession },
            }));
          }}
          disabled={
            form_id !== 0 ||
            data.complex.id === 0 ||
            possessionLoadingField === 'buildings' ||
            !buildings.length
              ? true
              : false
          }
          loading={possessionLoadingField === 'buildings' ? true : false}
          options={
            form_id !== 0
              ? [{ label: data.building.address, value: data.building.id }]
              : buildings.map((el) => ({
                  value: el.id,
                  label: el.address,
                }))
          }
        />
      )}
      {role === 'executor' && (
        <Select
          className='h-[50px]'
          value={!data.building.id ? undefined : data.building.id}
          disabled
          options={[{ label: data.building.address, value: data.building.id }]}
        />
      )}
    </div>
  );
};
