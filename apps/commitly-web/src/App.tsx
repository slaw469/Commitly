// File: apps/commitly-web/src/App.tsx

import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Playground from './pages/Playground';
import Presets from './pages/Presets';
import Dashboard from './pages/Dashboard';
import AddProject from './pages/AddProject';
import Formatter from './pages/Formatter';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Docs from './pages/Docs';
import { Toaster } from './components/ui/toaster';

export default function App(): JSX.Element {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/presets" element={<Presets />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-project" element={<AddProject />} />
        <Route path="/formatter" element={<Formatter />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/docs" element={<Docs />} />
      </Routes>
      <Toaster />
    </>
  );
}

