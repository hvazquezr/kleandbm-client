import * as React from 'react';
import { useState } from 'react';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';

import CircularWithValueLabel from './CircularProgressWithLabel';


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


export default function AITableCreator({onDone, onCancel, isComplete}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [instructions, setInstructions] = useState("");

    const handleSubmit = (e) => {
        setIsSubmitting(true);
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
                            <Button variant="outlined" sx={buttonStyle} onClick={onCancel}>Cancel</Button>
                            <LoadingButton variant="contained" sx={buttonStyle} loading={isSubmitting} onClick={handleSubmit}>Submit</LoadingButton>
                        </Box>
                    </div>
                </Stack>
                {isSubmitting && 
                        <Box id="progressBox" sx={{
                            position: 'absolute',
                            width: '100%',
                            backgroundColor: '#fff',
                            top: 0,
                            bottom: '60px',
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'space-around',
                            zIndex: 1,
                        }}>
                            <CircularWithValueLabel 
                                totalTime={40}
                                isComplete={isComplete}
                                animatedSequence={
                                    [
                                        'Analyzing Request', 
                                        3000,
                                        'Table Design',
                                        10000,
                                        'Field Definitions',
                                        15000,
                                        'Determining Relationships',
                                        5000,
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