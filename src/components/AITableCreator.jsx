import * as React from 'react';
import { useState } from 'react';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';


const boxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 350,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 10,
  p: 4,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const buttonStyle = {
    width: 200
};


export default function AITableCreator({onDone, onCancel}) {
    const [cancelDisabled, setCancelDisabled] = useState(false);
    const [instructions, setInstructions] = useState("");

    const handleDone = (e) => {
        setCancelDisabled(true);
        onDone(instructions);
    };

    return(
        <Modal open={true}>
            <Box sx={boxStyle}>
                <Stack direction="column" spacing={1} sx={{width:'100%'}}>
                    <TextField 
                                    id="desc"
                                    label="Table Instructions"
                                    placeholder="Provide instructions that describe the intended content or fields for the new table."
                                    variant="outlined" 
                                    onChange={() => {setInstructions(event.target.value)}}
                                    multiline 
                                    minRows={10}
                                    maxRows={10} 
                                    sx={{width:'100%'}}
                                    value = {instructions}
                                /> 
                    <div sx={{width:'100%'}}>
                        <Box sx={{display:'flex', justifyContent:'space-between'}}>
                            <Button variant="outlined" sx={buttonStyle} onClick={onCancel} disabled={cancelDisabled}>Cancel</Button>
                            <LoadingButton variant="contained" sx={buttonStyle} loading={cancelDisabled} onClick={handleDone}>Done</LoadingButton>
                        </Box>
                    </div>
                </Stack>
            </Box>
        </Modal>
    );
}