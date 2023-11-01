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
import {TextField, FormControl, ToggleButtonGroup, ToggleButton, Autocomplete} from '@mui/material';

const supportedDbTypes = [
    {id:1, label:'Snowflake'},
    {id:2, label:'Databricks'}
];

export default function ProjectWizardPage() {
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
            <img src={"./images/logo.png"} width="150" height="24"/>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{p: 10 }}>
        <FormControl>
            <Grid container spacing={2} alignItems="end" alignContent="flex-end">
                <Grid item xs={12}>
                    <h1>Project Information</h1>
                </Grid>
                <Grid item xs={4}>
                    <TextField id="projectName" label="Project Name" variant="outlined" required/>
                </Grid>
                <Grid item xs={4}>
                    <Autocomplete
                        disablePortal
                        id="dbType"
                        options={supportedDbTypes}
                        renderInput={(params) => <TextField {...params} required label="DB Type" />}
                        />
                </Grid>
                <Grid item xs={4}>
                    <ToggleButtonGroup
                        color="primary"
                        exclusive
                        aria-label="Project Type"
                    >
                        <ToggleButton value="analytical">Analytical</ToggleButton>
                        <ToggleButton value="transactional">Transactional</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={6}>
                    <TextField 
                        id="questions"
                        label="Questions the data model should answer"
                        variant="outlined" 
                        multiline 
                        minRows={10}
                        maxRows={10} 
                        sx={{width:'100%'}}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField 
                        id="additionalInfo"
                        label="Additional Information"
                        variant="outlined" 
                        multiline 
                        minRows={10}
                        maxRows={10} 
                        sx={{width:'100%'}}
                    />
                </Grid>
                <Grid item xs={12} >
                    <div sx={{width:'100%'}}>
                        <Box sx={{display:'flex', justifyContent:'space-between'}}>
                            <Button variant="outlined">Cancel</Button>
                            <Button variant="contained">Submit</Button>
                        </Box>
                    </div>
                </Grid>
            </Grid>
        </FormControl>
    </Box>
    </Box>
  );
}