//TODO: Vaidation
import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal';
import {TextField, FormControl, ToggleButtonGroup, ToggleButton, Autocomplete, Typography} from '@mui/material';
import Tab from '@mui/material/Tab';
import FormHelperText from '@mui/material/FormHelperText';
import {TabContext, TabList, TabPanel}  from '@mui/lab';

import { databaseTechnologies } from '../config/config';


const supportedDbTypes = [
    {id:1, label:'Snowflake'},
    {id:2, label:'Databricks'}
];

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p:5,
    flexGrow: 1,
    borderRadius: 2
  };

export default function NewProjectInfo({open, onCancel, user, onSubmit}) {
    const [tabValue, setTabValue] = useState('1');
    const [project, setProject] = useState({id: nanoid(), owner: user, active: true, description:'Default description. To be changed by AI.'});
    const [validation, setValidation] = useState({
        name: {error:false, helperText: ''},
        dbTechnology: {error:false, helperText: ''},
        projectType: {error:false, helperText: ''},
        questions: {error:false, helperText: ''}
    });

    const validateProjectName = (name) => {
        if (!name || name.length < 1 || name.length > 255) {
          return 'Project name must be between 1 and 255 characters.';
        }
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
          return 'Project name must start with a letter or underscore and contain only letters, numbers, and underscores.';
        }
        return '';
    };  

    const validateDbTechnology = (value) => {
        return (!value || value.id === '')?'Please select a Database Technology.':'';
    }
    
    const validateProjectType = (value) => {
        return (!value || value === '')?'Please select a Project Type.':'';
    }

    const validateQuestions = (value) => {
        return (!value || value === '')?'Please enter some questions.':'';
    }


    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleProjectName = (e) => {
        const helperText = validateProjectName(e.target.value);
        const error = (helperText!=='');
        if (validation.name.error){
            setValidation({...validation, name: {helperText, error}});
        }
        setProject({...project, name: e.target.value});
    };

    const handleDbTechnology = (e, newValue) => {
        const newValueId = (!newValue)?null:newValue.id;
        const helperText = validateDbTechnology(newValue);
        const error = (helperText!=='');
        if (validation.dbTechnology.error){
            setValidation({...validation, dbTechnology: {helperText, error}});
        }
        (!newValue)
        setProject({...project, dbTechnology: newValueId});
    };

    const handleProjectType = (e) => {
        const helperText = validateProjectType(e.target.value);
        const error = (helperText!=='');
        if (validation.projectType.error){
            setValidation({...validation, projectType: {helperText, error}});
        }
        setProject({...project, projectType: e.target.value});
    };

    const handleQuestions = (e) => {
        const helperText = validateQuestions(e.target.value);
        const error = (helperText!=='');
        if (validation.questions.error){
            setValidation({...validation, questions: {helperText, error}});
        }
        setProject({...project, questions: e.target.value});
    };

    const handleAdditionalInfo = (e) => {
        setProject({...project, additionalInfo: e.target.value});
    };

    const handleNamingRules = (e) => {
        setProject({...project, namingRules: e.target.value});
    };

    const handleSubmit = async (e) => {
        //Validation
        console.log(project);
        const newValidation = validation;

        //Validating name
        newValidation.name.helperText = validateProjectName(project.name);
        newValidation.name.error = (newValidation.name.helperText!=='');

        //Validating dbTechnology
        newValidation.dbTechnology.helperText = validateDbTechnology(project.dbTechnology);
        newValidation.dbTechnology.error = (newValidation.dbTechnology.helperText!=='');

        //Validating projectType
        newValidation.projectType.helperText = validateProjectType(project.projectType);
        newValidation.projectType.error = (newValidation.projectType.helperText!=='');

        //Validating questions
        newValidation.questions.helperText = validateQuestions(project.questions);
        newValidation.questions.error = (newValidation.questions.helperText!=='');

        console.log(newValidation);
        //setValidation(newValidation);
        setValidation({...validation, newValidation});
        
        if (!(
            newValidation.name.error ||
            newValidation.dbTechnology.error ||
            newValidation.projectType.error ||
            newValidation.questions.error))
            onSubmit(project);
    };
    

    return (
    <Modal open={open} onClose={onCancel}>
        <Box component="main" sx={style}>
            <FormControl>
                <Grid container spacing={2} alignItems="end" alignContent="flex-end">
                    <Grid item xs={12}>
                        <div sx={{width:'100%'}}>
                            <Box sx={{display:'flex', justifyContent:'space-between'}}>
                                <TextField id="projectName" label="Project Name" variant="outlined" required onChange={handleProjectName}
                                    error = {validation.name.error}
                                    helperText={validation.name.helperText}
                                />
                                <Autocomplete
                                    disablePortal
                                    id="dbTechnology"
                                    getOptionLabel={(option) => option.name ?? option}
                                    options={databaseTechnologies}
                                    onChange={handleDbTechnology}
                                    renderInput={(params) => <TextField {...params} required sx={{minWidth:200}} label="DB Technology"
                                    error={validation.dbTechnology.error}
                                    helperText={validation.dbTechnology.helperText}/>}
                                />
                                <Box>
                                    <ToggleButtonGroup
                                        color= {validation.projectType.error?"error":"primary"}
                                        exclusive
                                        aria-label="Project Type"
                                        value={project.projectType}
                                        onChange={handleProjectType}
                                    >
                                        <ToggleButton value="analytical">Analytical</ToggleButton>
                                        <ToggleButton value="transactional">Transactional</ToggleButton>
                                    </ToggleButtonGroup>
                                    <FormHelperText error={validation.projectType.error}>{validation.projectType.helperText}</FormHelperText>
                                </Box>
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
                                    onChange={handleQuestions}
                                    multiline 
                                    minRows={10}
                                    maxRows={10} 
                                    sx={{width:'100%'}}
                                    required
                                    error={validation.questions.error}
                                    helperText={validation.questions.helperText}
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
                                    onChange={handleAdditionalInfo}
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
                                    onChange={handleNamingRules}
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
                                <Button variant="outlined" onClick={onCancel}>Cancel</Button>
                                <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                            </Box>
                        </div>
                    </Grid>
                </Grid>
            </FormControl>
        </Box>
    </Modal>
  );
}