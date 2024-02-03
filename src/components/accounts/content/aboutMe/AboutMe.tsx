import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Main } from './possessions/Main';
import { General } from './general/General';

export const AboutMe = () => {
  const { user } = useTypedSelector((state) => state.UserReducer);

  return (
    <>
      <div className='w-[500px] flex flex-col gap-4 m-auto p-2'>
        <General />
        {user.role.role === 'citizen' && <Main />}
      </div>
    </>
  );
};
