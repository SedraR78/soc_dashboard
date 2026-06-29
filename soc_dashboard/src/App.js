import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { TerminalPage as Terminal } from './pages/Terminal';
import { IPAnalysisPage as IPAnalysis } from './pages/IPAnalysis';
import { RedTeamPage as RedTeam } from './pages/RedTeam';
import { ReportsPage as Reports } from './pages/Reports';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/terminal" element={<Terminal />} />
        <Route path="/ip-analysis" element={<IPAnalysis />} />
        <Route path="/red-team" element={<RedTeam />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
