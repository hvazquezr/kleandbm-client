import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProjectListPage from './pages/ProjectListPage';
import ProjectDetailPage from './pages/ProjectDetailPage';

import TableNode from './components/TableNode'

const nodeTypes = {
  tableNode: TableNode,
};


function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/" exact element={<ProjectListPage />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;