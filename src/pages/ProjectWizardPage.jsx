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


export default function ProjectList() {
    const [projectInfo, setProjectInfo] = useState([
        {name: '', projectType:'', dbType:'', questions:'', otherInfo:'', namingRules:''}
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
            <img src={"./images/logo.png"} width="150" height="24"/>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{p: 10 }}>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
                <h1>Project Information</h1>
            </Grid>
        </Grid>
        <Grid item xs={12}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
    </Box>
    </Box>
  );
}