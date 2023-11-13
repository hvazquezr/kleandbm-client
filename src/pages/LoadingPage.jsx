import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import { TypeAnimation } from 'react-type-animation';
import Typography from '@mui/material/Typography';

export default function LoadingPage() {

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <Typography variant="h5" color="inherit">
        <TypeAnimation
            preRenderFirstString={false}
            sequence={['Loading...']}
            speed={50}
            style={{ fontSize: '2em', height:100, display: 'block' }}
            repeat={0}
                        />
        </Typography>
        
      </Backdrop>
    </div>
  );
}