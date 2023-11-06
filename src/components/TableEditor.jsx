import * as React from 'react';
import { useState, useEffect } from 'react';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


const boxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  height: 600,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 10,
  p: 4,
};

const buttonStyle = {
    width: 200
}


export default function TableEditor({table, onDone, onCancel}) {
    const [tableName, setTableName] = useState(table.data.label);
    const [columns, setColumns] = useState(table.data.columns);

    useEffect (() => {
        setTableName(table.data.label);
        setColumns(table.data.columns);
    }, [table]);

    const handleEditTableName = (e) => {
        setTableName(e.target.value);
    };

    const handleDone = (e) => {
        const data = {label: tableName, columns};
        onDone(data);
    }

    return(
        <Modal
            open={true}
        >
            <Box sx={boxStyle}>
                <Stack spacing={2} direction="row" sx={{width:'100%'}}>
                    <TextField label="Name" variant="standard" value={tableName} onChange={handleEditTableName}/>
                    <Button variant="outlined" sx={buttonStyle} onClick={onCancel}>Cancel</Button>
                    <Button variant="contained" sx={buttonStyle} onClick={handleDone}>Done</Button>
                </Stack>
            </Box>
        </Modal>
    );
}