import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';

const boxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 10,
  p: 4,
};

const contentStyle = {
  display: 'flex',
  alignItems: 'center',
};

const progressStyle = {
  marginRight: 2,
};

export default function ProcessingModal({ text }) {
  return (
    <div>
      <Modal open={true}>
        <Box sx={boxStyle}>
          <Box sx={contentStyle}>
            <CircularProgress sx={progressStyle} />
            <Typography>{text}</Typography>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}