import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';

import CircularWithValueLabel from './CircularProgressWithLabel';
import {apiUrl} from '../config/UrlConfig'



const boxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  height: 380,
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


export default function NamingRulesEditor({onDone, onCancel, projectId}) {
    const {getAccessTokenSilently} = useAuth0();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [namingRules, setNamingRules] = useState("");
    const [isComplete, setIsComplete] = useState(false);

    async function handleSubmit() {
        setIsSubmitting(true);
        let pollingInterval; // Declare the variable in an accessible scope
    
        try {
            const token = await getAccessTokenSilently();
            // Initial request to start the job and get jobId
            const startResponse = await axios.post(`${apiUrl}/projects/${projectId}/apply_naming_rules`, { prompt: namingRules }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
    
            const jobId = startResponse.data.jobId; // Assuming jobId is returned
    
            // Function to poll for job status
            const pollJobStatus = async () => {
                try {
                    const statusResponse = await axios.get(`${apiUrl}/jobs/${jobId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });
    
                    if (statusResponse.data && statusResponse.data.result !== null) {
                        clearInterval(pollingInterval);
                        // setIsComplete(true);
                        onDone(statusResponse.data.result);
                    }
                } catch (pollError) {
                    console.error("Error polling job status", pollError);
                    clearInterval(pollingInterval);
                    onDone(null);
                    throw pollError; // or handle it differently
                }
            };
    
            // Delay the start of polling by 10 seconds, then poll every 5 seconds
            const initialDelay = 10000; // 10 seconds
            setTimeout(() => {
                pollJobStatus(); // Execute once after the initial delay
                pollingInterval = setInterval(pollJobStatus, 3000); // Continue polling every 3 seconds
            }, initialDelay);
    
        } catch (error) {
            console.error("Error applying new naming rules.", error);
            onDone(null);
            throw error;
        }
    }
    

    return(
        <Modal open={true}>
            <Box sx={boxStyle}>
                <Stack direction="column" spacing={1} sx={{width:'100%'}}>
                    <TextField 
                                    id="desc"
                                    label="Naming Conventions"
                                    variant="outlined" 
                                    onChange={() => {setNamingRules(event.target.value)}}
                                    multiline 
                                    minRows={10}
                                    maxRows={10} 
                                    sx={{width:'100%'}}
                                    value = {namingRules}
                                /> 
                    <div sx={{width:'100%'}}>
                        <Box sx={{display:'flex', justifyContent:'space-between'}}>
                            <Button variant="outlined" sx={buttonStyle} onClick={onCancel} >Cancel</Button>
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
                                isComplete={ isComplete}
                                animatedSequence={
                                    [
                                        'Analyzing Request', 
                                        3000,
                                        'Determing Changes',
                                        10000,
                                        'Implementing Changes',
                                        15000,
                                        'Reviweing Definitions',
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