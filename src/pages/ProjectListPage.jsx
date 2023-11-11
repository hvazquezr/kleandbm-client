import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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

import NewProjectInfo from '../components/NewProjectInfo';
import LogoutButton from '../components/LogoutButton.jsx'
import LandingPage from './LandingPage.jsx';

import { withAuthenticationRequired } from "@auth0/auth0-react";


export function ProjectListPage() {
    const [newProjectOpen, setNewProjectOpen] = React.useState(false);
    const handleNewProjectOpen = () => setNewProjectOpen(true);
    const handleNewProjectClose = () => setNewProjectOpen(false);

    const [projects, setProjects] = useState([
        {id:1, name:'First Project'}
        ]);

        // The followign can be enabled once the rest api is up and running
        /*
        useEffect(() => {
        const fetchData = async () => {
            const result = await axios('https://api.example.com/projects'); // Replace with your API
            setProjects(result.data);
        };

        fetchData();
        }, []);
    */
    return (
    <Box sx={{ flexGrow: 1}}>
        <AppBar position="static">
        <Toolbar>
                <Stack direction="row" spacing={0} alignItems="center" justifyContent="space-between" sx={{width:'100%'}}>
                    <img src={"./images/logo.png"} width="150" height="24"/>
                    <LogoutButton />                    
                </Stack>
            </Toolbar>
        </AppBar>
        <Box component="main" sx={{p: 10 }}>
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
                                    <TableCell>Description</TableCell>
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
                                    <TableCell>{project.description}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            <NewProjectInfo open={newProjectOpen} onCancel={handleNewProjectClose} />
        </Box>
    </Box>
  );
}

export default withAuthenticationRequired(ProjectListPage, {
    onRedirecting: () => (<div>Loading...</div>),
});