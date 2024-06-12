import { Input, Select } from 'antd';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useActions } from '../../../hooks/useActions';

export const Inputs = () => {
  const { error, processedPossessions, info } = useTypedSelector((state) => state.HelpFormReducer);
  const { citizenPossessions } = useTypedSelector((state) => state.CitizenReducer);
  const { role } = useTypedSelector((state) => state.UserReducer.user);
  const { TextArea } = Input;
  const { helpFormInfoSuccess, helpFormError } = useActions();

  return (
    <>
      <div className='flex flex-col gap-y-1'>
        <span className='primaryField'>Имя заявителя</span>
        <Input
          className='rounded-md h-[40px]'
          maxLength={20}
          onChange={(e) => {
            if (error && error.type === 'name') helpFormError(null);
            helpFormInfoSuccess({ ...info, name: e.target.value });
          }}
          value={info.name}
          status={error && error.type === 'name' ? 'error' : undefined}
          type='text'
          required
          size='large'
          placeholder='Булат'
        />
        {error !== null && error.type === 'name' && (
          <div className='errorText mt-2'>{error.error}</div>
        )}
      </div>
      <div className='flex flex-col gap-y-1'>
        <span className='primaryField'>Контактные данные (номер телефона \ почта)</span>
        <Input
          className='rounded-md h-[40px]'
          maxLength={50}
          onChange={(e) => {
            if (error && error.type === 'contact') helpFormError(null);
            helpFormInfoSuccess({ ...info, contact: e.target.value });
          }}
          status={error && error.type === 'contact' ? 'error' : undefined}
          value={info.contact}
          type='text'
          size='large'
          placeholder='applications@dltex.ru\+79372833608'
        />
        {error !== null && error.type === 'contact' && (
          <div className='errorText mt-2'>{error.error}</div>
        )}
      </div>
      <div className='flex flex-col gap-y-1'>
        <span className='primaryField'>Тема обращения</span>
        <Input
          className='rounded-md h-[40px]'
          maxLength={50}
          status={error && error.type === 'title' ? 'error' : undefined}
          onChange={(e) => {
            if (error && error.type === 'title') helpFormError(null);
            helpFormInfoSuccess({ ...info, title: e.target.value });
          }}
          value={info.title}
          type='text'
          size='large'
          placeholder='Тема обращения'
        />
        {error !== null && error.type === 'title' && (
          <div className='errorText mt-2'>{error.error}</div>
        )}
      </div>
      <div className='flex flex-col gap-y-1'>
        <span className='primaryField'>Описание проблемы</span>
        <TextArea
          rows={3}
          maxLength={200}
          status={error && error.type === 'description' ? 'error' : undefined}
          onChange={(e) => {
            if (error && error.type === 'description') helpFormError(null);
            helpFormInfoSuccess({ ...info, description: e.target.value });
          }}
          value={info.description}
          size='large'
          placeholder='Описание проблемы'
          className='rounded-md'
          style={{ resize: 'none' }}
        />
        {error !== null && error.type === 'description' && (
          <div className='errorText  mt-2'>{error.error}</div>
        )}
      </div>
      {citizenPossessions[0].id !== 0 && role === 'citizen' ? (
        <div className='flex flex-col gap-y-1'>
          <span>Адрес собственности</span>
          <Select
            style={{ fontSize: '0.4rem' }}
            className='rounded-md h-[80px] sm:h-[40px] w-full'
            onChange={(e) => helpFormInfoSuccess({ ...info, address: e })}
            value={info.address}
            placeholder='Адрес собственности'
            options={
              !processedPossessions
                ? []
                : processedPossessions.map((item, index) => ({
                    value: (index + 1).toString(),
                    label: item,
                  }))
            }
          />
        </div>
      ) : (
        <div className='flex flex-col gap-y-1'>
          <span>Адрес собственности</span>
          <Input
            className='rounded-md h-[40px]'
            onChange={(e) => helpFormInfoSuccess({ ...info, address: e.target.value })}
            value={info.address}
            maxLength={200}
            type='text'
            size='large'
            placeholder='Адрес собственности'
          />
        </div>
      )}
    </>
  );
};
