import * as React from 'react';
import { useState, useRef } from 'react';
import { nanoid } from 'nanoid';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Tab from '@mui/material/Tab';
import FormHelperText from '@mui/material/FormHelperText';
import {TabContext, TabList, TabPanel}  from '@mui/lab';


import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PsychologyIcon from '@mui/icons-material/Psychology';

import { DataGrid, useGridApiRef } from '@mui/x-data-grid';

import { columnProperties, databaseTechnologies } from '../config/config.jsx';

const boxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  height: 650,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 10,
  p: 4,
};

const buttonStyle = {
    width: 200
};

function CustomNoRowsOverlay() {
    return (
        <Box sx={{ mt:1, display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'}}>No Columns</Box>
    );
};

export default function TableEditor({node, dbTechnology, onDone, onCancel}) {
    const [tableName, setTableName] = useState(node.data.name);
    const [columns, setColumns] = useState(node.data.columns);
    const [description, setDescription] = useState(node.data.description);
    const [selectedColumnIds, setSelectedColumnIds] = useState([]);
    const [cancelDisabled, setCancelDisabled] = useState(false);
    const [tabValue, setTabValue] = useState('1');
    //const [apiRef, setApiRef] = useState(useGridApiRef());

    const apiRef = useGridApiRef();


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
        //@TODO: need to add description to the interface
        //const data = {id: node.data.id, name: tableName, columns, description: ''};
        node.data.name = tableName;
        node.data.columns = columns;
        node.data.description = description;
        setCancelDisabled(true);
        onDone(node);
    };

    const handleAddColumn = () => {
        let id = nanoid();
        setColumns((oldColumns) => [...oldColumns, { id, key: id, name: '', dataType: '', primaryKey: false, description: '' }]);
        apiRef.current.startRowEditMode({id});
    };

    const handleRowUpdate = (newColumn, oldColumn) => {
        //const updatedColumn = { ...newRow, isNew: false };
        setColumns(columns.map((column) => (column.id === newColumn.id ? newColumn : column)));
        return newColumn;
    };

    function handleSelectionChange (ids) {
        setSelectedColumnIds(ids);
    };

    function handleDeleteColumn(){
        setColumns(columns.filter(column => !selectedColumnIds.includes(column.id)));
    }

    function getDataTypesByDbTechnologyId(id) {
        const dbTechnology = databaseTechnologies.find(tech => tech.id === id);
        return dbTechnology ? dbTechnology.dataTypes : null;
    }

    const dataTypeColumn = columnProperties.find(col => col.field === 'dataType');
    if (dataTypeColumn) {
        dataTypeColumn.valueOptions = getDataTypesByDbTechnologyId(dbTechnology);
    }

    return(
        <Modal
            open={true}
        >
            <Box sx={boxStyle}>
                <Stack direction="column" spacing={1}>
                    <Box sx={{display:'flex', justifyContent:'space-between', width:'100%'}}>
                        <TextField  sx={{width:'80%'}} label="Table Name" variant="outlined" value={tableName} onChange={handleEditTableName} required/>
                        &nbsp;&nbsp;
                        <Tooltip title="Edit Table with AI">
                            <span><Button variant='contained' size='large' onClick={handleDeleteColumn} color='secondary'><PsychologyIcon /></Button></span>
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
                            <Stack direction="column" spacing={1} alignItems='flex-end'>
                                <div sx={{width:'100%'}}>
                                    <Tooltip title="Delete Column">
                                        <span><Button variant='contained' size='small' onClick={handleDeleteColumn} color='error' disabled={selectedColumnIds.length === 0}><DeleteIcon /></Button></span>
                                    </Tooltip>
                                    &nbsp;&nbsp;
                                    <Tooltip title="Add Column">
                                        <Button variant='contained' size='small' onClick={handleAddColumn}><AddIcon /></Button>
                                    </Tooltip>
                                </div>
                                <div style={{ height: 320, width: '100%' }}>
                                    <DataGrid
                                        apiRef={apiRef}
                                        rows={columns}
                                        columns={columnProperties}
                                        checkboxSelection
                                        disableRowSelectionOnClick
                                        density='compact'
                                        disableColumnMenu
                                        processRowUpdate={handleRowUpdate}
                                        slots={{
                                            noRowsOverlay: CustomNoRowsOverlay
                                        }}
                                        editMode="row"
                                        onRowSelectionModelChange = {handleSelectionChange}
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
    );
}