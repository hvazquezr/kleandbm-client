import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ProjectPage from './pages/ProjectPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" exact element={<DashboardPage />} />
        <Route path="/project/:id" exact element={<ProjectPage />} />
      </Routes>
    </Router>
  );
}

export default App;