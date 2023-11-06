import { Routes, Route } from 'react-router-dom';
import { Main } from './components/log_reg/Main';

export const App = () => {
  return (
    <div className='w-full min-h-screen'>
      <Routes>
        <Route path='/*' element={<Main pageType='auth' />} />
        <Route path='/registration' element={<Main pageType='reg' />} />
      </Routes>
    </div>
  );
};
