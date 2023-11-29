import * as React from 'react';
import { useState } from 'react';
import { nanoid } from 'nanoid';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';



import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import { DataGrid, useGridApiRef } from '@mui/x-data-grid';

import { columnProperties } from '../config/config.jsx';


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

export default function TableEditor({table, onDone, onCancel}) {
    const [tableName, setTableName] = useState(table.data.label);
    const [columns, setColumns] = useState(table.data.columns);
    const [selectedColumnIds, setSelectedColumnIds] = useState([]);

    const apiRef = useGridApiRef();

    const handleEditTableName = (e) => {
        setTableName(e.target.value);
    };

    const handleDone = (e) => {
        const data = {label: tableName, columns};
        onDone(data);
    };

    const handleAddColumn = () => {
        let newId = nanoid();
        setColumns((oldColumns) => [...oldColumns, { id:newId, name: '', dataType: '', primaryKey: false, description: '' }]);
        apiRef.current.startRowEditMode({id:newId});
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

    return(
        <Modal
            open={true}
        >
            <Box sx={boxStyle}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField label="Name" variant="outlined" value={tableName} onChange={handleEditTableName} required fullWidth/>
                    </Grid>
                    <Grid item xs={12} textAlign='right'>
                        <Tooltip title="Delete Column">
                            <span><Button variant='contained' size='small' onClick={handleDeleteColumn} color='error' disabled={selectedColumnIds.length === 0}><DeleteIcon /></Button></span>
                        </Tooltip>
                        &nbsp;&nbsp;
                        <Tooltip title="Add Column">
                            <Button variant='contained' size='small' onClick={handleAddColumn}><AddIcon /></Button>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12}>
                        <DataGrid
                            apiRef={apiRef}
                            sx={{height:400}}
                            rows={columns}
                            columns={columnProperties}
                            autoPageSize
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
                        >
                        </DataGrid>
                    </Grid>
                    <Grid item xs={12}>
                        <div sx={{width:'100%'}}>
                            <Box sx={{display:'flex', justifyContent:'space-between'}}>
                                <Button variant="outlined" sx={buttonStyle} onClick={onCancel}>Cancel</Button>
                                <Button variant="contained" sx={buttonStyle} onClick={handleDone}>Done</Button>
                            </Box>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}