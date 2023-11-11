import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProjectListPage from './pages/ProjectListPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<LandingPage />} />
        <Route path="/dashboard" exact element={<ProjectListPage />} />
        <Route path="/project/:id" exact element={<ProjectDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;