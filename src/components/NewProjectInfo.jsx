import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton';
import Modal from '@mui/material/Modal';
import {TextField, FormControl, ToggleButtonGroup, ToggleButton, Autocomplete, Typography} from '@mui/material';
import Tab from '@mui/material/Tab';
import {TabContext, TabList, TabPanel}  from '@mui/lab';

import CircularWithValueLabel from './CircularProgressWithLabel';
import { useSnackbar } from 'notistack';

import { databaseTechnologies } from '../config/Constants';

import '../components/css/kalmdbm.css';

const supportedDbTypes = [
    {id:1, label:'Snowflake'},
    {id:2, label:'Databricks'}
];

const style = {
    position: 'relative', // To support cancel button
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: 600,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 10,
    borderRadiius: 4,
    p: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const progressStyle = {
    position: 'absolute',
    top: -15, // Adjust as needed for spacing from the top
    right: -15, // Adjust as needed for spacing from the right
    height: 200,
    width: '100%',
    border: '1px solid #000',
  };
  
export default function NewProjectInfo({onCancel, isComplete, onSubmit}) {
    const [tabValue, setTabValue] = useState('1');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    // Owner should have id
    const [project, setProject] = useState({id: nanoid(), active: true, description:'Default description. To be changed by AI.'});
    const [submitting, setSubmitting] = useState(false);
    const [validation, setValidation] = useState({
        name: {error:false, helperText: ''},
        dbTechnology: {error:false, helperText: ''},
        projectType: {error:false, helperText: ''},
        questions: {error:false, helperText: ''}
    });

    const handleCancel = () => {
        closeSnackbar();
        onCancel();
    }

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
        setProject({...project, name: e.target.value});
    };

    const handleProjectNameOnBlur = (e) => {
        const helperText = validateProjectName(e.target.value);
        const error = (helperText!=='');
        if (validation.name.error){
            setValidation({...validation, name: {helperText, error}});
            error && enqueueSnackbar(helperText, {variant: 'error'});
        }
    }

    const handleDbTechnology = (e, newValue) => {
        const newValueId = (!newValue)?null:newValue.id;
        const helperText = validateDbTechnology(newValue);
        const error = (helperText!=='');
        if (validation.dbTechnology.error){
            setValidation({...validation, dbTechnology: {helperText, error}});
            error && enqueueSnackbar(helperText, {variant: 'error'});
        }
        (!newValue)
        setProject({...project, dbTechnology: newValueId});
    };

    const handleProjectType = (e) => {
        const helperText = validateProjectType(e.target.value);
        const error = (helperText!=='');
        if (validation.projectType.error){
            setValidation({...validation, projectType: {helperText, error}});
            error && enqueueSnackbar(helperText, {variant: 'error'});
        }
        setProject({...project, projectType: e.target.value});
    };

    const handleQuestions = (e) => {
        setProject({...project, questions: e.target.value});
    };

    const handleQuestionsOnBlur = (e) => {
        const helperText = validateQuestions(e.target.value);
        const error = (helperText!=='');
        if (validation.questions.error){
            setValidation({...validation, questions: {helperText, error}});
            error && enqueueSnackbar(helperText, {variant: 'error'});
        }
    };
    const handleAdditionalInfo = (e) => {
        setProject({...project, additionalInfo: e.target.value});
    };

    const handleNamingRules = (e) => {
        setProject({...project, namingRules: e.target.value});
    };

    const handleSubmit = async (e) => {
        //Validation
        //console.log(project);
        const newValidation = validation;
        closeSnackbar();

        //Validating name
        newValidation.name.helperText = validateProjectName(project.name);
        newValidation.name.error = (newValidation.name.helperText!=='');
        if (newValidation.name.error){
            enqueueSnackbar(newValidation.name.helperText, {variant: 'error'});
        }

        //Validating dbTechnology
        newValidation.dbTechnology.helperText = validateDbTechnology(project.dbTechnology);
        newValidation.dbTechnology.error = (newValidation.dbTechnology.helperText!=='');
        if (newValidation.dbTechnology.error){
            enqueueSnackbar(newValidation.dbTechnology.helperText, {variant: 'error'});
        }

        //Validating projectType
        newValidation.projectType.helperText = validateProjectType(project.projectType);
        newValidation.projectType.error = (newValidation.projectType.helperText!=='');
        if (newValidation.projectType.error){
            enqueueSnackbar(newValidation.projectType.helperText, {variant: 'error'});
        }

        //Validating questions
        newValidation.questions.helperText = validateQuestions(project.questions);
        newValidation.questions.error = (newValidation.questions.helperText!=='');
        if (newValidation.questions.error){
            enqueueSnackbar(newValidation.questions.helperText, {variant: 'error'});
        }

        //console.log(newValidation);
        //setValidation(newValidation);
        setValidation({...validation, newValidation});
        
        if (!(
            newValidation.name.error ||
            newValidation.dbTechnology.error ||
            newValidation.projectType.error ||
            newValidation.questions.error)){
                setSubmitting(true);
                onSubmit(project);
            }
    };
    

    return (
    <Modal open={true} >
        <Box sx={style}>
            <FormControl>
                <Grid container spacing={2} alignItems="end" alignContent="flex-end">
                    <Grid item xs={12}>
                        <div sx={{width:'100%'}}>
                            <Box sx={{display:'flex', justifyContent:'space-between'}}>
                                <TextField id="projectName" label="Project Name" variant="outlined" required
                                    onChange={handleProjectName}
                                    onBlur={handleProjectNameOnBlur}
                                    error = {validation.name.error}
                                />
                                <Autocomplete
                                    disablePortal
                                    id="dbTechnology"
                                    getOptionLabel={(option) => option.name ?? option}
                                    options={databaseTechnologies}
                                    onChange={handleDbTechnology}
                                    renderInput={(params) => <TextField {...params} required sx={{minWidth:200}} label="DB Technology"
                                    error={validation.dbTechnology.error}
                                />}
                                />
                                <Box>
                                    <ToggleButtonGroup
                                        exclusive
                                        aria-label="Project Type"
                                        value={project.projectType}
                                        onChange={handleProjectType}
                                        className={validation.projectType.error ? 'error-border' : ''}
                                    >
                                        <ToggleButton value="analytical">Analytical</ToggleButton>
                                        <ToggleButton value="transactional">Transactional</ToggleButton>
                                    </ToggleButtonGroup>
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
                                <TextField 
                                    id="questions"
                                    label="Questions"
                                    variant="outlined"
                                    placeholder="Enter the list of business questions the data model should be able to answer. 
For example:
Which products have the highest demand across different demographics?
What are the distribution channels with the highest sales volumes?
How do seasonality and trends affect sales of specific product categories?
What is the impact of promotions and discounts on product sales?"
                                    onChange={handleQuestions}
                                    onBlur={handleQuestionsOnBlur}
                                    multiline 
                                    minRows={10}
                                    maxRows={10} 
                                    sx={{width:'100%'}}
                                    required
                                    error={validation.questions.error}
                                    value = {project.questions}
                                />                            
                            </TabPanel>
                            <TabPanel value="2">
                                <TextField 
                                    id="additionalInfo"
                                    label="Additional Information"
                                    variant="outlined"
                                    placeholder="Provide additional information that should be taken into consideration.
For example:
Implement slowly changing dimension (SCD) type 2 for employee data to track historical changes in employee attributes and hierarchies over time.
Include a 'last_updated' timestamp column in each table to track the date and time of the last data modification, supporting auditing and data lineage.
Ensure that customer addresses are stored as separate fields for street, city, state, and zip code, allowing for easy address validation and geocoding."
                                    onChange={handleAdditionalInfo}
                                    multiline 
                                    minRows={10}
                                    maxRows={10} 
                                    sx={{width:'100%'}}
                                    value={project.additionalInfo}
                                />                            
                            </TabPanel>
                            <TabPanel value="3">
                                <TextField 
                                    id="namingRules"
                                    label="Naming Conventions"
                                    variant="outlined"
                                    placeholder='List naming conventions that need to be observed.
For example:
Fact Table Prefix: All fact tables start with the prefix "FACT_" to distinguish them from dimension tables.
Dimension Table Prefix: All dimension tables start with the prefix "DIM_" for clear identification.
Table Naming Convention: Use descriptive, uppercase names for tables, such as "CUSTOMER_DIM" or "PRODUCT_FACT".
Column Naming Convention: Use lowercase names for columns, separated by underscores, ensuring readability and consistency.
Primary Key Naming: Primary keys should be named with the format "table_name_ID" to denote uniqueness, such as "customer_id" in the "CUSTOMER_DIM" table.
Numeric Columns: Numeric columns should have clear and concise names, such as "quantity_sold" or "unit_price", to convey their purpose effectively.'
                                    onChange={handleNamingRules}
                                    multiline 
                                    minRows={10}
                                    maxRows={10} 
                                    sx={{width:'100%'}}
                                    value={project.namingRules}
                                />                            
                            </TabPanel>
                        </TabContext>
                    </Grid>
                    <Grid item xs={12} >
                        <div sx={{width:'100%'}}>
                            <Box sx={{display:'flex', justifyContent:'space-between'}}>
                                <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
                                <LoadingButton variant="contained" onClick={handleSubmit} loading={submitting}>Submit</LoadingButton>
                            </Box>
                        </div>
                    </Grid>
                </Grid>
            </FormControl>
            {submitting && 
                        <Box id="progressBox" sx={{
                            position: 'absolute',
                            width: '100%',
                            backgroundColor: '#fff',
                            top: 0,
                            bottom: '120px',
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'space-around',
                            zIndex: 1,
                        }}>
                            <CircularWithValueLabel 
                                totalTime={100}
                                isComplete={isComplete}
                                animatedSequence={
                                    [
                                        'Analyzing Request', 
                                        5000,
                                        'Schema Design',
                                        10000,
                                        'Field Definitions',
                                        15000,
                                        'Determining Relationships',
                                        15000,
                                        'Descriptions Generation',
                                        15000,
                                        'Retrieving Result'
                                        ]
                                }
                            />
                        </Box>}
        </Box>
    </Modal>
  );
}