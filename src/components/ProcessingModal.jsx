import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { ThreeDotsBounce } from './TreeDotsBounce';
import { TypeAnimation } from 'react-type-animation';


const boxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 10,
  p: 4,
};

const contentStyle = {
  display: 'flex',
  alignItems: 'center',
};

export default function ProcessingModal({ text }) {
  return (
    <div>
      <Modal open={true}>
        <Box sx={boxStyle}>
          <Box sx={contentStyle}>
            <ThreeDotsBounce />
            <Typography ml={2}>
                <TypeAnimation
                    sequence={[text]}
                    cursor={true}
                    repeat={0}
                />
            </Typography>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}