// File: apps/commitly-web/src/App.tsx

import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddProject from './pages/AddProject';
import Formatter from './pages/Formatter';
import Reports from './pages/Reports';

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/add-project" element={<AddProject />} />
      <Route path="/formatter" element={<Formatter />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
}

