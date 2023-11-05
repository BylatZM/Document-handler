import { Routes, Route } from 'react-router-dom';
import { Init } from './components/init/Init';

export const App = () => {
  return (
    <div className='min-w-full min-h-screen bg-red-500'>
      <Routes>
        <Route path='/*' element={<Init />} />
      </Routes>
    </div>
  );
};
