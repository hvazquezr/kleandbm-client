import * as React from 'react';
import { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';


const boxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 550,
  height: 150,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 10,
  p: 4,
};

const buttonStyle = {
    width: 200
};

export default function DeleteConfirm({node, onConfirm, onCancel}) { 
    const [cancelDisabled, setCancelDisabled] = useState(false);

    const handleDone = (e) => {
        //@tood: need to add description to the interface
        const data = {id: node.id, tableId: node.data.id};
        setCancelDisabled(true);
        onConfirm(data);
    };

    return(
        <Modal
            open={true}
        >
            <Box sx={boxStyle}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="body1">Are you sure you want to delete table <span style={{fontWeight:"bold" }}>{node.data.name}</span>?</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <div sx={{width:'100%'}}>
                            <Box sx={{display:'flex', justifyContent:'space-between'}}>
                                <Button variant="outlined" sx={buttonStyle} onClick={onCancel} disabled={cancelDisabled}>Cancel</Button>
                                <LoadingButton variant="contained" sx={buttonStyle} onClick={handleDone} color="error">Confirm</LoadingButton>
                            </Box>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}