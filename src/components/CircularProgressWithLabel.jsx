import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { TypeAnimation } from 'react-type-animation';

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress thickness={5} variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

const CircularWithValueLabel = ({ isComplete, totalTime, animatedSequence }) => {
  const [percentComplete, setPercentComplete] = useState(0);

  useEffect(() => {
    let interval;

    // Update percent complete only if not complete and below 95%
    if (!isComplete && percentComplete < 95) {
      interval = setInterval(() => {
        setPercentComplete(prev => {
          const increment = 95 / totalTime;
          let newPercent = prev + increment;
          newPercent = newPercent > 95 ? 95 : newPercent;

          return newPercent;
        });
      }, 1000);
    }

    // Set to 100% if isComplete is true
    if (isComplete) {
      setPercentComplete(100);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isComplete, percentComplete, totalTime]);

  return (
    <Stack order="column" justifyContent="space-evenly" alignItems="center" spacing={2}>
      <CircularProgressWithLabel size={80} value={percentComplete} />
      <Typography variant="h5">
            <TypeAnimation
              sequence={animatedSequence}
              cursor={true}
              repeat={0}
            />
        </Typography>
    </Stack>
  );
};

export default CircularWithValueLabel;