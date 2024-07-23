import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { InputLabel } from '@mui/material';
import { TypeAnimation } from 'react-type-animation';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


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
    const [sortOrder, setSortOrder] = React.useState('name asc');

    const handleNewProjectOpen = () => setNewProjectOpen(true);
    const handleNewProjectClose = () => setNewProjectOpen(false);

    const [projects, setProjects] = useState([]);

    const navigate = useNavigate();

    function sortProjects(projects, sortOrder){
        let sortedProjects = [...projects]; // Assuming 'projects' is your array of projects
      
        switch (sortOrder) {
          case 'name asc':
            sortedProjects.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name desc':
            sortedProjects.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'date desc':
            sortedProjects.sort((a, b) => new Date(b.lastChange.timestamp) - new Date(a.lastChange.timestamp));
            break;
          case 'date asc':
            sortedProjects.sort((a, b) => new Date(a.lastChange.timestamp) - new Date(b.lastChange.timestamp));
            break;
          default:
            // Handle default case or error
            console.log('Invalid sort order');
        }
        return sortedProjects
    }

    function handleSortChange(event) {
        const sortOrder = event.target.value;
        setProjects(sortProjects(projects, sortOrder)); // Replace this with your actual method to update the projects list in your state or props
        setSortOrder(sortOrder);
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await axios.get(`${apiUrl}/projects`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
                setProjects(sortProjects(await response.data, sortOrder));
                setProjectsLoaded(true);
            } catch (error) {
                console.error("Error fetching projects", error);
            }
        };
        fetchProjects();
    }, [getAccessTokenSilently]);

    const handleSaveNewProject = async (newProject) => {
        try {
            newProject["changeId"] = nanoid(21);
            const token = await getAccessTokenSilently();
            //console.log(newProject);
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
            }, 2500); // Poll every 2.5 seconds
    
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
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item style={{ flexGrow: 1 }}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                            <Typography variant="h4">Projects</Typography>
                        </Grid>
                        <Grid item>
                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="display-order-label">Display Order</InputLabel>
                                <Select
                                    labelId="display-order-label"
                                    value={sortOrder}
                                    onChange={handleSortChange}
                                    label="Display Order"
                                >
                                    <MenuItem value="name asc">Name Ascending</MenuItem>
                                    <MenuItem value="name desc">Name Descending</MenuItem>
                                    <MenuItem value="date desc">Most recently modified</MenuItem>
                                    <MenuItem value="date asc">Least recently modified</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Button onClick={handleNewProjectOpen} variant="contained" startIcon={<AddIcon/>}>New Project</Button>
                </Grid>
                <Grid item xs={12} mt={2}>
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