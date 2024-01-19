import { Input, Select } from 'antd';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useActions } from '../hooks/useActions';

export const Inputs = () => {
  const { error, processed_possessions, info } = useTypedSelector((state) => state.HelpFormReducer);
  const possessions = useTypedSelector((state) => state.CitizenReducer.citizen);
  const { TextArea } = Input;
  const { helpFormInfoSuccess, helpFormError } = useActions();

  return (
    <>
      <span className='primaryField'>Имя заявителя</span>
      <div style={{ marginBottom: 25 }}>
        <Input
          className='rounded-md h-[40px]'
          maxLength={50}
          onChange={(e) => {
            if (error && error.type === 'name') helpFormError(null);
            helpFormInfoSuccess({ ...info, name: e.target.value });
          }}
          value={info.name}
          type='text'
          required
          size='large'
          placeholder='Булат'
        />
        {error !== null && error.type === 'name' && (
          <div className='errorText mt-2'>{error.error}</div>
        )}
      </div>
      <span className='primaryField'>Адрес электронной почты</span>
      <div style={{ marginBottom: 25 }}>
        <Input
          className='rounded-md h-[40px]'
          maxLength={50}
          onChange={(e) => {
            if (error && error.type === 'email') helpFormError(null);
            helpFormInfoSuccess({ ...info, email: e.target.value });
          }}
          value={info.email}
          type='text'
          required
          size='large'
          placeholder='applications@dltex.ru'
        />
        {error !== null && error.type === 'email' && (
          <div className='errorText mt-2'>{error.error}</div>
        )}
      </div>
      <span className='primaryField'>Тема обращения</span>
      <div style={{ marginBottom: 25 }}>
        <Input
          className='rounded-md h-[40px]'
          maxLength={50}
          onChange={(e) => {
            if (error && error.type === 'title') helpFormError(null);
            helpFormInfoSuccess({ ...info, title: e.target.value });
          }}
          value={info.title}
          type='text'
          required
          size='large'
          placeholder='Тема обращения'
        />
        {error !== null && error.type === 'title' && (
          <div className='errorText mt-2'>{error.error}</div>
        )}
      </div>
      <span className='primaryField'>Описание проблемы</span>
      <div style={{ marginBottom: 25 }}>
        <TextArea
          rows={2}
          maxLength={200}
          onChange={(e) => {
            if (error && error.type === 'description') helpFormError(null);
            helpFormInfoSuccess({ ...info, description: e.target.value });
          }}
          value={info.description}
          required
          size='large'
          placeholder='Описание проблемы'
          className='rounded-md'
          style={{ resize: 'none' }}
        />
        {error !== null && error.type === 'description' && (
          <div className='errorText  mt-2'>{error.error}</div>
        )}
      </div>
      <span>Адрес собственности</span>
      {possessions[0].id === 0 && (
        <div style={{ marginBottom: 25 }}>
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
      {possessions[0].id !== 0 && (
        <div style={{ marginBottom: 25 }}>
          <Select
            style={{ fontSize: '0.4rem' }}
            className='rounded-md h-[40px] w-full'
            onChange={(e) => helpFormInfoSuccess({ ...info, address: e })}
            value={info.address}
            placeholder='Адрес собственности'
            options={
              !processed_possessions
                ? []
                : processed_possessions.map((item, index) => ({
                    value: index.toString(),
                    label: item,
                  }))
            }
          />
          {error !== null && error.type === 'address' && (
            <div className='errorText  mt-2'>{error.error}</div>
          )}
        </div>
      )}
    </>
  );
};
