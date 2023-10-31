import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProjectDetail = () => {
  const [project, setProject] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(`https://api.example.com/projects/${id}`); // Replace with your API
      setProject(result.data);
    };

    fetchData();
  }, [id]);

  return (
    <div>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      {/* Add more project details here */}
    </div>
  );
};

export default ProjectDetail;
