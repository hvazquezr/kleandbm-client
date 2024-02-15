import * as React from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';

export default function DrawerControl({
    handleDrawerOpen,
    openDrawer
    }) {

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
            <MenuIcon sx={{ width: 30, height: 30, color:'#DDD' }}/>
          </IconButton>
        </Tooltip>
        <img src={"/images/kleandbmaiWhite.png"} style={{ opacity: .5, filter: 'brightness(50%) contrast(150%)' }} width="130" height="16"/>
      </Box>
    </React.Fragment>
  );
}