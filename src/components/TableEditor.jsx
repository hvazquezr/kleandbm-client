import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Tab from '@mui/material/Tab';
import { useSnackbar } from 'notistack';
import {TabContext, TabList, TabPanel}  from '@mui/lab';

import PsychologyIcon from '@mui/icons-material/Psychology';

import AITableEditor from './AITableEditor';
import ColumnListEditor from './ColumnListEditor';

import { databaseTechnologies } from '../config/Constants'

const boxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  height: 650,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 10,
  p: 4,
};

const buttonStyle = {
    width: 200
};

export default function TableEditor({node, projectId, dbTechnologyId, onDone, onCancel}) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [tableName, setTableName] = useState(node.data.name);
    const [columns, setColumns] = useState(node.data.columns);
    const [description, setDescription] = useState(node.data.description);
    const [cancelDisabled, setCancelDisabled] = useState(false);
    const [tabValue, setTabValue] = useState('1');
    const [showAIEditor, setShowAIEditor] = useState(false);
    const [dbTechnology, setDbTechnology] = useState();
    const [dataTypes, setDataTypes] = useState([]);
    const [columnErrors, setColumnErrors] = useState({});
    const [tableNameError, setTableNameError] = useState("");    

    useEffect(() => {
        const technology = databaseTechnologies.find(tech => tech.id === dbTechnologyId);
    
        if (technology) {
            setDbTechnology(technology);
            const tempDataTypes = technology.dataTypes.filter(dt => dt.active);
            // Sort the array based on the 'name' attribute
            tempDataTypes.sort((a, b) => {
              // Use localeCompare for a case-insensitive comparison and to handle non-ASCII characters correctly
              return a.name.localeCompare(b.name);
            });
            setDataTypes(tempDataTypes);
        }
      }, []);

      const validateColumns = (columns) => {
        const errors = {};
        // Object to track occurrence of column names
        const seenColumnNames = {};
    
        columns.forEach(column => {
            // Perform other validations first
            let error = dbTechnology.columnNameValidator(column.name);
            if (error !== '') {
                errors[column.id] = error; // Store the error message against the column's ID
                enqueueSnackbar(error, {variant: 'error'});
            }
    
            // Then check for repeated column names
            if (seenColumnNames[column.name.toUpperCase()]) {
                // If the name is repeated and no other validation error was recorded for this column
                if (!errors[column.id]) {
                    error = 'Column name is repeated.';
                    errors[column.id] = error; // Associate the error with the second occurrence
                    enqueueSnackbar(error, {variant: 'error'});
                }
            } else {
                // Mark this column name as seen if no error was found
                seenColumnNames[column.name.toUpperCase()] = true;
            }
        });
    
        return errors;
    };    
    


    const handleEditTableName = (e) => {
        setTableName(e.target.value);
    };

    const handleEditDescription = (e) => {
        setDescription(e.target.value);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleDone = (e) => {
        let errors = {};
        let tbNameError = "";
        closeSnackbar();
        setColumnErrors({});
        errors = validateColumns(columns);
        tbNameError = dbTechnology.tableNameValidator(tableName);
        if (tbNameError !== ""){
            setTableNameError(tbNameError);
            enqueueSnackbar(tbNameError, {variant: 'error'});
        }
        // If there are no errors reported
        if (Object.keys(errors).length === 0 && tbNameError===""){
            //@TODO: need to add description to the interface
            //const data = {id: node.data.id, name: tableName, columns, description: ''};
            node.data.name = tableName;
            node.data.columns = columns;
            node.data.description = description;
            setCancelDisabled(true);
            onDone(node);
        }
        else{
            setColumnErrors(errors);
        }
    };

    const handleAITableEditorRecommendations = (recommendations) => {
        setTableName(recommendations.name);
        setColumns(recommendations.columns);
        setDescription(recommendations.description);
        setShowAIEditor(false);
    }
    
      const updateColumn = (updatedColumn) => {
        const newColumns = columns.map(column =>
          column.id === updatedColumn.id ? updatedColumn : column
        );
        setColumns(newColumns);
      };
    
      const addColumn = () => {
        const newColumn = {
          id: nanoid(),
          name: '',
          dataType: null,
          //dataType: dataTypes[0]?.name || '',
          description: ''
        };
        setColumns([...columns, newColumn]);
      };
    
      const removeColumn = (columnId) => {
        setColumns(columns.filter(column => column.id !== columnId));
      };    

    return(
        <>
        <Modal open={true}>
            <Box sx={boxStyle}>
                <Stack direction="column" spacing={1}>
                    <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%'}}>
                        <TextField  sx={{width:'100%'}} label="Table Name" variant="outlined" value={tableName} onChange={handleEditTableName} required error={tableNameError !== ""}/>
                        <Tooltip title="Edit Table with AI">
                            <span><Button sx={{height:56, marginLeft:1}} variant='contained' size='large' onClick={() => {setShowAIEditor(true)}} color='secondary'><PsychologyIcon /></Button></span>
                        </Tooltip>
                    </Box>
                    <TabContext value={tabValue} sx={{width:'100%'}}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleTabChange}>
                                <Tab label="Columns" value="1" />
                                <Tab label="Description" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel value="1" sx={{height:400}}>
                            <Stack direction="column" spacing={1} alignItems="center">
                                <div style={{ height: 320, width: 875 }}>
                                <ColumnListEditor columns={columns}
                                    setColumns={setColumns}
                                    onUpdateColumn = {updateColumn}
                                    onAddColumn = {addColumn}
                                    onRemoveColumn = {removeColumn}
                                    dataTypes = {dataTypes}
                                    columnErrors={columnErrors}
                                />
                                </div>
                            </Stack>
                        </TabPanel>
                        <TabPanel value="2" sx={{height:400}}>
                            <TextField 
                                    id="desc"
                                    label="Table Description"
                                    variant="outlined" 
                                    onChange={handleEditDescription}
                                    multiline 
                                    minRows={10}
                                    maxRows={10} 
                                    sx={{width:'100%'}}
                                    value = {description}
                                />  
                        </TabPanel>                           
                    </TabContext>
                        <Box sx={{display:'flex', justifyContent:'space-between', width: '100%'}}>
                            <Button variant="outlined" sx={buttonStyle} onClick={onCancel} disabled={cancelDisabled}>Cancel</Button>
                            <LoadingButton variant="contained" sx={buttonStyle} onClick={handleDone}>Done</LoadingButton>
                        </Box>
                </Stack>
            </Box>
        </Modal>
        {showAIEditor && <AITableEditor 
            onCancel={() => {setShowAIEditor(false)}}
            onDone={handleAITableEditorRecommendations}
            projectId={projectId}
            currentTable={{
                name: tableName,
                id: node.data.id,
                columns,
                description
            }}/>
        }
        </>
    );
}