import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact component={ProjectList} />
        <Route path="/project/:id" component={ProjectDetail} />
      </Routes>
    </Router>
  );
}

export default App;