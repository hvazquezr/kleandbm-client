import React from 'react';
import { Button, Box, Typography, IconButton, Checkbox, FormControlLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Cookies from 'js-cookie';

const TourTooltip = ({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
  skipProps,
  isLastStep,
  size,
}) => {
  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      Cookies.set('tour_seen', 'true', { expires: 365 });
    } else {
      Cookies.remove('tour_seen');
    }
  };

  return (
    <Box {...tooltipProps} p={2} bgcolor="background.paper" borderRadius={1} boxShadow={3} position="relative">
      <IconButton
        {...closeProps}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      {step.title && (
        <Typography variant="h6" gutterBottom>
          {step.title}
        </Typography>
      )}
      <Typography variant="body1" paragraph>
        {step.content}
      </Typography>
      {step.image && (
        <div style={{ textAlign: 'center' }}>
          <img
            src={step.image}
            alt={step.imageAlt}
            style={{
              width: '40%',
              border: '0.5px solid',
              borderColor: 'gray',
            }}
          />
        </div>
      )}
      <Box display="flex" justifyContent="space-between" mt={2}>
        {!isLastStep && (
          <Button variant="text" color="primary" {...skipProps}>
            Skip
          </Button>
        )}
        {isLastStep && (
          <FormControlLabel
            control={<Checkbox onChange={handleCheckboxChange} />}
            label="Don't show this again"
          />
        )}
        <Box display="flex" ml="auto">
          {index > 0 && (
            <Button variant="contained" color="primary" {...backProps} style={{ marginRight: 8 }}>
              Back
            </Button>
          )}
          {continuous ? (
            <Button variant="contained" color="primary" {...primaryProps}>
              Next ({index + 1}/{size})
            </Button>
          ) : (
            <Button variant="contained" color="primary" {...closeProps}>
              Close
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TourTooltip;