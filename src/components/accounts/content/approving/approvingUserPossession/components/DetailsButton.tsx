import { FC } from 'react';
import {
  IApprovingCitizenPossessionProcessingRow,
  ICitizenPossessionsColumns,
  INotApprovedCitizenPossession,
} from '../../../../../types';
import { Button, ConfigProvider } from 'antd';

interface IProps {
  processingRow: null | IApprovingCitizenPossessionProcessingRow;
  rowData: ICitizenPossessionsColumns;
  approvingCitizenPossessions: INotApprovedCitizenPossession[];
  changeSelectedCitizenPossession: React.Dispatch<
    React.SetStateAction<INotApprovedCitizenPossession | null>
  >;
}

export const DetailsButton: FC<IProps> = ({
  processingRow,
  rowData,
  approvingCitizenPossessions,
  changeSelectedCitizenPossession,
}) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimaryHover: undefined,
          },
        },
      }}
    >
      <Button
        type='primary'
        disabled={processingRow && processingRow.row_id === rowData.key ? true : false}
        onClick={() => {
          const citizenPossession = approvingCitizenPossessions.filter(
            (el) => el.id === rowData.key,
          );
          if (!citizenPossession.length) return;
          changeSelectedCitizenPossession(citizenPossession[0]);
        }}
        className='text-white h-[40px] bg-blue-700'
      >
        Подробно
      </Button>
    </ConfigProvider>
  );
};
