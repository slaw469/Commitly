// File: apps/commitly-web/src/App.tsx

import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
}

