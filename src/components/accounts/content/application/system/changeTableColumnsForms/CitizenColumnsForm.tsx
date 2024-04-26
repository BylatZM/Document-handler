import { Button, Checkbox, ConfigProvider, Popover } from 'antd';
import clsx from 'clsx';
import { FC } from 'react';
import { IApplicationCitizenColumns } from '../../../../../types';
import { ColumnsType } from 'antd/es/table';
import { defaultCitizenColumns } from '../ApplicationTableArgs';
import { defaultCitizenOptions } from '../ApplicationTableArgs';

interface IProps {
  needShow: boolean;
  changeNeedShow: React.Dispatch<React.SetStateAction<boolean>>;
  changeCitizenTable: React.Dispatch<
    React.SetStateAction<ColumnsType<IApplicationCitizenColumns> | null>
  >;
  checkboxValues: null | string[];
  changeCheckboxValues: React.Dispatch<React.SetStateAction<null | string[]>>;
}

export const CitizenColumnsForm: FC<IProps> = ({
  needShow,
  changeNeedShow,
  changeCitizenTable,
  checkboxValues,
  changeCheckboxValues,
}) => {
  return (
    <div
      className={clsx(
        'transitionGeneral fixed z-30 bottom-0 inset-x-0 m-auto bg-blue-500 backdrop-blur-md bg-opacity-10 flex items-center justify-center overflow-hidden',
        needShow ? 'h-full' : 'h-0',
      )}
    >
      <div className='z-30 bg-blue-700 h-min min-w-[250px] max-w-[250px] sm:min-w-[500px] sm:max-w-[500px] backdrop-blur-md bg-opacity-20 rounded-md p-1 sm:p-5'>
        <span className='text-1xl sm:text-2xl'>Выберите столбцы в таблице</span>
        <div className='mb-4 mt-4'>
          <hr />
          <Checkbox.Group
            value={!checkboxValues ? undefined : checkboxValues}
            className='flex flex-col justify-start mt-1 mb-1'
            options={defaultCitizenOptions}
            onChange={(value) => {
              const filter_array = value as string[];
              changeCheckboxValues(filter_array);
              let array: ColumnsType<IApplicationCitizenColumns> = [];
              defaultCitizenColumns.forEach((el) => {
                if (el.key && filter_array.some((item) => item === el.key)) {
                  array.push(el);
                }
              });
              changeCitizenTable(array);
            }}
          />
          <hr />
        </div>
        <div className='flex gap-2 justify-center'>
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimaryHover: '#1d4ed8',
                },
              },
            }}
          >
            <Button
              className='bg-none border-white text-white inline sm:mr-4'
              onClick={() => changeNeedShow(false)}
            >
              Закрыть
            </Button>
          </ConfigProvider>
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimaryHover: undefined,
                },
              },
            }}
          >
            <Popover
              content={
                <div className='w-[200px]'>
                  Если вы не сохраните ваш выбор, то после перезагрузки страницы будут отображены
                  все столбцы, вне зависимости от того, какие вы выбрали
                </div>
              }
            >
              <Button
                className='inline bg-blue-700 text-white'
                onClick={() => {
                  localStorage.setItem('application_table_columns', JSON.stringify(checkboxValues));
                  changeNeedShow(false);
                }}
              >
                Сохранить
              </Button>
            </Popover>
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
};