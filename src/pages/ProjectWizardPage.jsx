import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button'

import {TextField, FormControl, ToggleButtonGroup, ToggleButton, Autocomplete, Typography} from '@mui/material';
import Tab from '@mui/material/Tab';
import {TabContext, TabList, TabPanel}  from '@mui/lab';


const supportedDbTypes = [
    {id:1, label:'Snowflake'},
    {id:2, label:'Databricks'}
];

export default function ProjectWizardPage() {
    const [tabValue, setTabValue] = React.useState('1');

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
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
                <Grid item xs={12}>
                    <div sx={{width:'100%'}}>
                        <Box sx={{display:'flex', justifyContent:'space-between'}}>
                            <TextField id="projectName" label="Project Name" variant="outlined" required/>
                            <Autocomplete
                            disablePortal
                            id="dbType"
                            options={supportedDbTypes}
                            renderInput={(params) => <TextField {...params} required sx={{minWidth:200}} label="DB Type" />}
                            />
                            <ToggleButtonGroup
                            color="primary"
                            exclusive
                            aria-label="Project Type"
                            >
                                <ToggleButton value="analytical">Analytical</ToggleButton>
                                <ToggleButton value="transactional">Transactional</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <TabContext value={tabValue}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleTabChange}>
                                <Tab label="Business Questions" value="1" />
                                <Tab label="Additional Information" value="2" />
                                <Tab label="Naming Rules" value="3" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <Typography variant="subtitle2" gutterBottom>
                                Enter the list of business questions the data model should be able to answer.
                            </Typography>
                            <TextField 
                                id="questions"
                                label="Questions"
                                variant="outlined" 
                                multiline 
                                minRows={10}
                                maxRows={10} 
                                sx={{width:'100%'}}
                            />                            
                        </TabPanel>
                        <TabPanel value="2">
                            <Typography variant="subtitle2" gutterBottom>
                                Provide additional information that should be taken into consideration. i.e. Relationships that change over time, etc.
                            </Typography>
                            <TextField 
                                id="additionalInfo"
                                label="Additional Information"
                                variant="outlined" 
                                multiline 
                                minRows={10}
                                maxRows={10} 
                                sx={{width:'100%'}}
                            />                            
                        </TabPanel>
                        <TabPanel value="3">
                            <Typography variant="subtitle2" gutterBottom>
                                List naming conventions or abbreviations that need to be observed. i.e. Camelcase, etc.
                            </Typography>
                            <TextField 
                                id="namingRules"
                                label="Naming Conventions"
                                variant="outlined" 
                                multiline 
                                minRows={10}
                                maxRows={10} 
                                sx={{width:'100%'}}
                            />                            
                        </TabPanel>
                    </TabContext>
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