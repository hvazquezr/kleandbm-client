import * as React from 'react';
import { useState } from 'react';
import { nanoid } from 'nanoid';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';


const boxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  height: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 10,
  p: 4,
};

const buttonStyle = {
    width: 200
};


export default function AITableCreator({projectId, onDone, onCancel}) {
    const [cancelDisabled, setCancelDisabled] = useState(false);
    const [instructions, setInstructions] = useState("");
    console.log('Opening AI Table Creator');

    const handleDone = (e) => {
        //@TODO: need to add description to the interface
        //const data = {id: node.data.id, name: tableName, columns, description: ''};
        node.data.name = tableName;
        node.data.columns = columns;
        node.data.description = description;
        setCancelDisabled(true);
        onDone(node);
    };
    return(
        <Modal open={true}>
            <Box sx={boxStyle}>
                <Stack direction="column" spacing={1}>
                    <TextField 
                                    id="desc"
                                    label="Table Instructions"
                                    variant="outlined" 
                                    onChange={() => {setInstructions(e.target.value)}}
                                    multiline 
                                    minRows={10}
                                    maxRows={10} 
                                    sx={{width:'100%'}}
                                    value = {instructions}
                                /> 
                    <div sx={{width:'100%'}}>
                        <Box sx={{display:'flex', justifyContent:'space-between'}}>
                            <Button variant="outlined" sx={buttonStyle} onClick={onCancel} disabled={cancelDisabled}>Cancel</Button>
                            <LoadingButton variant="contained" sx={buttonStyle} onClick={handleDone}>Done</LoadingButton>
                        </Box>
                    </div>
                </Stack>
            </Box>
        </Modal>
    );
}