import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import {Table, TableBody, TableRow, TableCell, TableHead, TableContainer } from '@mui/material';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { TypeAnimation } from 'react-type-animation';


import NewProjectInfo from '../components/NewProjectInfo.jsx';
import UserAvatar from '../components/UserAvatar.jsx';

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

import LoadingPage from './LoadingPage.jsx';
import { databaseTechnologies } from '../config/config';



export function DashboardPage() {
    const { user, logout, getAccessTokenSilently } = useAuth0();
    const [newProjectOpen, setNewProjectOpen] = React.useState(false);
    const [projectsLoaded, setProjectsLoaded] = React.useState(false);
    const [showStartButton, setShowStartButton] = React.useState(false);

    const handleNewProjectOpen = () => setNewProjectOpen(true);
    const handleNewProjectClose = () => setNewProjectOpen(false);

    const [projects, setProjects] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await axios.get('http://127.0.0.1:5000/api/v1/projects', {
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
            const response = await axios.post('http://127.0.0.1:5000/api/v1/projects', newProject, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                });
            navigate(`/project/${newProject.id}`);
        } catch (error) {
            console.error("Error saving project", error);
        }
    };

    function lookupDbTechnology(id) {
        console.log(id);
        console.log(databaseTechnologies);
        const dbTechnology = databaseTechnologies.find(dbTechnology => dbTechnology.id === id);
        return dbTechnology ? dbTechnology.name : null;
    }

    function capitalizeFirstLetter(word) {
        if (!word) return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    
    function epochToLocalTime(epoch) {
        const date = new Date(epoch);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit'
        });
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        return `${formattedDate} ${formattedTime}`;
    }

    return (
    <Box sx={{ flexGrow: 1}}>
        <CssBaseline />
        <AppBar position="static" sx={{paddingLeft:5, paddingRight:5}}>
        <Toolbar>
                <Stack direction="row" spacing={0} alignItems="center" justifyContent="space-between" sx={{width:'100%'}}>
                    <img src={"./images/logo.png"} width="150" height="24"/>
                    <UserAvatar user={user} onLogout={logout} />                  
                </Stack>
            </Toolbar>
        </AppBar>
        <Box component="main" sx={{p: 10 }}>
            {(projects.length !== 0)?
            (
                <Grid container spacing={2} alignItems="center" alignContent="flex-end">
                    <Grid item xs={9}>
                        <Typography variant="h4">Project List</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Button sx={{width:'100%'}} onClick={handleNewProjectOpen} variant="contained" startIcon={<AddIcon/>}>New Project</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>DB Technology</TableCell>
                                        <TableCell>Project Type</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Owner</TableCell>
                                        <TableCell>Last Modified</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {projects.map((project) => (
                                        <TableRow
                                        key={project.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                            <Link to={`/project/${project.id}`}>{project.name}</Link>
                                            </TableCell>
                                            <TableCell>{lookupDbTechnology(project.dbTechnology)}</TableCell>
                                            <TableCell>{capitalizeFirstLetter(project.projectType)}</TableCell>
                                            <TableCell>{project.description}</TableCell>
                                            <TableCell>{project.owner.id===user.sub?"Me":project.owner.name}</TableCell>
                                            <TableCell>{epochToLocalTime(project.lastModified)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
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
            <NewProjectInfo open={newProjectOpen} onCancel={handleNewProjectClose} user={user} onSubmit={handleSaveNewProject}/>
        </Box>
    </Box>
  );
}

export default withAuthenticationRequired(DashboardPage, {
    onRedirecting: () => <LoadingPage />
});