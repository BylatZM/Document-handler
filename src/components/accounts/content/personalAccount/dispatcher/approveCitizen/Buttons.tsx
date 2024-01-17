import { Button, ConfigProvider } from 'antd';
import { FC } from 'react';
import {
  approveRequest,
  getCitizenByIdRequest,
  rejectApproveRequest,
} from '../../../../../../api/requests/Person';
import { useActions } from '../../../../../hooks/useActions';
import { useLogout } from '../../../../../hooks/useLogout';
import { INotApproved } from '../../../../../types';

interface IProps {
  data: INotApproved[];
  item: INotApproved;
  changeUserInfo: React.Dispatch<React.SetStateAction<INotApproved | null>>;
  changeIsFormActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Buttons: FC<IProps> = ({ data, item, changeUserInfo, changeIsFormActive }) => {
  const logout = useLogout();
  const { deleteNotApprovedUsers, notApprovedSuccess, citizenSuccess, citizenLoading } =
    useActions();

  const approve = async (user_id: number, application_id: number) => {
    const response = await approveRequest(user_id, logout);
    if (response === 200) deleteNotApprovedUsers(application_id);
  };

  const rejectApprove = async (id: number) => {
    const response = await rejectApproveRequest(id, logout);
    if (response === 200 && data) {
      notApprovedSuccess(
        data.map((el) => {
          if (el.id === id) return { ...el, status: 'отклонена' };
          else return el;
        }),
      );
    }
  };

  const getCitizenById = async (id: number) => {
    citizenLoading({ form_id: 0, isLoading: true });
    const response = await getCitizenByIdRequest(logout, id);
    if (response && typeof response !== 'number') citizenSuccess(response);
    citizenLoading({ form_id: 0, isLoading: false });
  };

  return (
    <>
      <div className='min-w-[130px] max-w-[130px]'>
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimaryTextHover: '#fff',
                colorPrimaryHover: undefined,
              },
            },
          }}
        >
          <Button
            onClick={() => approve(item.user.id, item.id)}
            className='text-black border-black text-lg p-1 flex leading-5 border-[1px]'
          >
            Подтвердить
          </Button>
        </ConfigProvider>
      </div>
      <div className='min-w-[130px] max-w-[130px]'>
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimaryTextHover: undefined,
                colorPrimaryHover: undefined,
              },
            },
          }}
        >
          <Button
            onClick={() => {
              changeUserInfo(item);
              changeIsFormActive(true);
              getCitizenById(item.user.id);
            }}
            className='text-blue-500 border-blue-500 text-lg p-1 flex leading-5 border-[1px]'
          >
            Информация
          </Button>
        </ConfigProvider>
      </div>
      <div className='min-w-[120px] max-w-[120px]'>
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimaryTextHover: '#ef4444',
                colorPrimaryHover: undefined,
              },
            },
          }}
        >
          <Button
            onClick={() => {
              rejectApprove(item.id);
            }}
            disabled={item.status === 'отклонена' ? true : false}
            className='text-red-500 border-red-500 text-lg p-1 flex leading-5 border-[1px]'
          >
            Отклонить
          </Button>
        </ConfigProvider>
      </div>
    </>
  );
};
