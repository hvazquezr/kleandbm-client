import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ProjectPage from './pages/ProjectPage';
import VersionHistoryPage from './pages/VersionHistoryPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" exact element={<DashboardPage />} />
        <Route path="/project/:id" exact element={<ProjectPage />} />
        <Route path="/versionhistory/:id" exact element={<VersionHistoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;