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


export default function AITableEditor({onDone, onCancel, projectId, currentTable}) {
    const {getAccessTokenSilently} = useAuth0();
    const [cancelDisabled, setCancelDisabled] = useState(false);
    const [instructions, setInstructions] = useState("");

    async function handleSubmit() {
        setCancelDisabled(true);
        try {
          const token = await getAccessTokenSilently();
          const response = await axios.post(`http://127.0.0.1:5000/api/v1/projects/${projectId}/tables/${currentTable.id}/aitableedits`, {prompt: instructions, currentTable}, {
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
              },
              });
              onDone(response.data);
        } catch (error) {
          console.error("Error retrieving recommended edits by AI", error);
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
                                    label="Instructions"
                                    placeholder="Provide instructions to modify this table, this can include adding, removing or modifying existing columns as well as description."
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
                            <LoadingButton variant="contained" sx={buttonStyle} loading={cancelDisabled} onClick={handleSubmit}>Submit</LoadingButton>
                        </Box>
                    </div>
                </Stack>
            </Box>
        </Modal>
    );
}