import * as React from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const logoGrayStyle = {
  width: 'auto',
  height: '15px',
  opacity: .5, 
  filter: 'brightness(50%) contrast(150%)'
};

function toLocalTime(isoDate) {
  const localDate = new Date(isoDate + 'Z');

  const formattedDate = localDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short', // Use 'long' to get the full month name
    day: 'numeric'
  });
  
  const formattedTime = localDate.toLocaleTimeString(undefined, {
    hour: 'numeric', // Use 'numeric' to avoid leading zeros
    minute: '2-digit',
    hour12: true // Set to true for 12-hour format with AM/PM
  });
  
  return `${formattedDate}, ${formattedTime}`;
};

export default function DrawerControl({
    handleDrawerOpen,
    openDrawer,
    targetClass,
    isVersionHistory,
    lastChange,
    projectId
    }) {
      
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', transform: openDrawer ? 'translateX(-40px)' : 'translateX(0)' }}>
        <Tooltip title="Navigation Panel">
          <IconButton
            onClick={handleDrawerOpen}
            size="small"
            sx={{
                padding: 0,
                marginLeft: 0,
                transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
                marginRight: 1,
                ...(openDrawer && { visibility: 'hidden' })  // Hide the button completely once it's fully transparent
              }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <MenuIcon sx={{ width: 30, height: 30, color:'#DDD' }} className={targetClass}/>
          </IconButton>
        </Tooltip>
       {!isVersionHistory ? 
          <img src={"/images/kleandbmaiWhite.svg"} style={logoGrayStyle}/>
        :
        <React.Fragment>
        <Tooltip title="Go back to Project">
        <IconButton
            onClick={() => {navigate(`/project/${projectId}`)}}
            size="small"
            sx={{
                padding: 0,
                marginLeft: 0,
                transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
                marginRight: 1
              }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <ArrowBackIcon sx={{ width: 30, height: 30, color:'#DDD' }} className={targetClass}/>
          </IconButton>
        </Tooltip>
        {lastChange.name ? (
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Typography variant="subtitle" sx={{ color: '#AAA', marginRight: '8px'  }}>{lastChange.name}</Typography>
            <Typography variant="caption" sx={{ color: '#AAA', fontStyle: "italic" }}>{toLocalTime(lastChange.timestamp)}</Typography>
          </div>
        ) : (
          <Typography variant="subtitle" sx={{ color: '#AAA' }}>{toLocalTime(lastChange.timestamp)}</Typography>
        )}
      </React.Fragment>
        }
      </Box>
    </React.Fragment>
  );
}