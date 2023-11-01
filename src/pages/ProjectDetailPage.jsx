import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProjectDetailPage = () => {
  const [project, setProject] = useState({id:1, name:'First Project', description:'This is a test'});
  const { id } = useParams();

    // The followign can be enabled once the rest api is up and running
  /*
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(`https://api.example.com/projects/${id}`); // Replace with your API
      setProject(result.data);
    };

    fetchData();
  }, [id]);
  */
  return (
    <div>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      {/* Add more project details here */}
    </div>
  );
};

export default ProjectDetailPage;
