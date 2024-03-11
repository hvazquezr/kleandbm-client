import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { TypeAnimation } from 'react-type-animation';


import NewProjectInfo from '../components/NewProjectInfo.jsx';
import UserAvatar from '../components/UserAvatar.jsx';
import ProjectCard from '../components/ProjectCard.jsx';

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

import LoadingPage from './LoadingPage.jsx';
import {apiUrl} from '../config/UrlConfig.jsx'

const logoStyle = {
    width: '140px',
    height: 'auto',
  };

export function DashboardPage() {
    const { user, logout, getAccessTokenSilently } = useAuth0();
    const [newProjectOpen, setNewProjectOpen] = React.useState(false);
    const [projectsLoaded, setProjectsLoaded] = React.useState(false);
    const [showStartButton, setShowStartButton] = React.useState(false);
    const [isComplete, setIsComplete] = React.useState(false);

    const handleNewProjectOpen = () => setNewProjectOpen(true);
    const handleNewProjectClose = () => setNewProjectOpen(false);

    const [projects, setProjects] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await axios.get(`${apiUrl}/projects`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
                setProjects(await response.data);
                setProjectsLoaded(true);
            } catch (error) {
                console.error("Error fetching projects", error);
            }
        };
        fetchProjects();
    }, [getAccessTokenSilently]);

    const handleSaveNewProject = async (newProject) => {
        try {
            const token = await getAccessTokenSilently();
            let response = await axios.post(`${apiUrl}/projects`, newProject, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
    
            const jobId = response.data.jobId; // Assuming the jobId is in the response
    
            const pollInterval = setInterval(async () => {
                try {
                    const statusResponse = await axios.get(`${apiUrl}/jobs/${jobId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });
    
                    if (statusResponse.data && statusResponse.data.result !== null) {
                        clearInterval(pollInterval);
                        // setIsComplete(true);
                        navigate(`/project/${newProject.id}`);
                    }
                } catch (pollError) {
                    console.error("Error polling project status", pollError);
                    clearInterval(pollInterval); // Optional: stop polling on error
                }
            }, 5000); // Poll every 5 seconds
    
        } catch (error) {
            console.error("Error saving project", error);
        }
    };

    return (
    <Box sx={{ flexGrow: 1}}>
        <CssBaseline />
        <AppBar position="static" sx={{paddingLeft:5, paddingRight:5}}>
        <Toolbar>
                <Stack direction="row" spacing={0} alignItems="center" justifyContent="space-between" sx={{width:'100%'}}>
                    <img src={"./images/kleandbmaiWhite.svg"} style={logoStyle}/>
                    <UserAvatar user={user} onLogout={logout} />                  
                </Stack>
            </Toolbar>
        </AppBar>
        <Box component="main" sx={{p: 8}}>
            {(projects.length !== 0)?
            (
            <Grid container spacing={4} alignItems="center">
                <Grid item xs={6} sm={8} md={9} lg={10} xl={10}>
                    <Typography variant="h4">Projects</Typography>
                </Grid>
                <Grid item xs={6} sm={4} md={3} lg={2} xl={2} style={{ textAlign: 'right' }}>
                    <Button onClick={handleNewProjectOpen} variant="contained" startIcon={<AddIcon/>}>New Project</Button>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        {projects.map(project => (
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={4} key={project.id}>
                                <ProjectCard project={project} user={user} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
            ):projectsLoaded&&(
                <Stack direction="column" spacing={4} alignItems="center" justifyContent="center" sx={{width:'100%', height: '70vh'}}>
                    <Typography variant="h5">
                        <TypeAnimation
                                    preRenderFirstString={false}
                                    sequence={[
                                    500,
                                    'Ready to model?', 
                                    500,
                                    () => {
                                        setShowStartButton(true);
                                      },
                                    ]}
                                    speed={50}
                                    style={{ fontSize: '2em', height:100, display: 'block' }}
                                    repeat={0}
                        />
                    </Typography>
                    {showStartButton&&<Button onClick={handleNewProjectOpen} variant="contained" >Let's get started</Button>}
                </Stack>
            )}
            {newProjectOpen&&
                <NewProjectInfo onCancel={handleNewProjectClose} onSubmit={handleSaveNewProject} isComplete={isComplete}/>
            }
        </Box>
    </Box>
  );
}

export default withAuthenticationRequired(DashboardPage, {
    onRedirecting: () => <LoadingPage />
});